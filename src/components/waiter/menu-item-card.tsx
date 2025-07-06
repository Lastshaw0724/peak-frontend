'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { MenuItem } from '@/lib/types';
import { useOrder } from '@/hooks/use-order';
import { PlusCircle, Edit } from 'lucide-react';

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItemToOrder } = useOrder();
  const [isCustomizeOpen, setCustomizeOpen] = useState(false);
  const [customization, setCustomization] = useState('');

  const handleAddToOrder = () => {
    addItemToOrder(item, 1, customization);
    setCustomization('');
    setCustomizeOpen(false);
  };

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/50">
        <CardHeader>
          <CardTitle className="font-headline text-xl">{item.name}</CardTitle>
          <CardDescription className="text-base min-h-[3rem]">{item.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="relative aspect-video w-full rounded-md overflow-hidden mb-4">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={item.dataAiHint}
            />
          </div>
          <p className="text-lg font-semibold text-primary">${item.price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setCustomizeOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Customize
          </Button>
          <Button size="sm" onClick={() => addItemToOrder(item, 1)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add to Order
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isCustomizeOpen} onOpenChange={setCustomizeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline">Customize {item.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="customization">Notes (e.g., allergies, preferences)</Label>
            <Textarea
              id="customization"
              value={customization}
              onChange={(e) => setCustomization(e.target.value)}
              placeholder="e.g. No onions, extra cheese..."
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddToOrder}>Add Customized Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
