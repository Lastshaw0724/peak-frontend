'use client';
import { WaiterInterface } from '@/components/waiter/waiter-interface';
import { AppHeader } from '@/components/header';
import ProtectedRoute from '@/components/auth/protected-route';

function WaiterPageContent() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader title="Waiter View" />
      <WaiterInterface />
    </div>
  );
}

export default function WaiterPage() {
    return (
        <ProtectedRoute allowedRoles={['waiter', 'admin']}>
            <WaiterPageContent />
        </ProtectedRoute>
    )
}
