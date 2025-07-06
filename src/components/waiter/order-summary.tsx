'use client';

import { useState } from 'react';
import { useOrder } from '@/hooks/use-order';
import { useTable } from '@/hooks/use-table';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Minus, Trash2, Send } from 'lucide-react';

export function OrderSummary() {
  const { currentOrder, updateItemQuantity, removeItemFromOrder, submitOrder, clearCurrentOrder } = useOrder();
  const { activeTable, setActiveTable } = useTable();
  const { toast } = useToast();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia'>('efectivo');

  const total = currentOrder.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleClearOrder = () => {
    clearCurrentOrder();
    setActiveTable(null);
  };

  const handleSubmit = () => {
    if (!activeTable) {
        toast({ title: 'Error', description: 'No hay ninguna mesa asignada a este pedido.', variant: 'destructive' });
        return;
    }
    if (!customerName.trim()) {
        toast({ title: 'Campo requerido', description: 'Por favor, introduce el nombre del cliente.', variant: 'destructive' });
        return;
    }

    submitOrder({
        customerName: customerName.trim(),
        paymentMethod,
        tableId: activeTable.id,
        tableName: activeTable.name,
    });
    
    setActiveTable(null);
    setIsCheckoutOpen(false);
    setCustomerName('');
  };

  return (
    <div className="flex flex-col h-full bg-card border-l">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Orden Actual</CardTitle>
        {activeTable && (
            <CardDescription className="font-semibold text-lg text-primary !mt-2">
                Mesa: {activeTable.name}
            </CardDescription>
        )}
      </CardHeader>
      <ScrollArea className="flex-grow">
        <CardContent>
          {currentOrder.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <p>No hay artículos en la orden.</p>
              <p className="text-sm">Añade artículos desde la cartilla.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentOrder.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-start justify-between gap-4">
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItemFromOrder(item.id)}>
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
        <>
          <CardFooter className="flex-col !items-stretch gap-4 p-6 border-t">
            <Separator />
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="destructive" onClick={handleClearOrder}>
                <Trash2 className="mr-2 h-4 w-4" /> Cancelar
              </Button>
              <Button onClick={() => setIsCheckoutOpen(true)} className="bg-purple-600 text-accent-foreground hover:bg-purple-700">
                <Send className="mr-2 h-4 w-4" /> Finalizar Pedido
              </Button>
            </div>
          </CardFooter>
          <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Finalizar Pedido</DialogTitle>
                    <DialogDescription>Completa los detalles para enviar el pedido a la cocina.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Nombre</Label>
                        <Input id="name" placeholder="Nombre del cliente" className="col-span-3" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">Pago</Label>
                        <RadioGroup defaultValue="efectivo" className="col-span-3" value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'efectivo' | 'transferencia')}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="efectivo" id="r1" />
                                <Label htmlFor="r1">Efectivo</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="transferencia" id="r2" />
                                <Label htmlFor="r2">Transferencia</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>Enviar Pedido</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
