'use client';
import { MenuDisplay } from './menu-display';
import { OrderSummary } from './order-summary';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTable } from '@/hooks/use-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export function WaiterInterface() {
  const { activeTable } = useTable();

  if (!activeTable) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400 p-4">
        <MapPin className="w-24 h-24 mb-4 text-primary" />
        <h2 className="text-3xl font-headline mb-2 text-white">No hay una mesa activa</h2>
        <p className="mb-6 max-w-sm">Por favor, ve a la sección de mesas y asigna una para poder comenzar a tomar un nuevo pedido.</p>
        <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
          <Link href="/mesero/asignar-mesa">
            Ir a Asignar Mesa
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-0 overflow-hidden">
      <ScrollArea className="lg:col-span-2 xl:col-span-3 h-[calc(100vh-4rem)] no-scrollbar">
        <MenuDisplay />
      </ScrollArea>
      <aside className="lg:col-span-1 xl:col-span-2 bg-card h-[calc(100vh-4rem)]">
        <OrderSummary />
      </aside>
    </main>
  );
}
