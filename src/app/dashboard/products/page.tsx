
'use client'
import { useState, useMemo, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, PlusCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useMenu } from '@/hooks/use-menu';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image';

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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from '@/components/ui/scroll-area';
import type { MenuItem } from '@/lib/types';


const extraSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "El nombre del extra es requerido."),
    price: z.coerce.number().min(0, "El precio no puede ser negativo."),
});

const productSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
    price: z.coerce.number().positive("El precio debe ser un número positivo."),
    category: z.enum(['Appetizers', 'Main Courses', 'Desserts', 'Drinks']),
    image: z.string().url("Debe ser una URL de imagen válida."),
    extras: z.array(extraSchema).optional(),
});


export default function ProductsPage() {
    const { menu, addProduct, updateProduct, deleteProduct } = useMenu();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('default');

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            category: "Main Courses",
            image: "",
            extras: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "extras",
    });
    
    useEffect(() => {
        if (!isDialogOpen) {
            form.reset();
            setSelectedProduct(null);
        }
    }, [isDialogOpen, form]);

    const displayedMenu = useMemo(() => {
        let filteredProducts = [...menu];

        if (categoryFilter !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
        }

        if (sortBy === 'name-asc') {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'price-asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }
        
        return filteredProducts;
    }, [menu, categoryFilter, sortBy]);

    function onSubmit(values: z.infer<typeof productSchema>) {
        const productData = {
            ...values,
            dataAiHint: values.name.toLowerCase().split(' ').slice(0, 2).join(' '),
        };

        if (dialogMode === 'add') {
            addProduct(productData);
        } else if (selectedProduct) {
            updateProduct(selectedProduct.id, productData);
        }
        
        setIsDialogOpen(false);
    }

    const handleOpenDialog = (mode: 'add' | 'edit', product?: MenuItem) => {
        setDialogMode(mode);
        if (mode === 'edit' && product) {
            setSelectedProduct(product);
            form.reset({
                ...product,
                extras: product.extras || [],
            });
        } else {
            form.reset({ name: "", description: "", price: 0, category: "Main Courses", image: "", extras: [] });
        }
        setIsDialogOpen(true);
    };

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Package className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-2xl font-headline">Productos</CardTitle>
                        <CardDescription>Gestiona y organiza los productos de tu menú.</CardDescription>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 flex-wrap">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filtrar por categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las Categorías</SelectItem>
                            <SelectItem value="Appetizers">Entradas</SelectItem>
                            <SelectItem value="Main Courses">Platos Fuertes</SelectItem>
                            <SelectItem value="Desserts">Postres</SelectItem>
                            <SelectItem value="Drinks">Bebidas</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Por defecto</SelectItem>
                            <SelectItem value="name-asc">Nombre (A - Z)</SelectItem>
                            <SelectItem value="price-asc">Precio (Bajo a Alto)</SelectItem>
                            <SelectItem value="price-desc">Precio (Alto a Bajo)</SelectItem>
                        </SelectContent>
                    </Select>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto" onClick={() => handleOpenDialog('add')}>
                                <PlusCircle className="mr-2" />
                                Añadir Producto
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle>{dialogMode === 'add' ? 'Añadir Nuevo Producto' : 'Editar Producto'}</DialogTitle>
                                <DialogDescription>
                                    {dialogMode === 'add' 
                                        ? 'Completa los detalles para añadirlo al menú.'
                                        : `Modificando el producto: ${selectedProduct?.name}`
                                    }
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <ScrollArea className="max-h-[60vh] pr-6">
                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nombre</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Ej: Pizza Margherita" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Descripción</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Describe el producto..." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Precio</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" step="0.01" {...field} />
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
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecciona una categoría" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Appetizers">Entradas</SelectItem>
                                                                <SelectItem value="Main Courses">Platos Fuertes</SelectItem>
                                                                <SelectItem value="Desserts">Postres</SelectItem>
                                                                <SelectItem value="Drinks">Bebidas</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="image"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>URL de la Imagen</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="https://placehold.co/600x400.png" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h3 className="text-base font-semibold">Extras del Producto</h3>
                                                <div className="space-y-3">
                                                    {fields.map((field, index) => (
                                                        <div key={field.id} className="flex items-end gap-2 rounded-md border bg-muted/50 p-3">
                                                            <FormField
                                                                control={form.control}
                                                                name={`extras.${index}.name`}
                                                                render={({ field }) => (
                                                                    <FormItem className="flex-grow">
                                                                        <FormLabel>Nombre del extra</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="Ej: Queso Extra" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage className="text-xs" />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name={`extras.${index}.price`}
                                                                render={({ field }) => (
                                                                    <FormItem className="w-28">
                                                                        <FormLabel>Precio</FormLabel>
                                                                        <FormControl>
                                                                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage className="text-xs" />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <Button type="button" variant="ghost" size="icon" className="h-10 w-10 flex-shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => remove(index)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => append({ name: '', price: 0 })}
                                                    className="w-full"
                                                >
                                                    <PlusCircle className="mr-2" />
                                                    Añadir Extra
                                                </Button>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                    <DialogFooter className="pt-6">
                                        <DialogClose asChild>
                                        <Button type="button" variant="secondary">Cancelar</Button>
                                        </DialogClose>
                                        <Button type="submit">Guardar Producto</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative w-full overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">Imagen</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Extras</TableHead>
                                <TableHead className="text-right">Precio</TableHead>
                                <TableHead className="text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayedMenu.map((item) => (
                                 <TableRow key={item.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        <Image
                                        alt={item.name}
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={item.image}
                                        width="64"
                                        data-ai-hint={item.dataAiHint}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium whitespace-nowrap">{item.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.category}</Badge>
                                    </TableCell>
                                     <TableCell>
                                        {item.extras && item.extras.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {item.extras.map(extra => (
                                                    <Badge key={extra.id} variant="secondary">{extra.name}</Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-center">
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                            <Button
                                                aria-haspopup="true"
                                                size="icon"
                                                variant="ghost"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={() => handleOpenDialog('edit', item)}>
                                                    <Pencil className="mr-2" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                                            <Trash2 className="mr-2" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Esta acción no se puede deshacer. Esto eliminará permanentemente el producto "{item.name}".
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => deleteProduct(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                Sí, eliminar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
