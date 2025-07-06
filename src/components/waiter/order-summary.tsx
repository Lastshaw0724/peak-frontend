'use client';

import { useOrder } from '@/hooks/use-order';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2, Send } from 'lucide-react';

export function OrderSummary() {
  const { currentOrder, updateItemQuantity, removeItemFromOrder, submitOrder, clearCurrentOrder } = useOrder();
  const total = currentOrder.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-card border-l">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Current Order</CardTitle>
      </CardHeader>
      <ScrollArea className="flex-grow">
        <CardContent>
          {currentOrder.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <p>No items in order yet.</p>
              <p className="text-sm">Add items from the menu to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentOrder.map((item, index) => (
                <div key={`${item.id}-${item.customization}-${index}`} className="flex items-start justify-between gap-4">
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    {item.customization && (
                      <p className="text-sm text-primary italic pl-2 border-l-2 border-primary/50">
                        {item.customization}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateItemQuantity(item.id, item.quantity - 1, item.customization)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateItemQuantity(item.id, item.quantity + 1, item.customization)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItemFromOrder(item.id, item.customization)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </ScrollArea>
      {currentOrder.length > 0 && (
        <CardFooter className="flex-col !items-stretch gap-4 p-6 border-t">
          <Separator />
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <Button variant="outline" onClick={clearCurrentOrder}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear Order
            </Button>
            <Button onClick={submitOrder} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Send className="mr-2 h-4 w-4" /> Send to Kitchen
            </Button>
          </div>
        </CardFooter>
      )}
    </div>
  );
}
