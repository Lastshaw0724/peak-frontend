
'use client';

import { useMemo } from 'react';
import { useOrder } from '@/hooks/use-order';
import type { OrderItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"

export function ProductSalesReport() {
    const { submittedOrders } = useOrder();

    const salesData = useMemo(() => {
        const productSales: Record<string, { name: string, category: string, quantity: number, revenue: number }> = {};

        submittedOrders.forEach(order => {
            order.items.forEach((item: OrderItem) => {
                if (!productSales[item.id]) {
                    productSales[item.id] = { name: item.name, category: item.category, quantity: 0, revenue: 0 };
                }
                productSales[item.id].quantity += item.quantity;
                
                const extrasPrice = item.selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
                const itemTotalRevenue = (item.price + extrasPrice) * item.quantity;
                productSales[item.id].revenue += itemTotalRevenue;
            });
        });

        return Object.values(productSales).sort((a, b) => b.quantity - a.quantity);
    }, [submittedOrders]);
    
    const topProducts = useMemo(() => salesData.slice(0, 5).reverse(), [salesData]);

    const chartConfig = {
      quantity: { label: "Unidades Vendidas", color: "hsl(var(--primary))" },
    } satisfies ChartConfig;

    return (
        <div className="space-y-8">
            <Card>
                 <CardHeader>
                    <CardTitle className="text-xl font-headline">Top 5 Productos Más Vendidos</CardTitle>
                    <CardDescription>Visualización de los productos más populares por unidades vendidas.</CardDescription>
                </CardHeader>
                 <CardContent>
                    {topProducts.length > 0 ? (
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                             <BarChart
                                accessibilityLayer
                                data={topProducts}
                                layout="vertical"
                                margin={{ left: 10, right: 40 }}
                              >
                                <CartesianGrid horizontal={false} />
                                <YAxis
                                  dataKey="name"
                                  type="category"
                                  tickLine={false}
                                  tickMargin={10}
                                  axisLine={false}
                                  className="text-xs"
                                  width={120}
                                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                                />
                                <XAxis dataKey="quantity" type="number" hide />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dot" />}
                                />
                                <Bar dataKey="quantity" layout="vertical" fill="var(--color-quantity)" radius={4}>
                                    <LabelList
                                        dataKey="quantity"
                                        position="right"
                                        offset={8}
                                        className="fill-foreground font-semibold"
                                        fontSize={12}
                                    />
                                </Bar>
                              </BarChart>
                        </ChartContainer>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">No hay suficientes datos de ventas para mostrar el gráfico.</p>
                    )}
                 </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-headline">Reporte General de Ventas por Producto</CardTitle>
                    <CardDescription>Un resumen completo de la cantidad y los ingresos por cada producto vendido.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead className="text-right">Unidades Vendidas</TableHead>
                                <TableHead className="text-right">Ingresos Totales</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {salesData.length > 0 ? salesData.map((item) => (
                                <TableRow key={item.name}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                                    <TableCell className="text-right font-semibold">{item.quantity}</TableCell>
                                    <TableCell className="text-right font-bold text-primary">${item.revenue.toFixed(2)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        No hay datos de ventas disponibles.
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
