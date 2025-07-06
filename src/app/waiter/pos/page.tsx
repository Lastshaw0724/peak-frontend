'use client';
import { WaiterInterface } from '@/components/waiter/waiter-interface';
import { AppHeader } from '@/components/header';
import ProtectedRoute from '@/components/auth/protected-route';

function WaiterPOSPageContent() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader title="Point of Sale" />
      <WaiterInterface />
    </div>
  );
}

export default function WaiterPOSPage() {
    return (
        <ProtectedRoute allowedRoles={['waiter', 'admin', 'cashier']}>
            <WaiterPOSPageContent />
        </ProtectedRoute>
    )
}
