'use client';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Warehouse, PlusCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePreferences } from '@/hooks/use-preferences';
import { useInventory } from '@/hooks/use-inventory';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const inventorySchema = z.object({
    name: z.string().min(3, "El nombre es requerido."),
    category: z.string().min(3, "La categoría es requerida."),
    supplier: z.string().min(3, "El proveedor es requerido."),
    stock: z.coerce.number().int().nonnegative("El stock debe ser un número positivo."),
    maxStock: z.coerce.number().int().positive("El stock máximo debe ser mayor que cero."),
}).refine(data => data.stock <= data.maxStock, {
    message: "El stock actual no puede ser mayor que el stock máximo.",
    path: ["stock"],
});

export default function InventoryPage() {
    const { lowStockThreshold } = usePreferences();
    const { toast } = useToast();
    const { inventory, addInventoryItem } = useInventory();
    const notifiedItemsRef = useRef(new Set<string>());
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof inventorySchema>>({
        resolver: zodResolver(inventorySchema),
        defaultValues: {
            name: "",
            category: "",
            supplier: "",
            stock: 0,
            maxStock: 100,
        },
    });

    function onSubmit(values: z.infer<typeof inventorySchema>) {
        addInventoryItem(values);
        form.reset();
        setIsDialogOpen(false);
    }

    useEffect(() => {
        inventory.forEach(item => {
            if (item.stock < lowStockThreshold && !notifiedItemsRef.current.has(item.id)) {
                toast({
                    variant: 'destructive',
                    title: 'Alerta de Stock Bajo',
                    description: `El insumo "${item.name}" está por debajo del umbral (${item.stock} unidades restantes).`,
                    duration: 8000,
                });
                notifiedItemsRef.current.add(item.id);
            }
        });
    }, [lowStockThreshold, toast, inventory]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <Warehouse className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-2xl font-headline">Inventario</CardTitle>
                        <CardDescription>Supervisa y gestiona el stock de tus insumos.</CardDescription>
                    </div>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                         <Button>
                            <PlusCircle className="mr-2" />
                            Añadir Insumo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Añadir Nuevo Insumo</DialogTitle>
                            <DialogDescription>
                                Completa los detalles para añadir un nuevo insumo al inventario.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre del Insumo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Tomates Frescos" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Categoría</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Vegetales" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                               <FormField
                                    control={form.control}
                                    name="supplier"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Proveedor</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Proveedor Local" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="stock"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Stock Actual</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="maxStock"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Stock Máximo</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary" onClick={() => form.reset()}>Cancelar</Button>
                                    </DialogClose>
                                    <Button type="submit">Guardar Insumo</Button>
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
                            <TableHead>Insumo</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Proveedor</TableHead>
                            <TableHead className="w-[250px]">Nivel de Stock</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventory.map(item => (
                            <TableRow key={item.id} className={item.stock < lowStockThreshold ? 'bg-destructive/10' : ''}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        {item.stock < lowStockThreshold && (
                                            <AlertCircle className="h-5 w-5 text-destructive" />
                                        )}
                                        {item.name}
                                    </div>
                                </TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell className="text-muted-foreground">{item.supplier}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Progress value={(item.stock / item.maxStock) * 100} className="h-3" />
                                        <span className="text-sm font-mono">{item.stock}/{item.maxStock}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">Ajustar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
