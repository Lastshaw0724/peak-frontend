'use client';

import { useOrder } from '@/hooks/use-order';
import { KitchenOrderCard } from './kitchen-order-card';
import { ChefHat } from 'lucide-react';

export function KitchenDisplay() {
  const { submittedOrders } = useOrder();

  const newOrders = submittedOrders.filter(order => order.status === 'new');
  const preparingOrders = submittedOrders.filter(order => order.status === 'preparing');
  const readyOrders = submittedOrders.filter(order => order.status === 'ready').slice(0, 5); // Show last 5 ready orders

  return (
    <div>
      {submittedOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center text-muted-foreground">
          <ChefHat className="w-24 h-24 mb-4 text-primary/50" />
          <h2 className="text-3xl font-headline">Aún no hay Pedidos</h2>
          <p className="mt-2 text-lg">Esperando nuevos pedidos desde el salón...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <section>
            <h2 className="text-3xl font-headline text-destructive mb-4 pb-2 border-b-2 border-destructive">Nuevos ({newOrders.length})</h2>
            <div className="space-y-6">
              {newOrders.map(order => <KitchenOrderCard key={order.id} order={order} />)}
            </div>
          </section>
          <section>
            <h2 className="text-3xl font-headline text-primary mb-4 pb-2 border-b-2 border-primary">Preparando ({preparingOrders.length})</h2>
            <div className="space-y-6">
              {preparingOrders.map(order => <KitchenOrderCard key={order.id} order={order} />)}
            </div>
          </section>
          <section>
            <h2 className="text-3xl font-headline text-green-600 mb-4 pb-2 border-b-2 border-green-600">Listos ({readyOrders.length})</h2>
            <div className="space-y-6 opacity-60">
              {readyOrders.map(order => <KitchenOrderCard key={order.id} order={order} />)}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
