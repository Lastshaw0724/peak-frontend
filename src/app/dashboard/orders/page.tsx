'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, TicketPercent } from 'lucide-react';
import { useOrder } from '@/hooks/use-order';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/lib/types';


export default function OrderHistoryPage() {
    const { submittedOrders, updateOrderStatus } = useOrder();

    const statusColors: Record<OrderStatus, string> = {
        new: 'bg-red-500/20 text-red-400 border-red-500/30',
        preparing: 'bg-primary/20 text-primary/80 border-primary/30',
        ready: 'bg-green-500/20 text-green-400 border-green-500/30',
        delivered: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        paid: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    
    const statusDisplayNames: Record<OrderStatus, string> = {
        new: 'Nuevo',
        preparing: 'Preparando',
        ready: 'Listo',
        delivered: 'Entregado',
        paid: 'Pagado',
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <History className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="text-2xl font-headline">Historial de Pedidos</CardTitle>
                    <CardDescription>Revisa todos los pedidos realizados en el restaurante.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID Pedido</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Mesa</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Artículos</TableHead>
                            <TableHead>Pago</TableHead>
                            <TableHead>Descuento</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submittedOrders.length > 0 ? submittedOrders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono">#{order.id.slice(-6)}</TableCell>
                                <TableCell>{order.timestamp.toLocaleString()}</TableCell>
                                <TableCell>{order.tableName}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn("capitalize", statusColors[order.status])}>
                                        {statusDisplayNames[order.status] || order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <ul className="list-disc list-inside text-xs">
                                        {order.items.map(item => (
                                            <li key={item.id}>{item.quantity}x {item.name}</li>
                                        ))}
                                    </ul>
                                </TableCell>
                                <TableCell className="capitalize">{order.paymentMethod}</TableCell>
                                <TableCell>
                                    {order.discountCode ? (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            <TicketPercent className="h-3 w-3" />
                                            {order.discountCode} (-${order.discountAmount.toFixed(2)})
                                        </Badge>
                                    ) : (
                                        'N/A'
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    {order.status === 'delivered' && (
                                        <Button size="sm" onClick={() => updateOrderStatus(order.id, 'paid')} className="bg-purple-600 hover:bg-purple-700">
                                            Marcar como Pagado
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        )) : (
                             <TableRow>
                                <TableCell colSpan={10} className="text-center h-24">
                                    Aún no hay pedidos registrados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
