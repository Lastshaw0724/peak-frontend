'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import type { MenuItem } from '@/lib/types';
import { useOrder } from '@/hooks/use-order';

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { currentOrder, addItemToOrder, updateItemQuantity } = useOrder();

  const itemInOrder = currentOrder.find(orderItem => orderItem.id === item.id);
  const quantity = itemInOrder ? itemInOrder.quantity : 0;

  const handleAdd = () => {
    addItemToOrder(item, 1);
  };

  const handleRemove = () => {
    if (quantity > 0) {
      updateItemQuantity(item.id, quantity - 1);
    }
  };

  return (
    <Card className="flex flex-col h-full bg-zinc-800/50 border-zinc-700 overflow-hidden text-white shadow-lg">
        <CardContent className="p-0 flex-grow">
            <div className="relative aspect-square w-full">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    data-ai-hint={item.dataAiHint}
                />
            </div>
            <div className="p-3">
                <CardTitle className="text-sm font-semibold truncate">{item.name}</CardTitle>
            </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2 p-3 pt-0">
            <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold" 
                onClick={handleAdd}>
                Añadir
            </Button>
            <Button 
                variant="destructive" 
                className="w-full font-bold"
                onClick={handleRemove}
                disabled={quantity === 0}>
                Cancelar
            </Button>
        </CardFooter>
    </Card>
  );
}