
'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Warehouse, PlusCircle, AlertCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePreferences } from '@/hooks/use-preferences';
import { useInventory } from '@/hooks/use-inventory';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { InventoryItem } from '@/lib/types';


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
    const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useInventory();
    const notifiedItemsRef = useRef(new Set<string>());
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('default');

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

    const categories = useMemo(() => ['all', ...new Set(inventory.map(item => item.category))], [inventory]);

    const displayedInventory = useMemo(() => {
        let filteredItems = [...inventory];

        if (categoryFilter !== 'all') {
            filteredItems = filteredItems.filter(item => item.category === categoryFilter);
        }

        switch (sortBy) {
            case 'stock-asc':
                filteredItems.sort((a, b) => (a.stock / a.maxStock) - (b.stock / b.maxStock));
                break;
            case 'stock-desc':
                filteredItems.sort((a, b) => (b.stock / b.maxStock) - (a.stock / a.maxStock));
                break;
            default:
                // No specific sorting, maintain original order
                break;
        }

        return filteredItems;
    }, [inventory, categoryFilter, sortBy]);


    function onSubmit(values: z.infer<typeof inventorySchema>) {
        if (dialogMode === 'add') {
            addInventoryItem(values);
        } else if (selectedItem) {
            updateInventoryItem(selectedItem.id, values);
        }
        form.reset();
        setIsDialogOpen(false);
        setSelectedItem(null);
    }
    
    const handleOpenDialog = (mode: 'add' | 'edit', item?: InventoryItem) => {
        setDialogMode(mode);
        if (mode === 'edit' && item) {
            setSelectedItem(item);
            form.reset(item);
        } else {
            setSelectedItem(null);
            form.reset({ name: "", category: "", supplier: "", stock: 0, maxStock: 100 });
        }
        setIsDialogOpen(true);
    };

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
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <div className="flex items-center gap-4">
                    <Warehouse className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-2xl font-headline">Inventario</CardTitle>
                        <CardDescription>Supervisa y gestiona el stock de tus insumos.</CardDescription>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                     <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filtrar por categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(category => (
                                 <SelectItem key={category} value={category}>
                                    {category === 'all' ? 'Todas las Categorías' : category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                     <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Por defecto</SelectItem>
                            <SelectItem value="stock-asc">Nivel de Stock (Bajo a Alto)</SelectItem>
                            <SelectItem value="stock-desc">Nivel de Stock (Alto a Bajo)</SelectItem>
                        </SelectContent>
                    </Select>

                     <Button onClick={() => handleOpenDialog('add')} className="w-full sm:w-auto">
                        <PlusCircle className="mr-2" />
                        Añadir Insumo
                    </Button>
                     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{dialogMode === 'add' ? 'Añadir Nuevo Insumo' : 'Editar Insumo'}</DialogTitle>
                                <DialogDescription>
                                    {dialogMode === 'add' ? 'Completa los detalles para añadir un nuevo insumo al inventario.' : 'Modifica los detalles del insumo.'}
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
                                            <Button type="button" variant="secondary" onClick={() => { form.reset(); setSelectedItem(null); }}>Cancelar</Button>
                                        </DialogClose>
                                        <Button type="submit">Guardar Cambios</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative w-full overflow-auto no-scrollbar">
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
                            {displayedInventory.map(item => (
                                <TableRow key={item.id} className={item.stock < lowStockThreshold ? 'bg-destructive/10' : ''}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {item.stock < lowStockThreshold && (
                                                <AlertCircle className="h-5 w-5 text-destructive" />
                                            )}
                                            <span className="truncate">{item.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">{item.category}</TableCell>
                                    <TableCell className="text-muted-foreground whitespace-nowrap">{item.supplier}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={(item.stock / item.maxStock) * 100} className="h-3" />
                                            <span className="text-sm font-mono">{item.stock}/{item.maxStock}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                         <div className="flex justify-end items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenDialog('edit', item)}>
                                                Ajustar
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="icon" className="h-9 w-9">
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Eliminar insumo</span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Esta acción no se puede deshacer. Esto eliminará permanentemente el insumo "{item.name}".
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteInventoryItem(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
