
'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, TicketPercent, ListFilter, Calendar as CalendarIcon, MoreHorizontal, Printer, Send, Ban } from 'lucide-react';
import { useOrder } from '@/hooks/use-order';
import { useTable } from '@/hooks/use-table';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus, InvoiceOption } from '@/lib/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';


export default function OrderHistoryPage() {
    const { submittedOrders, updateOrderStatus } = useOrder();
    const { updateTableStatus } = useTable();
    const { users } = useAuth();
    const { toast } = useToast();
    
    const [waiterFilter, setWaiterFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

    const waiters = useMemo(() => users.filter(user => user.role === 'waiter'), [users]);

    const filteredOrders = useMemo(() => {
        return submittedOrders.filter(order => {
            const waiterMatch = waiterFilter === 'all' || order.waiterId === waiterFilter;
            const statusMatch = statusFilter === 'all' || order.status === statusFilter;
            const dateMatch = !dateFilter || isSameDay(new Date(order.timestamp), dateFilter);
            return waiterMatch && statusMatch && dateMatch;
        });
    }, [submittedOrders, waiterFilter, statusFilter, dateFilter]);

    const statusColors: Record<OrderStatus, string> = {
        new: 'bg-red-500/20 text-red-400 border-red-500/30',
        preparing: 'bg-primary/20 text-primary/80 border-primary/30',
        ready: 'bg-green-500/20 text-green-400 border-green-500/30',
        delivered: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        paid: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    
    const statusDisplayNames: Record<OrderStatus | 'all', string> = {
        all: 'Todos los Estados',
        new: 'Nuevo',
        preparing: 'Preparando',
        ready: 'Listo',
        delivered: 'Entregado',
        paid: 'Pagado',
    };

    const invoiceOptionConfig: Record<InvoiceOption, { text: string, icon: React.ElementType, className: string }> = {
        none: { text: 'No Requerida', icon: Ban, className: 'text-muted-foreground' },
        print: { text: 'Imprimir', icon: Printer, className: 'text-blue-500' },
        email: { text: 'Enviar', icon: Send, className: 'text-green-500' },
    };

    const handleMarkAsPaid = (order: Order) => {
        updateOrderStatus(order.id, 'paid');
        updateTableStatus(order.tableId, 'available');
    };

    const handlePrintInvoice = (orderId: string) => {
        toast({ title: 'Imprimiendo Factura', description: `La factura para el pedido #${orderId.slice(-6)} se está generando.` });
        // In a real app, this would trigger a print dialog.
    };

    const handleSendInvoice = (orderId: string) => {
        toast({ title: 'Factura Enviada', description: `La factura para el pedido #${orderId.slice(-6)} ha sido enviada por correo.` });
        // In a real app, this would trigger an email flow.
    };


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
                 <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 w-full sm:w-auto">
                    <Select value={waiterFilter} onValueChange={setWaiterFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filtrar por mesero" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los Meseros</SelectItem>
                            {waiters.map(waiter => (
                                <SelectItem key={waiter.id} value={waiter.id}>
                                    {waiter.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(statusDisplayNames).map(([key, value]) => (
                                <SelectItem key={key} value={key}>{value}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full sm:w-auto justify-start text-left font-normal",
                                    !dateFilter && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateFilter ? format(dateFilter, "PPP") : <span>Seleccionar fecha</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dateFilter}
                                onSelect={setDateFilter}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {dateFilter && (
                         <Button variant="ghost" onClick={() => setDateFilter(undefined)}>Limpiar</Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative w-full overflow-auto no-scrollbar">
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
                                <TableHead>Factura</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.length > 0 ? filteredOrders.map(order => {
                                const invoiceConfig = invoiceOptionConfig[order.invoiceOption || 'none'];
                                return (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono whitespace-nowrap">#{order.id.slice(-6)}</TableCell>
                                    <TableCell className="whitespace-nowrap">{new Date(order.timestamp).toLocaleString()}</TableCell>
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
                                            {order.items.map((item, index) => (
                                                <li key={`${item.orderItemId}-${index}`}>
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
                                    <TableCell>
                                        <div className={cn("flex items-center gap-1.5 text-xs font-medium", invoiceConfig.className)}>
                                           <invoiceConfig.icon className="h-3.5 w-3.5" />
                                           <span>{invoiceConfig.text}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        {order.status === 'delivered' && (
                                            <Button size="sm" onClick={() => handleMarkAsPaid(order)} className="bg-purple-600 hover:bg-purple-700">
                                                Marcar como Pagado
                                            </Button>
                                        )}
                                         {order.status === 'paid' && (order.invoiceOption === 'print' || order.invoiceOption === 'email') && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {order.invoiceOption === 'print' && (
                                                        <DropdownMenuItem onSelect={() => handlePrintInvoice(order.id)}>
                                                            <Printer className="mr-2 h-4 w-4" />
                                                            Imprimir Factura
                                                        </DropdownMenuItem>
                                                    )}
                                                    {order.invoiceOption === 'email' && (
                                                        <DropdownMenuItem onSelect={() => handleSendInvoice(order.id)}>
                                                            <Send className="mr-2 h-4 w-4" />
                                                            Enviar Factura
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}) : (
                                 <TableRow>
                                    <TableCell colSpan={12} className="text-center h-24">
                                        Aún no hay pedidos que coincidan con el filtro seleccionado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
