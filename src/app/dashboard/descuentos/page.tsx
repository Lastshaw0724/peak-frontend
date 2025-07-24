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
                        <CardTitle className="text-2xl font-headline">Discounts</CardTitle>
                        <CardDescription>Create and manage promotions and discounts.</CardDescription>
                    </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                         <Button className="w-full sm:w-auto">
                            <PlusCircle className="mr-2" />
                            Create Discount
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Discount</DialogTitle>
                            <DialogDescription>
                                Fill in the details to create a new promotion.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Discount Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="E.g., Weekend Sale" {...field} />
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
                                            <FormLabel>Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="E.g., WEEKEND25" {...field} />
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
                                            <FormLabel>Value (e.g. 15% or $10)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="15% or $10.00" {...field} />
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
                                            <FormLabel>Expiration Date (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="dd/mm/yyyy or N/A" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Save Discount</Button>
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
                                <TableHead>Name</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Usage</TableHead>
                                <TableHead>Expires</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
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
                                                        <span className="sr-only">Delete discount</span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the "{discount.name}" discount.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteDiscount(discount.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                            Yes, delete
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
