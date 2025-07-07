'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';
import { useOrder } from '@/hooks/use-order';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/lib/types';


export default function OrderHistoryPage() {
    const { submittedOrders } = useOrder();

    const statusColors: Record<OrderStatus, string> = {
        new: 'bg-red-500/20 text-red-400 border-red-500/30',
        preparing: 'bg-primary/20 text-primary/80 border-primary/30',
        ready: 'bg-green-500/20 text-green-400 border-green-500/30',
        delivered: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    }

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
                            <TableHead>Método de Pago</TableHead>
                            <TableHead className="text-right">Total</TableHead>
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
                                        {order.status}
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
                                <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
                            </TableRow>
                        )) : (
                             <TableRow>
                                <TableCell colSpan={8} className="text-center h-24">
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
