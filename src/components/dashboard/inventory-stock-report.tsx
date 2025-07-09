
'use client';

import { useMemo } from 'react';
import { Pie, PieChart, Cell, Tooltip } from 'recharts';
import { useInventory } from '@/hooks/use-inventory';
import { usePreferences } from '@/hooks/use-preferences';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';
import { ChartContainer, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const chartConfig = {
  items: {
    label: "Insumos",
  },
} satisfies ChartConfig

export function InventoryStockReport() {
    const { inventory } = useInventory();
    const { lowStockThreshold } = usePreferences();

    const categoryDistribution = useMemo(() => {
        const distribution: Record<string, number> = {};
        inventory.forEach(item => {
            if (distribution[item.category]) {
                distribution[item.category]++;
            } else {
                distribution[item.category] = 1;
            }
        });
        return Object.entries(distribution).map(([name, value]) => ({ name, value }));
    }, [inventory]);

    const sortedInventory = useMemo(() => {
        return [...inventory].sort((a, b) => (a.stock / a.maxStock) - (b.stock / b.maxStock));
    }, [inventory]);

    return (
        <div className="space-y-8">
            <Card>
                 <CardHeader>
                    <CardTitle className="text-xl font-headline">Distribución de Insumos por Categoría</CardTitle>
                    <CardDescription>Visualización de la cantidad de tipos de insumos en cada categoría.</CardDescription>
                </CardHeader>
                 <CardContent>
                    {categoryDistribution.length > 0 ? (
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                            <PieChart>
                                <Tooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie
                                    data={categoryDistribution}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label={(entry) => `${entry.name} (${entry.value})`}
                                >
                                    {categoryDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">No hay datos de inventario para mostrar el gráfico.</p>
                    )}
                 </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-headline">Niveles de Stock Actuales</CardTitle>
                    <CardDescription>Resumen de todos los insumos en el inventario, ordenados por nivel de stock.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Insumo</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead className="w-[250px]">Nivel de Stock</TableHead>
                                <TableHead>Proveedor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedInventory.length > 0 ? sortedInventory.map((item) => (
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
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={(item.stock / item.maxStock) * 100} className="h-3" />
                                            <span className="text-sm font-mono">{item.stock}/{item.maxStock}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{item.supplier}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        No hay insumos en el inventario.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
