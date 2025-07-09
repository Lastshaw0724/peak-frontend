
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InventoryReport } from '@/components/dashboard/inventory-report';
import { ProductSalesReport } from "@/components/dashboard/product-sales-report";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart } from "lucide-react";

export default function ReportsPage() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <AreaChart className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="text-2xl font-headline">Reportes</CardTitle>
                    <CardDescription>Analiza el rendimiento de tu inventario y ventas.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="inventory">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="inventory">Inventario y Productos</TabsTrigger>
                        <TabsTrigger value="products">Ventas de Productos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="inventory" className="mt-6">
                        <InventoryReport />
                    </TabsContent>
                    <TabsContent value="products" className="mt-6">
                        <ProductSalesReport />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
