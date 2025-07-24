
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReporteInventario } from '@/components/panel/reporte-inventario';
import { ReporteVentasProducto } from "@/components/panel/reporte-ventas-producto";
import { ReporteStockInventario } from "@/components/panel/reporte-stock-inventario";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart } from "lucide-react";

export default function PaginaReportes() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <AreaChart className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="text-2xl font-headline">Reportes</CardTitle>
                    <CardDescription>Analiza el rendimiento de tu restaurante.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="product-availability" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-auto">
                        <TabsTrigger value="product-availability" className="whitespace-normal">Disponibilidad de Productos</TabsTrigger>
                        <TabsTrigger value="product-sales" className="whitespace-normal">Ventas de Productos</TabsTrigger>
                        <TabsTrigger value="inventory-stock" className="whitespace-normal">Stock de Insumos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="product-availability" className="mt-6">
                        <ReporteInventario />
                    </TabsContent>
                    <TabsContent value="product-sales" className="mt-6">
                        <ReporteVentasProducto />
                    </TabsContent>
                    <TabsContent value="inventory-stock" className="mt-6">
                        <ReporteStockInventario />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
