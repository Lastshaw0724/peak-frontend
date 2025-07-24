'use client';

import { useMemo } from 'react';
import { useMenu } from '@/hooks/use-menu';
import { useInventory } from '@/hooks/use-inventory';
import { usePreferences } from '@/hooks/use-preferences';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MenuItem } from '@/lib/types';


const getIngredientStatus = (productName: string, inventory: any[], lowStockThreshold: number) => {
    // This is a simplified logic. In a real-world scenario, you'd have a recipe mapping.
    // Here, we check for fuzzy matches in ingredient names based on the product name.
    const nameParts = productName.toLowerCase().split(' ');
    
    // Heuristic: Check for common ingredients.
    const keywords: { [key: string]: string[] } = {
        'pizza': ['harina', 'queso', 'tomate'],
        'spaghetti': ['harina'],
        'pollo': ['pollo'],
        'bruschetta': ['tomate'],
        'bistecca': ['carne'], // Assuming steak is a type of carne
    };

    let relevantKeywords: string[] = [];
    nameParts.forEach(part => {
        if (keywords[part]) {
            relevantKeywords.push(...keywords[part]);
        }
    });

    if (relevantKeywords.length === 0) {
        // Generic check if no specific keywords found
        relevantKeywords = nameParts;
    }

    const matchedInventoryItems = inventory.filter(invItem => 
        relevantKeywords.some(keyword => invItem.name.toLowerCase().includes(keyword))
    );

    if (matchedInventoryItems.length === 0) {
        return { status: 'unknown', message: 'Insumos no rastreados' };
    }

    let overallStatus = 'available'; // available, low, out
    const lowStockItems: string[] = [];
    const outOfStockItems: string[] = [];

    matchedInventoryItems.forEach(item => {
        if (item.stock === 0) {
            overallStatus = 'out';
            outOfStockItems.push(item.name);
        } else if (item.stock < lowStockThreshold) {
            if (overallStatus !== 'out') {
                overallStatus = 'low';
            }
            lowStockItems.push(item.name);
        }
    });

    if (overallStatus === 'out') {
        return { status: 'out', message: `Agotado: ${outOfStockItems.join(', ')}` };
    }
    if (overallStatus === 'low') {
        return { status: 'low', message: `Bajo stock: ${lowStockItems.join(', ')}` };
    }

    return { status: 'available', message: 'Disponible' };
};


export function InventoryReport() {
    const { menu } = useMenu();
    const { inventory } = useInventory();
    const { lowStockThreshold } = usePreferences();

    const reportData = useMemo(() => {
        return menu.map(product => ({
            ...product,
            inventoryStatus: getIngredientStatus(product.name, inventory, lowStockThreshold)
        }));
    }, [menu, inventory, lowStockThreshold]);

    const statusConfig = {
        available: { label: 'Disponible', icon: CheckCircle2, className: 'text-green-500' },
        low: { label: 'Bajo', icon: AlertCircle, className: 'text-yellow-500' },
        out: { label: 'Agotado', icon: XCircle, className: 'text-red-500' },
        unknown: { label: 'Desconocido', icon: AlertCircle, className: 'text-muted-foreground' },
    };


    return (
        <div>
            <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-headline">Disponibilidad de Productos por Insumos</CardTitle>
                <CardDescription>Revisa el estado de los insumos necesarios para cada producto del menú.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="relative w-full overflow-auto no-scrollbar">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead className="text-right">Precio</TableHead>
                                <TableHead>Estado de Insumos</TableHead>
                                <TableHead>Detalles</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reportData.map((item) => {
                                const currentStatus = statusConfig[item.inventoryStatus.status as keyof typeof statusConfig];
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <div className={cn("flex items-center gap-2 font-semibold", currentStatus.className)}>
                                                <currentStatus.icon className="h-5 w-5" />
                                                <span>{currentStatus.label}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{item.inventoryStatus.message}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </div>
    );
}
