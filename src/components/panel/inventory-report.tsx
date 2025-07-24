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
        return { status: 'unknown', message: 'Untracked Ingredients' };
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
        return { status: 'out', message: `Out of Stock: ${outOfStockItems.join(', ')}` };
    }
    if (overallStatus === 'low') {
        return { status: 'low', message: `Low Stock: ${lowStockItems.join(', ')}` };
    }

    return { status: 'available', message: 'Available' };
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
        available: { icon: CheckCircle2, className: 'text-green-500' },
        low: { icon: AlertCircle, className: 'text-yellow-500' },
        out: { icon: XCircle, className: 'text-red-500' },
        unknown: { icon: AlertCircle, className: 'text-muted-foreground' },
    };


    return (
        <div>
            <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-headline">Product Availability by Ingredients</CardTitle>
                <CardDescription>Review the status of ingredients required for each menu product.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="relative w-full overflow-auto no-scrollbar">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead>Ingredient Status</TableHead>
                                <TableHead>Details</TableHead>
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
                                                <span>{item.inventoryStatus.status.charAt(0).toUpperCase() + item.inventoryStatus.status.slice(1)}</span>
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
