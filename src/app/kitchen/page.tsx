'use client';
import { KitchenDisplay } from '@/components/kitchen/kitchen-display';
import { AppHeader } from '@/components/header';
import ProtectedRoute from '@/components/auth/protected-route';

function KitchenPageContent() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title="Kitchen Display" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <KitchenDisplay />
      </main>
    </div>
  );
}

export default function KitchenPage() {
    return (
        <ProtectedRoute allowedRoles={['cook', 'admin']}>
            <KitchenPageContent />
        </ProtectedRoute>
    )
}
