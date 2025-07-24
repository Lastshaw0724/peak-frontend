'use client';
import { usarMenu } from '@/hooks/usar-menu';
import { TarjetaArticuloMenu } from './tarjeta-articulo-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ArticuloMenu } from '@/lib/tipos';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const categoryTranslations: Record<string, string> = {
    'Appetizers': 'Entradas',
    'Main Courses': 'Platos Fuertes',
    'Desserts': 'Postres',
    'Drinks': 'Bebidas'
};

const categoryOrder = ['Appetizers', 'Main Courses', 'Desserts', 'Drinks'];

export function PantallaMenu() {
  const { menu } = usarMenu();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMenu = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return menu.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [menu, searchTerm]);
  
  const groupedMenu = useMemo(() => {
      return menu.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
      }, {} as Record<string, ArticuloMenu[]>);
  }, [menu]);

  const orderedCategories = useMemo(() => {
      const availableCategories = new Set(menu.map(item => item.category));
      return categoryOrder.filter(c => availableCategories.has(c));
  }, [menu]);


  return (
    <div className="p-4 sm:p-6 text-white">
      <div className="flex flex-col items-center mb-6 gap-4">
        <h2 className="text-4xl font-bold font-headline uppercase">Cartilla</h2>
        <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <Input
                placeholder="Buscar platillo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-zinc-800 border-zinc-700 placeholder:text-zinc-400 text-white"
            />
        </div>
      </div>
      
      {searchTerm.trim() ? (
        // --- Search Results View ---
        <div>
          {filteredMenu.length > 0 ? (
            <>
              <h3 className="text-2xl font-headline mb-4">Resultados de la búsqueda ({filteredMenu.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredMenu.map((item) => (
                  <TarjetaArticuloMenu key={item.id} item={item} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-zinc-400 py-16">
              <Search className="w-16 h-16 mx-auto mb-4 text-zinc-500" />
              <h3 className="text-xl font-semibold">No se encontraron productos</h3>
              <p>Tu búsqueda para "{searchTerm}" no arrojó resultados.</p>
            </div>
          )}
        </div>
      ) : (
        // --- Browsing View with Tabs ---
        <Tabs defaultValue={orderedCategories.length > 0 ? orderedCategories[0] : ""} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-zinc-800 h-auto">
                {orderedCategories.map(category => (
                    <TabsTrigger key={category} value={category} className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm whitespace-normal">
                        {categoryTranslations[category] || category}
                    </TabsTrigger>
                ))}
            </TabsList>
            {orderedCategories.map(category => (
                <TabsContent key={category} value={category} className="mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {(groupedMenu[category] || []).map((item) => (
                            <TarjetaArticuloMenu key={item.id} item={item} />
                        ))}
                    </div>
                </TabsContent>
            ))}
        </Tabs>
      )}
    </div>
  );
}
