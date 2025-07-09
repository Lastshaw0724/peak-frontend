
'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, TicketPercent, Users } from 'lucide-react';
import { useOrder } from '@/hooks/use-order';
import { useTable } from '@/hooks/use-table';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus } from '@/lib/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


export default function OrderHistoryPage() {
    const { submittedOrders, updateOrderStatus } = useOrder();
    const { updateTableStatus } = useTable();
    const { users } = useAuth();
    const [waiterFilter, setWaiterFilter] = useState('all');

    const waiters = useMemo(() => users.filter(user => user.role === 'waiter'), [users]);

    const filteredOrders = useMemo(() => {
        if (waiterFilter === 'all') {
            return submittedOrders;
        }
        return submittedOrders.filter(order => order.waiterId === waiterFilter);
    }, [submittedOrders, waiterFilter]);

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

    const handleMarkAsPaid = (order: Order) => {
        updateOrderStatus(order.id, 'paid');
        updateTableStatus(order.tableId, 'available');
    }

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <History className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-2xl font-headline">Historial de Pedidos</CardTitle>
                        <CardDescription>Revisa todos los pedidos realizados en el restaurante.</CardDescription>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <Select value={waiterFilter} onValueChange={setWaiterFilter}>
                        <SelectTrigger className="w-full sm:w-[220px]">
                            <SelectValue placeholder="Filtrar por mesero" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los Pedidos</SelectItem>
                            {waiters.map(waiter => (
                                <SelectItem key={waiter.id} value={waiter.id}>
                                    {waiter.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID Pedido</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Mesa</TableHead>
                            <TableHead>Mesero</TableHead>
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
                        {filteredOrders.length > 0 ? filteredOrders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono">#{order.id.slice(-6)}</TableCell>
                                <TableCell>{order.timestamp.toLocaleString()}</TableCell>
                                <TableCell>{order.tableName}</TableCell>
                                <TableCell>{order.waiterName}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn("capitalize", statusColors[order.status])}>
                                        {statusDisplayNames[order.status] || order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <ul className="list-disc list-inside text-xs">
                                        {order.items.map(item => (
                                            <li key={item.orderItemId}>
                                                {item.quantity}x {item.name}
                                                {item.selectedExtras && item.selectedExtras.length > 0 && (
                                                    <span className="text-muted-foreground">
                                                      {' (' + item.selectedExtras.map(e => e.name).join(', ') + ')'}
                                                    </span>
                                                )}
                                            </li>
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
                                        <Button size="sm" onClick={() => handleMarkAsPaid(order)} className="bg-purple-600 hover:bg-purple-700">
                                            Marcar como Pagado
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        )) : (
                             <TableRow>
                                <TableCell colSpan={11} className="text-center h-24">
                                    Aún no hay pedidos que coincidan con el filtro seleccionado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
