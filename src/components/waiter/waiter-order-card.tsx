'use client';

import type { Order } from '@/lib/types';
import { useOrder } from '@/hooks/use-order';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CheckCheck } from 'lucide-react';

export function WaiterOrderCard({ order }: { order: Order }) {
  const { updateOrderStatus } = useOrder();

  const statusConfig = {
    new: { label: 'Nuevo', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    preparing: { label: 'Preparando', className: 'bg-primary/20 text-primary/80 border-primary/30' },
    ready: { label: 'Listo', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    delivered: { label: 'Entregado', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  };

  const cardBorderColor = {
    new: 'border-red-500',
    preparing: 'border-primary',
    ready: 'border-green-600',
    delivered: 'border-blue-500',
  };

  const currentStatus = statusConfig[order.status];

  return (
    <Card className={cn("transition-all duration-300 border-2 bg-zinc-800/80 border-zinc-700 flex flex-col", cardBorderColor[order.status])}>
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="font-headline text-lg">Orden #{order.id.slice(-6)}</CardTitle>
          <Badge variant="outline" className={cn("capitalize", currentStatus.className)}>
            {currentStatus.label}
          </Badge>
        </div>
        <CardDescription className="text-sm font-semibold pt-1">{order.tableName} - {order.customerName}</CardDescription>
        <CardDescription className="text-xs pt-1">{order.timestamp.toLocaleTimeString()}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2 flex-grow">
        {order.items.map((item, index) => (
          <div key={`${item.id}-${index}`}>
            <p className="font-semibold text-sm">
              {item.quantity}x {item.name}
            </p>
            {index < order.items.length - 1 && <Separator className="my-2 bg-zinc-600"/>}
          </div>
        ))}
      </CardContent>
      {order.status === 'ready' && (
        <CardFooter className="p-4 pt-0">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => updateOrderStatus(order.id, 'delivered')}>
                <CheckCheck className="mr-2 h-4 w-4" />
                Marcar como Entregado
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
