'use client';

import { ProtectedRoute } from '@/components/autenticacion/protected-route';
import { WaiterSidebar } from '@/components/mesero/sidebar';
import { WaiterHeader } from '@/components/mesero/header';
import { useSurvey } from '@/hooks/use-survey';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';
import { OrderProvider } from '@/components/providers/order-provider';
import { TableProvider } from '@/components/providers/table-provider';
import { MenuProvider } from '@/components/providers/menu-provider';
import { SurveyProvider } from '@/components/providers/survey-provider';
import { DiscountProvider } from '@/components/providers/discount-provider';

function WaiterLayoutContent({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { surveys } = useSurvey();
    const { toast } = useToast();
    const notifiedSurveyIdsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!user || (user.role !== 'waiter' && user.role !== 'admin')) return;
        
        const relevantSurveys = user.role === 'admin' 
            ? surveys 
            : surveys.filter(s => s.waiterId === user.id);

        relevantSurveys.forEach(survey => {
        if (!notifiedSurveyIdsRef.current.has(survey.id)) {
            const title = user.role === 'admin'
                ? `Feedback para ${survey.waiterName}`
                : `¡Nuevo Feedback Recibido!`;
            
            toast({
            title: title,
            description: `${survey.customerName} dio una calificación de ${survey.rating}/5. "${survey.comment || 'Sin comentario.'}"`,
            duration: 10000,
            });
            
            notifiedSurveyIdsRef.current.add(survey.id);
        }
        });

    }, [surveys, user, toast]);

    return (
        <div className="flex min-h-screen bg-[#1C1C1C] text-white">
            <WaiterSidebar />
            <div className="flex flex-col flex-1">
                <WaiterHeader />
                <main className="flex-1 overflow-y-auto no-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function WaiterLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['waiter', 'admin']}>
            <SurveyProvider>
                <MenuProvider>
                    <TableProvider>
                        <DiscountProvider>
                            <OrderProvider>
                                <WaiterLayoutContent>{children}</WaiterLayoutContent>
                            </OrderProvider>
                        </DiscountProvider>
                    </TableProvider>
                </MenuProvider>
            </SurveyProvider>
        </ProtectedRoute>
    );
}
