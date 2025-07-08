
'use client';
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Warehouse, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePreferences } from '@/hooks/use-preferences';


const inventoryData = [
  { id: 'inv-1', name: 'Tomates Frescos', category: 'Vegetales', stock: 75, maxStock: 100, supplier: 'Proveedor Local' },
  { id: 'inv-2', name: 'Queso Mozzarella', category: 'Lácteos', stock: 40, maxStock: 50, supplier: 'Importadora Italiana' },
  { id: 'inv-3', name: 'Harina Tipo 00', category: 'Secos', stock: 18, maxStock: 120, supplier: 'Molinos del Sol' },
  { id: 'inv-4', name: 'Pechuga de Pollo', category: 'Carnes', stock: 25, maxStock: 60, supplier: 'Granja Avícola' },
  { id: 'inv-5', name: 'Aceite de Oliva Extra Virgen', category: 'Aceites', stock: 15, maxStock: 40, supplier: 'Importadora Italiana' },
  { id: 'inv-6', name: 'Vino Tinto (Botella)', category: 'Bebidas', stock: 85, maxStock: 100, supplier: 'Viñedos Mendoza' },
];

export default function InventoryPage() {
    const { lowStockThreshold } = usePreferences();
    const { toast } = useToast();
    const notifiedItemsRef = useRef(new Set<string>());

    useEffect(() => {
        inventoryData.forEach(item => {
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
    }, [inventoryData, lowStockThreshold, toast]);

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
                <Button>
                    <PlusCircle className="mr-2" />
                    Añadir Insumo
                </Button>
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
                        {inventoryData.map(item => (
                            <TableRow key={item.id} className={item.stock < lowStockThreshold ? 'bg-destructive/10' : ''}>
                                <TableCell className="font-medium">{item.name}</TableCell>
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

