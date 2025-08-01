'use client';

import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Save, Bell, Palette, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useOrder } from '@/hooks/use-order';
import type { OrderItem } from '@/lib/types';
import { usePreferences } from '@/hooks/use-preferences';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartConfig } from '@/components/ui/chart';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

function hexToHsl(hex: string): string {
    if (!hex) return "0 0% 0%";
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return `${h} ${s}% ${l}%`;
}


export default function PreferencesPage() {
    const { submittedOrders } = useOrder();
    const prefsContext = usePreferences();
    const { savePreferences, isLoading, ...initialPrefs } = prefsContext;

    // Local state to hold form changes before saving
    const [localPrefs, setLocalPrefs] = useState(initialPrefs);
    const [logoInputMethod, setLogoInputMethod] = useState<'upload' | 'url'>('upload');


    // When the context finishes loading, sync the data to the local state
    useEffect(() => {
        if (!isLoading) {
            setLocalPrefs(initialPrefs);
        }
    }, [isLoading, initialPrefs.restaurantName, initialPrefs.websiteUrl, initialPrefs.address, initialPrefs.phone, initialPrefs.darkMode, initialPrefs.publicMenu, initialPrefs.taxRate, initialPrefs.taxIncluded, initialPrefs.lowStockThreshold, initialPrefs.primaryColor, initialPrefs.accentColor, initialPrefs.logoUrl]);

    const handleSaveChanges = () => {
        if (isLoading) return;
        savePreferences(localPrefs);
        // Apply theme colors dynamically
        document.documentElement.style.setProperty('--primary', hexToHsl(localPrefs.primaryColor));
        document.documentElement.style.setProperty('--accent', hexToHsl(localPrefs.accentColor));
    };
    
    // Handler for individual input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        setLocalPrefs(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
        }));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setLocalPrefs(prev => ({
                ...prev,
                logoUrl: reader.result as string,
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleLogoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalPrefs(prev => ({
            ...prev,
            logoUrl: e.target.value,
        }));
    };

    const handleDeleteLogo = () => {
        setLocalPrefs(prev => ({
            ...prev,
            logoUrl: '',
        }));
    };

    // Handler for Switch component changes
    const handleSwitchChange = (id: string, checked: boolean) => {
        setLocalPrefs(prev => ({
            ...prev,
            [id]: checked
        }));
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

    if (isLoading) {
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
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-10">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="appearance">Apariencia</TabsTrigger>
                        <TabsTrigger value="taxes">Impuestos</TabsTrigger>
                        <TabsTrigger value="stock">Stock</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general" className="mt-6">
                        <div className="space-y-6 max-w-2xl">
                            <div className="space-y-2">
                                <Label htmlFor="restaurantName">Nombre del Restaurante</Label>
                                <Input id="restaurantName" value={localPrefs.restaurantName} onChange={handleChange} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="websiteUrl">Sitio Web / Enlace</Label>
                                <Input id="websiteUrl" type="url" placeholder="https://ejemplo.com" value={localPrefs.websiteUrl} onChange={handleChange} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="address">Dirección</Label>
                                <Input id="address" value={localPrefs.address} onChange={handleChange} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono de Contacto</Label>
                                <Input id="phone" type="tel" value={localPrefs.phone} onChange={handleChange} />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="appearance" className="mt-6">
                       <div className="space-y-6 max-w-2xl">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="darkMode" className="text-base">Modo Oscuro</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Habilita el tema oscuro en toda la aplicación.
                                    </p>
                                </div>
                                <Switch id="darkMode" checked={localPrefs.darkMode} onCheckedChange={(checked) => handleSwitchChange('darkMode', checked)} />
                            </div>
                             <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="publicMenu" className="text-base">Menú Público</Label>
                                     <p className="text-sm text-muted-foreground">
                                        Permite que cualquiera vea el menú sin iniciar sesión.
                                    </p>
                                </div>
                                <Switch id="publicMenu" checked={localPrefs.publicMenu} onCheckedChange={(checked) => handleSwitchChange('publicMenu', checked)} />
                            </div>
                            <div className="rounded-lg border p-4 space-y-4">
                                <h3 className="text-base font-semibold flex items-center gap-2"><ImageIcon className="text-primary"/>Logo del Restaurante</h3>
                                 <RadioGroup defaultValue="upload" value={logoInputMethod} onValueChange={(v) => setLogoInputMethod(v as 'upload' | 'url')} className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="upload" id="r_upload" />
                                        <Label htmlFor="r_upload">Subir Archivo</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="url" id="r_url" />
                                        <Label htmlFor="r_url">Usar URL</Label>
                                    </div>
                                </RadioGroup>

                                {logoInputMethod === 'upload' ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="logoUpload">Subir Logo</Label>
                                        <Input id="logoUpload" type="file" accept="image/*" onChange={handleLogoUpload} className="file:text-foreground" />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="logoUrlInput">URL del Logo</Label>
                                        <Input id="logoUrlInput" type="url" placeholder="https://ejemplo.com/logo.png" value={(localPrefs.logoUrl || '').startsWith('data:') ? '' : localPrefs.logoUrl || ''} onChange={handleLogoUrlChange} />
                                    </div>
                                )}
                                
                                {localPrefs.logoUrl && (
                                     <div className="mt-4 space-y-3">
                                         <Label>Vista Previa</Label>
                                        <div className="flex items-center justify-center p-4 bg-muted rounded-md">
                                            <Image src={localPrefs.logoUrl} alt="Vista previa del logo" width={150} height={150} className="object-contain" />
                                        </div>
                                         <Button variant="destructive" size="sm" onClick={handleDeleteLogo} className="w-full">
                                            <Trash2 className="mr-2"/>
                                            Eliminar Logo
                                        </Button>
                                    </div>
                                )}
                            </div>
                             <div className="rounded-lg border p-4 space-y-4">
                                <h3 className="text-base font-semibold flex items-center gap-2"><Palette className="text-primary" />Colores del Tema</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="primaryColor">Color Primario</Label>
                                        <div className="flex items-center gap-2">
                                            <Input id="primaryColor" type="color" value={localPrefs.primaryColor} onChange={handleChange} className="w-16 p-1"/>
                                            <span className="font-mono text-sm">{localPrefs.primaryColor}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="accentColor">Color de Acento</Label>
                                         <div className="flex items-center gap-2">
                                            <Input id="accentColor" type="color" value={localPrefs.accentColor} onChange={handleChange} className="w-16 p-1"/>
                                             <span className="font-mono text-sm">{localPrefs.accentColor}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="taxes" className="mt-6">
                       <div className="space-y-6 max-w-2xl">
                            <div className="space-y-2">
                                <Label htmlFor="taxRate">Tasa General de Impuestos (%)</Label>
                                <Input id="taxRate" type="number" value={localPrefs.taxRate} onChange={handleChange} />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="taxIncluded" checked={localPrefs.taxIncluded} onCheckedChange={(checked) => handleSwitchChange('taxIncluded', checked)}/>
                                <Label htmlFor="taxIncluded">¿Los precios del menú ya incluyen impuestos?</Label>
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
                                <Label htmlFor="lowStockThreshold">Alertar cuando el stock sea menor que:</Label>
                                <Input 
                                    id="lowStockThreshold" 
                                    type="number"
                                    value={localPrefs.lowStockThreshold}
                                    onChange={handleChange}
                                    className="max-w-[100px]"
                                    placeholder="Ej: 20"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Recibirás una notificación cuando un insumo caiga por debajo de este número de unidades.
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
                <div className="mt-8 flex justify-end">
                    <Button onClick={handleSaveChanges} disabled={isLoading}>
                        <Save className="mr-2"/>
                        Guardar Cambios
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
