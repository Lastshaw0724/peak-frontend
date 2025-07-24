
'use client';
import { CabeceraApp } from '@/components/cabecera';
import { MenuCliente } from '@/components/menu/menu-cliente';
import { RutaProtegida } from '@/components/autenticacion/ruta-protegida';
import { usarPreferencias } from '@/hooks/usar-preferencias';
import { Skeleton } from '@/components/ui/skeleton';

function ContenidoPaginaMenuCliente() {
    return (
        <div className="bg-background min-h-screen">
            <CabeceraApp title="Nuestro Menú" />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">
                     <h1 className="text-5xl md:text-6xl font-bold font-headline text-foreground">
                        Saborea el Sabor
                    </h1>
                    <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                        Una selección curada de platos auténticos, elaborados con los ingredientes más frescos y pasión por el sabor.
                    </p>
                </div>
                <MenuCliente />
            </main>
        </div>
    );
}

export default function PaginaMenuCliente() {
    const { publicMenu, isLoading } = usarPreferencias();

    if (isLoading) {
        return (
             <div className="bg-background min-h-screen">
                <CabeceraApp title="Nuestro Menú" />
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-12">
                        <Skeleton className="h-16 w-3/4 mx-auto" />
                        <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
                    </div>
                     <div className="space-y-12">
                      <Skeleton className="h-10 w-1/4 mx-auto mb-8" />
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Skeleton className="h-80 w-full rounded-lg" />
                        <Skeleton className="h-80 w-full rounded-lg" />
                        <Skeleton className="h-80 w-full rounded-lg" />
                      </div>
                    </div>
                </main>
            </div>
        )
    }

    if (publicMenu) {
        return <ContenidoPaginaMenuCliente />;
    }

    return (
        <RutaProtegida allowedRoles={['customer', 'waiter', 'admin']}>
            <ContenidoPaginaMenuCliente />
        </RutaProtegida>
    );
}
