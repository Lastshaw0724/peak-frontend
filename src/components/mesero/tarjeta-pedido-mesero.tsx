
'use client';

import type { Pedido } from '@/lib/tipos';
import { usarPedidos } from '@/hooks/usar-pedidos';
import { usarMesas } from '@/hooks/usar-mesas';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import { CheckCheck, Pencil, Trash2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usarAutenticacion } from '@/hooks/usar-autenticacion';

export function TarjetaPedidoMesero({ order }: { order: Pedido }) {
  const { updateOrderStatus, deleteOrder, loadOrderForEdit } = usarPedidos();
  const { tables, setActiveTable } = usarMesas();
  const { user } = usarAutenticacion();
  const router = useRouter();
  const { toast } = useToast();

  const statusConfig: Record<string, { label: string, className: string }> = {
    new: { label: 'Nuevo', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    preparing: { label: 'Preparando', className: 'bg-primary/20 text-primary/80 border-primary/30' },
    ready: { label: 'Listo', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    delivered: { label: 'Entregado', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  };

  const cardBorderColor: Record<string, string> = {
    new: 'border-red-500',
    preparing: 'border-primary',
    ready: 'border-green-600',
    delivered: 'border-blue-500',
  };

  const currentStatus = statusConfig[order.status];

  const handleModify = async () => {
    // A waiter can only modify their own orders
    if (user && user.id !== order.waiterId) {
      toast({
        variant: 'destructive',
        title: 'Acción no permitida',
        description: 'Solo puedes modificar tus propios pedidos.',
      });
      return;
    }

    const orderData = await loadOrderForEdit(order.id);
    if (orderData) {
        const tableForOrder = tables.find(t => t.id === orderData.tableId);
        if (tableForOrder) {
            setActiveTable(tableForOrder);
            router.push('/mesero/pos');
        } else {
            toast({ title: 'Error', description: 'No se pudo encontrar la mesa asociada al pedido.', variant: 'destructive' });
        }
    }
  };

  const isMyOrder = user && user.id === order.waiterId;

  return (
    <Card className={cn("transition-all duration-300 border-2 bg-zinc-800/80 border-zinc-700 flex flex-col", cardBorderColor[order.status])}>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-lg">Pedido #{order.id.slice(-6)}</CardTitle>
            <CardDescription className="text-sm font-semibold pt-1">{order.tableName} - {order.customerName}</CardDescription>
            <CardDescription className="text-xs pt-1">{new Date(order.timestamp).toLocaleTimeString()} por {order.waiterName}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            {currentStatus &&
                <Badge variant="outline" className={cn("capitalize", currentStatus.className)}>
                    {currentStatus.label}
                </Badge>
            }
            {order.status === 'preparing' && order.preparationTime && (
                <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{order.preparationTime} min</span>
                </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2 flex-grow">
        {order.items.map((item) => (
          <div key={item.orderItemId}>
            <p className="font-semibold text-sm">
              {item.quantity}x {item.name}
            </p>
             {item.selectedExtras && item.selectedExtras.length > 0 && (
                <div className="pl-4 text-xs text-zinc-400">
                    {item.selectedExtras.map(extra => (
                        <p key={extra.id}>+ {extra.name}</p>
                    ))}
                </div>
            )}
            <Separator className="my-2 bg-zinc-600"/>
          </div>
        ))}
      </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
            {order.status === 'new' && (
                <>
                    <Button variant="outline" className="w-full border-zinc-600 hover:bg-zinc-700" onClick={handleModify} disabled={!isMyOrder}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modificar
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full" disabled={!isMyOrder}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancelar
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Seguro que quieres cancelar el pedido?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción no se puede deshacer. El pedido #{order.id.slice(-6)} para la mesa {order.tableName} será eliminado permanentemente.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>No, mantener pedido</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteOrder(order.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Sí, cancelar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}
            {order.status === 'ready' && (
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => updateOrderStatus(order.id, 'delivered')}>
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Marcar como Entregado
                </Button>
            )}
        </CardFooter>
    </Card>
  );
}
