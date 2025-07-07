
'use client'
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
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
import type { MenuItem } from '@/lib/types';

const productSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
    price: z.coerce.number().positive("El precio debe ser un número positivo."),
    category: z.enum(['Appetizers', 'Main Courses', 'Desserts', 'Drinks']),
    image: z.string().url("Debe ser una URL de imagen válida."),
});


export default function ProductsPage() {
    const { menu, addProduct } = useMenu();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
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
        },
    });

    const displayedMenu = useMemo(() => {
        let filteredProducts = [...menu];

        if (categoryFilter !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
        }

        if (sortBy === 'name-asc') {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        return filteredProducts;
    }, [menu, categoryFilter, sortBy]);

    function onSubmit(values: z.infer<typeof productSchema>) {
        const newProductData: Omit<MenuItem, 'id'> = {
            ...values,
            dataAiHint: values.name.toLowerCase().split(' ').slice(0, 2).join(' '),
        };
        addProduct(newProductData);
        form.reset();
        setIsDialogOpen(false);
    }

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
                <div className="flex items-center gap-2 flex-wrap">
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
                        </SelectContent>
                    </Select>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto">
                                <PlusCircle className="mr-2" />
                                Añadir Producto
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Añadir Nuevo Producto</DialogTitle>
                                <DialogDescription>
                                    Completa los detalles del nuevo producto para añadirlo al menú.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                    <DialogFooter>
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
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">Imagen</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead className="text-right">Precio</TableHead>
                            <TableHead>Acciones</TableHead>
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
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{item.category}</Badge>
                                </TableCell>
                                <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                <TableCell>
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
                                            <DropdownMenuItem>
                                                <Pencil className="mr-2" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                <Trash2 className="mr-2" />
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                             </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
