
'use client';

import { usarPedidos } from '@/hooks/usar-pedidos';
import { TarjetaPedidoMesero } from '../mesero/tarjeta-pedido-mesero';
import { History, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';

export function PantallaPedidosActivos() {
  const { submittedOrders } = usarPedidos();
  const [searchTerm, setSearchTerm] = useState('');

  const activeOrders = useMemo(() => {
    return submittedOrders.filter(order => ['new', 'preparing', 'ready'].includes(order.status));
  }, [submittedOrders]);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      return activeOrders;
    }
    return activeOrders.filter(order =>
      order.id.slice(-6).toLowerCase().includes(term) ||
      order.customerName.toLowerCase().includes(term) ||
      order.waiterName.toLowerCase().includes(term)
    );
  }, [activeOrders, searchTerm]);

  const newOrders = filteredOrders.filter(order => order.status === 'new');
  const preparingOrders = filteredOrders.filter(order => order.status === 'preparing');
  const readyOrders = filteredOrders.filter(order => order.status === 'ready');

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full">
      <div className="mb-6">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <Input
                placeholder="Buscar por ID, cliente o mesero..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md pl-10 bg-zinc-800 border-zinc-700 placeholder:text-zinc-400 text-white"
            />
        </div>
      </div>
      
      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center text-muted-foreground">
          <History className="w-24 h-24 mb-4 text-primary/50" />
          <h2 className="text-3xl font-headline">No Hay Pedidos Activos</h2>
          <p className="mt-2 text-lg">Los pedidos confirmados aparecerán aquí.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center text-muted-foreground">
          <Search className="w-24 h-24 mb-4 text-primary/50" />
          <h2 className="text-3xl font-headline">No se encontraron pedidos</h2>
          <p className="mt-2 text-lg">Intenta con otro término de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <section>
            <h2 className="text-2xl font-headline text-red-400 mb-4 pb-2 border-b-2 border-red-400/50">Nuevos ({newOrders.length})</h2>
            <div className="space-y-4">
              {newOrders.map(order => <TarjetaPedidoMesero key={order.id} order={order} />)}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-headline text-primary mb-4 pb-2 border-b-2 border-primary/50">Preparando ({preparingOrders.length})</h2>
            <div className="space-y-4">
              {preparingOrders.map(order => <TarjetaPedidoMesero key={order.id} order={order} />)}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-headline text-green-400 mb-4 pb-2 border-b-2 border-green-400/50">Listos ({readyOrders.length})</h2>
            <div className="space-y-4">
              {readyOrders.map(order => <TarjetaPedidoMesero key={order.id} order={order} />)}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
