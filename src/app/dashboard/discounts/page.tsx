
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
import { Percent, PlusCircle, Trash2 } from 'lucide-react';
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useDiscount } from '@/hooks/use-discount';


const discountSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
    code: z.string().min(4, "El código debe tener al menos 4 caracteres.").toUpperCase(),
    value: z.string().min(1, "El valor es requerido. Ej: 15% o $10.00"),
    expires: z.string().optional(),
});


export default function DiscountsPage() {
    const { discounts, addDiscount, updateDiscountStatus, deleteDiscount } = useDiscount();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        const newDiscountData = {
            ...values,
            expires: values.expires || 'N/A',
        };
        addDiscount(newDiscountData);
        form.reset();
        setIsDialogOpen(false);
    }

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <Percent className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-2xl font-headline">Descuentos</CardTitle>
                        <CardDescription>Crea y administra promociones y descuentos.</CardDescription>
                    </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                         <Button className="w-full sm:w-auto">
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
                <div className="relative w-full overflow-auto no-scrollbar">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Código</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Usos</TableHead>
                                <TableHead>Expira</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {discounts.map(discount => (
                                 <TableRow key={discount.id}>
                                    <TableCell className="font-medium whitespace-nowrap">{discount.name}</TableCell>
                                    <TableCell><Badge variant="secondary">{discount.code}</Badge></TableCell>
                                    <TableCell className="font-semibold text-primary whitespace-nowrap">{discount.value}</TableCell>
                                    <TableCell>{discount.used}</TableCell>
                                    <TableCell>{discount.expires}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <Switch
                                                checked={discount.status}
                                                onCheckedChange={(checked) => updateDiscountStatus(discount.id, checked)}
                                                aria-label={`Activate discount ${discount.name}`}
                                            />
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="icon" className="h-9 w-9">
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Eliminar descuento</span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Esta acción no se puede deshacer. Esto eliminará permanentemente el descuento "{discount.name}".
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteDiscount(discount.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                            Sí, eliminar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                 </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
