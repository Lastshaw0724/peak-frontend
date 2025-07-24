
'use client';

import { RutaProtegida } from '@/components/autenticacion/ruta-protegida';
import { BarraLateral } from '@/components/panel/barra-lateral';
import { CabeceraPanel } from '@/components/panel/cabecera';

function LayoutPanelContenido({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <BarraLateral />
            <div className="flex flex-col flex-1 min-w-0">
                <CabeceraPanel />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto no-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function LayoutPanel({ children }: { children: React.ReactNode }) {
    return (
        <RutaProtegida allowedRoles={['admin', 'cashier']}>
            <LayoutPanelContenido>{children}</LayoutPanelContenido>
        </RutaProtegida>
    );
}
