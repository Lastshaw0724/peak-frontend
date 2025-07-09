
'use client';

import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Save, BarChart as BarChartIcon, Bell } from 'lucide-react';
import { useOrder } from '@/hooks/use-order';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import type { OrderItem } from '@/lib/types';
import { usePreferences } from '@/hooks/use-preferences';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';


export default function PreferencesPage() {
    const { submittedOrders } = useOrder();
    const prefs = usePreferences();
    const { toast } = useToast();

    const [localPrefs, setLocalPrefs] = useState(prefs);

    useEffect(() => {
        if (!prefs.isLoading) {
            setLocalPrefs(prefs);
        }
    }, [prefs]);

    const handleSaveChanges = () => {
        prefs.setRestaurantName(localPrefs.restaurantName);
        prefs.setWebsiteUrl(localPrefs.websiteUrl);
        prefs.setAddress(localPrefs.address);
        prefs.setPhone(localPrefs.phone);
        prefs.setDarkMode(localPrefs.darkMode);
        prefs.setPublicMenu(localPrefs.publicMenu);
        prefs.setTaxRate(localPrefs.taxRate);
        prefs.setTaxIncluded(localPrefs.taxIncluded);
        prefs.setLowStockThreshold(localPrefs.lowStockThreshold);

        toast({ title: "Preferencias Guardadas", description: "Tus cambios han sido guardados." });
    };

    const popularProducts = useMemo(() => {
        if (!submittedOrders || submittedOrders.length === 0) return [];
        const productCounts: { [key: string]: { name: string, count: number } } = {};
        submittedOrders.forEach(order => {
            order.items.forEach((item: OrderItem) => {
                if (productCounts[item.id]) {
                    productCounts[item.id].count += item.quantity;
                } else {
                    productCounts[item.id] = { name: item.name, count: item.quantity };
                }
            });
        });
        return Object.values(productCounts).sort((a, b) => b.count - a.count).slice(0, 5).reverse();
    }, [submittedOrders]);

    const chartConfig = {
      count: { label: "Ventas", color: "hsl(var(--primary))" },
    } satisfies ChartConfig;

    if (prefs.isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-5 w-3/4 mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-12 w-full mb-6" />
                    <Skeleton className="h-96 w-full" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Settings className="h-8 w-8 text-primary" />
                 <div>
                    <CardTitle className="text-2xl font-headline">Preferencias del Sistema</CardTitle>
                    <CardDescription>Configura los ajustes generales y notificaciones de tu restaurante.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="general">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="appearance">Apariencia</TabsTrigger>
                        <TabsTrigger value="taxes">Impuestos</TabsTrigger>
                        <TabsTrigger value="stock">Stock</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general" className="mt-6">
                        <div className="space-y-6 max-w-2xl">
                            <div className="space-y-2">
                                <Label htmlFor="restaurant-name">Nombre del Restaurante</Label>
                                <Input id="restaurant-name" value={localPrefs.restaurantName} onChange={(e) => setLocalPrefs({...localPrefs, restaurantName: e.target.value})} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="website-url">Sitio Web / Enlace</Label>
                                <Input id="website-url" type="url" placeholder="https://ejemplo.com" value={localPrefs.websiteUrl} onChange={(e) => setLocalPrefs({...localPrefs, websiteUrl: e.target.value})} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="address">Dirección</Label>
                                <Input id="address" value={localPrefs.address} onChange={(e) => setLocalPrefs({...localPrefs, address: e.target.value})} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono de Contacto</Label>
                                <Input id="phone" type="tel" value={localPrefs.phone} onChange={(e) => setLocalPrefs({...localPrefs, phone: e.target.value})} />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="appearance" className="mt-6">
                       <div className="space-y-6 max-w-2xl">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="dark-mode" className="text-base">Modo Oscuro</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Activar el tema oscuro en toda la aplicación.
                                    </p>
                                </div>
                                <Switch id="dark-mode" checked={localPrefs.darkMode} onCheckedChange={(checked) => setLocalPrefs({...localPrefs, darkMode: checked})} />
                            </div>
                             <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="public-menu" className="text-base">Menú Público</Label>
                                     <p className="text-sm text-muted-foreground">
                                        Permitir que cualquiera vea el menú sin iniciar sesión.
                                    </p>
                                </div>
                                <Switch id="public-menu" checked={localPrefs.publicMenu} onCheckedChange={(checked) => setLocalPrefs({...localPrefs, publicMenu: checked})} />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="taxes" className="mt-6">
                       <div className="space-y-6 max-w-2xl">
                            <div className="space-y-2">
                                <Label htmlFor="tax-rate">Tasa de Impuesto General (%)</Label>
                                <Input id="tax-rate" type="number" value={localPrefs.taxRate} onChange={(e) => setLocalPrefs({...localPrefs, taxRate: Number(e.target.value)})} />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="tax-included" checked={localPrefs.taxIncluded} onCheckedChange={(checked) => setLocalPrefs({...localPrefs, taxIncluded: checked})}/>
                                <Label htmlFor="tax-included">¿Los precios del menú ya incluyen impuestos?</Label>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="stock" className="mt-6">
                       <div className="space-y-6 max-w-2xl">
                           <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                Notificaciones de Stock
                           </h3>
                            <div className="space-y-2 p-4 border rounded-lg">
                                <Label htmlFor="stock-threshold">Alertar cuando el stock sea menor a:</Label>
                                <Input 
                                    id="stock-threshold" 
                                    type="number"
                                    value={localPrefs.lowStockThreshold}
                                    onChange={(e) => setLocalPrefs({...localPrefs, lowStockThreshold: Number(e.target.value)})}
                                    className="max-w-[100px]"
                                    placeholder="Ej: 20"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Recibirás una notificación cuando un insumo baje de este número de unidades.
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
                <div className="mt-8 flex justify-end">
                    <Button onClick={handleSaveChanges}>
                        <Save className="mr-2"/>
                        Guardar Cambios
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
