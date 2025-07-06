import { menuData } from '@/lib/menu-data';
import { MenuItemCard } from './menu-item-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { MenuItem } from '@/lib/types';

export function MenuDisplay() {
  const groupedMenu = menuData.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-3xl font-bold font-headline mb-6">Menu</h2>
      <Accordion type="multiple" defaultValue={Object.keys(groupedMenu)} className="w-full">
        {Object.entries(groupedMenu).map(([category, items]) => (
          <AccordionItem value={category} key={category}>
            <AccordionTrigger className="text-2xl font-headline hover:no-underline text-primary">
              {category}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pt-4">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
