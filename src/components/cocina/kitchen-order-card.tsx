
'use client';

import { useState } from 'react';
import type { Order } from '@/lib/types';
import { useOrder } from '@/hooks/use-order';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function KitchenOrderCard({ order }: { order: Order }) {
  const { startPreparingOrder, updateOrderStatus } = useOrder();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [prepTime, setPrepTime] = useState<number>(15);
  
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

  const handleStartPreparing = () => {
    if (prepTime > 0) {
      startPreparingOrder(order.id, prepTime);
      setIsDialogOpen(false);
    }
  };

  return (
    <Card className={cn("transition-all duration-300 border-2", cardBorderColor[order.status])}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="font-headline text-xl">Orden #{order.id.slice(-6)}</CardTitle>
                 <CardDescription className="font-semibold pt-1">{order.tableName}</CardDescription>
            </div>
             <div className="text-right space-y-1">
                {currentStatus && (
                    <Badge variant="outline" className={cn("capitalize", currentStatus.className)}>
                        {currentStatus.label}
                    </Badge>
                )}
                <CardDescription className="mt-1">{new Date(order.timestamp).toLocaleTimeString()}</CardDescription>
                {order.status === 'preparing' && order.preparationTime && (
                    <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4"/>
                        <span>{order.preparationTime} min</span>
                    </div>
                )}
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {order.items.map((item) => (
          <div key={item.orderItemId}>
            <p className="font-bold text-lg">
              {item.quantity}x {item.name}
            </p>
            {item.selectedExtras && item.selectedExtras.length > 0 && (
                <div className="pl-4 text-sm text-muted-foreground">
                    {item.selectedExtras.map(extra => (
                        <p key={extra.id}>+ {extra.name}</p>
                    ))}
                </div>
            )}
            <Separator className="my-2"/>
          </div>
        ))}
      </CardContent>
      {order.status !== 'ready' && (
        <CardFooter className="flex justify-end gap-2">
          {order.status === 'new' && (
            <>
              <Button onClick={() => setIsDialogOpen(true)}>Start Preparing</Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Establecer Tiempo de Preparación</DialogTitle>
                        <DialogDescription>
                            Ingresa el tiempo estimado en minutos para preparar el pedido #{order.id.slice(-6)}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="space-y-2">
                            <Label htmlFor="prep-time">Tiempo de Preparación (minutos)</Label>
                            <Input
                                id="prep-time"
                                type="number"
                                value={prepTime}
                                onChange={(e) => setPrepTime(Number(e.target.value))}
                                min="1"
                                className="text-lg"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleStartPreparing}>Confirmar e Iniciar</Button>
                    </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
          {order.status === 'preparing' && (
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => updateOrderStatus(order.id, 'ready')}>Mark as Ready</Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
