'use client';

import type { Order } from '@/lib/types';
import { useOrder } from '@/hooks/use-order';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export function KitchenOrderCard({ order }: { order: Order }) {
  const { updateOrderStatus } = useOrder();
  
  const cardBorderColor = {
    new: 'border-destructive',
    preparing: 'border-primary',
    ready: 'border-green-600',
  };

  return (
    <Card className={cn("transition-all duration-300 border-2", cardBorderColor[order.status])}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="font-headline text-xl">Orden #{order.id.slice(-6)}</CardTitle>
                 <CardDescription className="font-semibold pt-1">{order.tableName}</CardDescription>
            </div>
            <CardDescription>{order.timestamp.toLocaleTimeString()}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {order.items.map((item, index) => (
          <div key={`${item.id}-${index}`}>
            <p className="font-bold text-lg">
              {item.quantity}x {item.name}
            </p>
            <Separator className="my-2"/>
          </div>
        ))}
      </CardContent>
      {order.status !== 'ready' && (
        <CardFooter className="flex justify-end gap-2">
          {order.status === 'new' && (
            <Button onClick={() => updateOrderStatus(order.id, 'preparing')}>Start Preparing</Button>
          )}
          {order.status === 'preparing' && (
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => updateOrderStatus(order.id, 'ready')}>Mark as Ready</Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
