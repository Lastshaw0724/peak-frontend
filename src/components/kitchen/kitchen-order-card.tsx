
'use client';

import type { Order } from '@/lib/types';
import { useOrder } from '@/hooks/use-order';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function KitchenOrderCard({ order }: { order: Order }) {
  const { updateOrderStatus } = useOrder();
  
  const cardBorderColor = {
    new: 'border-destructive',
    preparing: 'border-primary',
    ready: 'border-green-600',
    delivered: 'border-transparent',
    paid: 'border-transparent'
  };

  const statusConfig = {
    new: { label: 'Nuevo', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    preparing: { label: 'Preparando', className: 'bg-primary/20 text-primary/80 border-primary/30' },
    ready: { label: 'Listo', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    delivered: { label: 'Entregado', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    paid: { label: 'Pagado', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  };

  const currentStatus = statusConfig[order.status];

  return (
    <Card className={cn("transition-all duration-300 border-2", cardBorderColor[order.status])}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="font-headline text-xl">Orden #{order.id.slice(-6)}</CardTitle>
                 <CardDescription className="font-semibold pt-1">{order.tableName}</CardDescription>
            </div>
             <div className="text-right">
                {currentStatus && (
                    <Badge variant="outline" className={cn("capitalize", currentStatus.className)}>
                        {currentStatus.label}
                    </Badge>
                )}
                <CardDescription className="mt-1">{order.timestamp.toLocaleTimeString()}</CardDescription>
            </div>
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
