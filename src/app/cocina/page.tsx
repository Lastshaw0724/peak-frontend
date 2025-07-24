'use client';
import { KitchenDisplay } from '@/components/cocina/kitchen-display';
import { AppHeader } from '@/components/header';
import { ProtectedRoute } from '@/components/autenticacion/protected-route';
import { OrderProvider } from '@/components/providers/order-provider';

function KitchenPageContent() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title="Pantalla de Cocina" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <KitchenDisplay />
      </main>
    </div>
  );
}

export default function KitchenPage() {
    return (
        <ProtectedRoute allowedRoles={['cook', 'admin']}>
          <OrderProvider>
            <KitchenPageContent />
          </OrderProvider>
        </ProtectedRoute>
    )
}
