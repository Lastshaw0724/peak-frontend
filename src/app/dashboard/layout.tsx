'use client';

import { ProtectedRoute } from '@/components/autenticacion/protected-route';
import { Sidebar } from '@/components/panel/sidebar';
import { DashboardHeader } from '@/components/panel/header';
import { SurveyProvider } from '@/components/providers/survey-provider';
import { TableProvider } from '@/components/providers/table-provider';
import { MenuProvider } from '@/components/providers/menu-provider';
import { DiscountProvider } from '@/components/providers/discount-provider';
import { InventoryProvider } from '@/components/providers/inventory-provider';
import { OrderProvider } from '@/components/providers/order-provider';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0">
                <DashboardHeader />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto no-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['admin', 'cashier']}>
            <SurveyProvider>
              <TableProvider>
                <MenuProvider>
                  <DiscountProvider>
                    <InventoryProvider>
                      <OrderProvider>
                         <DashboardLayoutContent>{children}</DashboardLayoutContent>
                      </OrderProvider>
                    </InventoryProvider>
                  </DiscountProvider>
                </MenuProvider>
              </TableProvider>
            </SurveyProvider>
        </ProtectedRoute>
    );
}
