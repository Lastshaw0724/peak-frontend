'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Percent, PlusCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast";


const initialDiscounts = [
  { id: 'dsc-1', name: 'Martes Loco', code: 'MARTES20', value: '20%', status: true, used: 45, expires: '31/12/2024' },
  { id: 'dsc-2', name: 'Combo Pareja', code: 'AMOR10', value: '$10.00', status: true, used: 120, expires: 'N/A' },
  { id: 'dsc-3', name: 'Descuento de Verano', code: 'VERANO15', value: '15%', status: false, used: 210, expires: '30/08/2024' },
  { id: 'dsc-4', name: 'Primera Compra', code: 'NUEVO', value: '25%', status: true, used: 88, expires: 'N/A' },
];

const discountSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
    code: z.string().min(4, "El código debe tener al menos 4 caracteres.").toUpperCase(),
    value: z.string().min(1, "El valor es requerido. Ej: 15% o $10.00"),
    expires: z.string().optional(),
});


export default function DiscountsPage() {
    const [discounts, setDiscounts] = useState(initialDiscounts);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof discountSchema>>({
        resolver: zodResolver(discountSchema),
        defaultValues: {
            name: "",
            code: "",
            value: "",
            expires: "N/A",
        },
    });

    function onSubmit(values: z.infer<typeof discountSchema>) {
        const newDiscount = {
            id: `dsc-${Date.now()}`,
            ...values,
            expires: values.expires || 'N/A',
            status: true,
            used: 0,
        };
        setDiscounts(prev => [...prev, newDiscount]);
        toast({
            title: "Descuento Creado",
            description: `El descuento "${newDiscount.name}" ha sido añadido.`
        });
        form.reset();
        setIsDialogOpen(false);
    }

    const handleStatusChange = (id: string, newStatus: boolean) => {
        setDiscounts(prev =>
            prev.map(d => (d.id === id ? { ...d, status: newStatus } : d))
        );
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <Percent className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-2xl font-headline">Descuentos</CardTitle>
                        <CardDescription>Crea y administra promociones y descuentos.</CardDescription>
                    </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                         <Button>
                            <PlusCircle className="mr-2" />
                            Crear Descuento
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Descuento</DialogTitle>
                            <DialogDescription>
                                Completa los detalles para crear una nueva promoción.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre del Descuento</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Descuento de Fin de Semana" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Código</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: FINDE25" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                               <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Valor (Ej: 15% o $10)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="15% o $10.00" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="expires"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha de Expiración (Opcional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="dd/mm/yyyy o N/A" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">Cancelar</Button>
                                    </DialogClose>
                                    <Button type="submit">Guardar Descuento</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Código</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Usos</TableHead>
                             <TableHead>Expira</TableHead>
                            <TableHead className="text-right">Activo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {discounts.map(discount => (
                             <TableRow key={discount.id}>
                                <TableCell className="font-medium">{discount.name}</TableCell>
                                <TableCell><Badge variant="secondary">{discount.code}</Badge></TableCell>
                                <TableCell className="font-semibold text-primary">{discount.value}</TableCell>
                                <TableCell>{discount.used}</TableCell>
                                <TableCell>{discount.expires}</TableCell>
                                <TableCell className="text-right">
                                    <Switch
                                        checked={discount.status}
                                        onCheckedChange={(checked) => handleStatusChange(discount.id, checked)}
                                        aria-label={`Activate discount ${discount.name}`}
                                    />
                                </TableCell>
                             </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}