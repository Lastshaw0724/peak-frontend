import { useMenu } from '@/hooks/use-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import type { MenuItem } from '@/lib/types';

export default function CustomerMenu() {
  const { menu } = useMenu();
  
  const categoryTranslations: Record<string, string> = {
    'Appetizers': 'Entradas',
    'Main Courses': 'Platos Fuertes',
    'Desserts': 'Postres',
    'Drinks': 'Bebidas'
  };

  const groupedMenu = menu.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const orderedCategories = ['Appetizers', 'Main Courses', 'Desserts', 'Drinks'];

  return (
    <div className="space-y-12">
      {orderedCategories.map(category => {
        const items = groupedMenu[category];
        if (!items || items.length === 0) return null;
        
        return (
          <section key={category}>
            <h2 className="text-4xl font-headline font-bold mb-8 text-center text-primary border-b-2 border-primary/30 pb-4">{categoryTranslations[category] || category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden border-transparent shadow-lg bg-card">
                   <div className="relative aspect-video w-full">
                     <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        data-ai-hint={item.dataAiHint}
                      />
                   </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4 min-h-[4rem]">{item.description}</CardDescription>
                    <p className="text-xl font-semibold text-primary">${item.price.toFixed(2)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  );
}
