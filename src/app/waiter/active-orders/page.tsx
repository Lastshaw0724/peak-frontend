'use client';
import { KitchenDisplay } from '@/components/kitchen/kitchen-display';
import { AppHeader } from '@/components/header';
import ProtectedRoute from '@/components/auth/protected-route';

function ActiveOrdersPageContent() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title="Pedidos en Curso" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <KitchenDisplay />
      </main>
    </div>
  );
}

export default function ActiveOrdersPage() {
    return (
        <ProtectedRoute allowedRoles={['waiter', 'admin', 'cashier', 'cook']}>
            <ActiveOrdersPageContent />
        </ProtectedRoute>
    )
}
