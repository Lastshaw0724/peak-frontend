'use client';

import { useOrder } from '@/hooks/use-order';
import { WaiterOrderCard } from './waiter-order-card';
import { History } from 'lucide-react';

export function ActiveOrdersDisplay() {
  const { submittedOrders } = useOrder();

  const newOrders = submittedOrders.filter(order => order.status === 'new');
  const preparingOrders = submittedOrders.filter(order => order.status === 'preparing');
  const readyOrders = submittedOrders.filter(order => order.status === 'ready');

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-background text-foreground h-full">
      {submittedOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center text-muted-foreground">
          <History className="w-24 h-24 mb-4 text-primary/50" />
          <h2 className="text-3xl font-headline">No Hay Pedidos Activos</h2>
          <p className="mt-2 text-lg">Los pedidos confirmados aparecerán aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <section>
            <h2 className="text-2xl font-headline text-red-400 mb-4 pb-2 border-b-2 border-red-400/50">Nuevos ({newOrders.length})</h2>
            <div className="space-y-4">
              {newOrders.map(order => <WaiterOrderCard key={order.id} order={order} />)}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-headline text-primary mb-4 pb-2 border-b-2 border-primary/50">Preparando ({preparingOrders.length})</h2>
            <div className="space-y-4">
              {preparingOrders.map(order => <WaiterOrderCard key={order.id} order={order} />)}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-headline text-green-400 mb-4 pb-2 border-b-2 border-green-400/50">Listos ({readyOrders.length})</h2>
            <div className="space-y-4">
              {readyOrders.map(order => <WaiterOrderCard key={order.id} order={order} />)}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
