'use client';
import { WaiterDashboard } from '@/components/waiter/waiter-dashboard';
import ProtectedRoute from '@/components/auth/protected-route';
import { useSurvey } from '@/hooks/use-survey';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';

function WaiterPageContent() {
  const { user } = useAuth();
  const { surveys } = useSurvey();
  const { toast } = useToast();
  const notifiedSurveyIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user || (user.role !== 'waiter' && user.role !== 'admin')) return;
    
    // Admins can see all notifications for demo/management purposes
    const relevantSurveys = user.role === 'admin' 
        ? surveys 
        : surveys.filter(s => s.waiterId === user.id);

    relevantSurveys.forEach(survey => {
      if (!notifiedSurveyIdsRef.current.has(survey.id)) {
        const title = user.role === 'admin'
            ? `Feedback for ${survey.waiterName}`
            : `New Feedback Received!`;
        
        toast({
          title: title,
          description: `${survey.customerName} gave a rating of ${survey.rating}/5. "${survey.comment || 'No comment.'}"`,
          duration: 10000,
        });
        
        notifiedSurveyIdsRef.current.add(survey.id);
      }
    });

  }, [surveys, user, toast]);

  return <WaiterDashboard />;
}

export default function WaiterPage() {
    return (
        <ProtectedRoute allowedRoles={['waiter', 'admin', 'cashier']}>
            <WaiterPageContent />
        </ProtectedRoute>
    )
}
