'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import type { MenuItem, Extra } from '@/lib/types';
import { useOrder } from '@/hooks/use-order';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogClose
} from "@/components/ui/dialog"
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '../ui/scroll-area';

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItemToOrder } = useOrder();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);

  const hasExtras = item.extras && item.extras.length > 0;

  const handleToggleExtra = (extra: Extra, checked: boolean) => {
    setSelectedExtras(prev => 
      checked ? [...prev, extra] : prev.filter(e => e.id !== extra.id)
    );
  };

  const handleConfirm = () => {
    addItemToOrder(item, 1, selectedExtras);
    setIsDialogOpen(false);
    setSelectedExtras([]);
  };

  const handleSimpleAdd = () => {
    addItemToOrder(item, 1, []);
  };
  
  return (
    <>
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
          <CardFooter className="flex justify-center gap-2 p-3 pt-0">
              <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold" 
                  onClick={hasExtras ? () => setIsDialogOpen(true) : handleSimpleAdd}>
                  Add
              </Button>
          </CardFooter>
      </Card>
      {hasExtras && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-card border-border text-foreground">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline">Add Extras to {item.name}</DialogTitle>
              <DialogDescription>
                Select the extras you want to add to the dish.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[40vh] p-1 -mx-2 no-scrollbar">
              <div className="space-y-3 p-4">
                {item.extras?.map(extra => (
                  <div key={extra.id} className="flex items-center space-x-3 rounded-md border border-input p-3 hover:bg-muted/50 transition-colors">
                    <Checkbox 
                      id={`extra-${extra.id}`} 
                      className="size-5"
                      onCheckedChange={(checked) => handleToggleExtra(extra, !!checked)}
                      checked={selectedExtras.some(e => e.id === extra.id)}
                    />
                    <Label htmlFor={`extra-${extra.id}`} className="flex-grow text-base cursor-pointer">
                      {extra.name}
                    </Label>
                    <span className="font-semibold text-primary">+${extra.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <DialogFooter className="border-t pt-4">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button onClick={handleConfirm} className="bg-purple-600 hover:bg-purple-700">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
