
import type { Metadata } from 'next';
import './globals.css';
import { ProveedorPedidos } from '@/components/proveedores/proveedor-pedidos';
import { ProveedorAutenticacion } from '@/components/proveedores/proveedor-autenticacion';
import { Toaster } from "@/components/ui/toaster"
import { ProveedorEncuestas } from '@/components/proveedores/proveedor-encuestas';
import { ProveedorMesas } from '@/components/proveedores/proveedor-mesas';
import { ProveedorMenu } from '@/components/proveedores/proveedor-menu';
import { ProveedorDescuentos } from '@/components/proveedores/proveedor-descuentos';
import { ProveedorPreferencias } from '@/components/proveedores/proveedor-preferencias';
import { ProveedorInventario } from '@/components/proveedores/proveedor-inventario';

export const metadata: Metadata = {
  title: 'GustoGo | Sistema para Restaurantes',
  description: 'Optimizando las operaciones del restaurante desde el pedido hasta la cocina.',
};

export default function LayoutPrincipal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen">
        <ProveedorAutenticacion>
          <ProveedorPreferencias>
            <ProveedorEncuestas>
              <ProveedorMesas>
                <ProveedorMenu>
                  <ProveedorDescuentos>
                    <ProveedorInventario>
                      <ProveedorPedidos>
                        {children}
                        <Toaster />
                      </ProveedorPedidos>
                    </ProveedorInventario>
                  </ProveedorDescuentos>
                </ProveedorMenu>
              </ProveedorMesas>
            </ProveedorEncuestas>
          </ProveedorPreferencias>
        </ProveedorAutenticacion>
      </body>
    </html>
  );
}
