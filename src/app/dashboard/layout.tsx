
'use client';

import { RutaProtegida } from '@/components/autenticacion/ruta-protegida';
import { BarraLateral } from '@/components/panel/barra-lateral';
import { CabeceraPanel } from '@/components/panel/cabecera';
import { ProveedorEncuestas } from '@/components/proveedores/proveedor-encuestas';
import { ProveedorMesas } from '@/components/proveedores/proveedor-mesas';
import { ProveedorMenu } from '@/components/proveedores/proveedor-menu';
import { ProveedorDescuentos } from '@/components/proveedores/proveedor-descuentos';
import { ProveedorInventario } from '@/components/proveedores/proveedor-inventario';
import { ProveedorPedidos } from '@/components/proveedores/proveedor-pedidos';

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
            <ProveedorEncuestas>
              <ProveedorMesas>
                <ProveedorMenu>
                  <ProveedorDescuentos>
                    <ProveedorInventario>
                      <ProveedorPedidos>
                         <LayoutPanelContenido>{children}</LayoutPanelContenido>
                      </ProveedorPedidos>
                    </ProveedorInventario>
                  </ProveedorDescuentos>
                </ProveedorMenu>
              </ProveedorMesas>
            </ProveedorEncuestas>
        </RutaProtegida>
    );
}
