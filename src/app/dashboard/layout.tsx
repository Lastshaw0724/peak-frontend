
'use client';

import ProtectedRoute from '@/components/autenticacion/protected-route';
import { Sidebar } from '@/components/panel/sidebar';
import { DashboardHeader } from '@/components/panel/header';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0">
                <DashboardHeader />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['admin', 'cashier']}>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </ProtectedRoute>
    );
}
