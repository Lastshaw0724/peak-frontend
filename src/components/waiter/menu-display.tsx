'use client';
import { useMenu } from '@/hooks/use-menu';
import { MenuItemCard } from './menu-item-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MenuItem } from '@/lib/types';

export function MenuDisplay() {
  const { menu } = useMenu();
  const categories = [...new Set(menu.map(item => item.category))];
  
  const categoryTranslations: Record<string, string> = {
      'Appetizers': 'Entradas',
      'Main Courses': 'Platos Fuertes',
      'Desserts': 'Postres',
      'Drinks': 'Bebidas'
  };

  const categoryOrder = ['Appetizers', 'Main Courses', 'Desserts', 'Drinks'];
  const orderedCategories = categoryOrder.filter(c => categories.includes(c));

  const groupedMenu = menu.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="p-4 sm:p-6 text-white">
      <h2 className="text-4xl font-bold font-headline mb-6 text-center uppercase">Cartilla</h2>
      <Tabs defaultValue={orderedCategories.length > 0 ? orderedCategories[0] : ''} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-zinc-800 h-auto">
            {orderedCategories.map(category => (
                <TabsTrigger key={category} value={category} className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm whitespace-normal">
                    {categoryTranslations[category] || category}
                </TabsTrigger>
            ))}
        </TabsList>
        {orderedCategories.map(category => (
            <TabsContent key={category} value={category} className="mt-6">
                <h3 className="text-2xl font-headline mb-4">{categoryTranslations[category] || category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {(groupedMenu[category] || []).map((item) => (
                        <MenuItemCard key={item.id} item={item} />
                    ))}
                </div>
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
