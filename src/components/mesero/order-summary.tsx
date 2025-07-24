'use client';

import { useState, useEffect } from 'react';
import { useOrder } from '@/hooks/use-order';
import { useTable } from '@/hooks/use-table';
import { useToast } from '@/hooks/use-toast';
import { useDiscount } from '@/hooks/use-discount';
import { useAuth } from '@/hooks/use-auth';
import type { Discount, InvoiceOption } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Trash2, Send, TicketPercent, Printer, Mail, Ban } from 'lucide-react';

export function OrderSummary() {
  const { currentOrder, updateItemQuantity, removeItemFromOrder, submitOrder, clearCurrentOrder, currentOrderDetails } = useOrder();
  const { activeTable, setActiveTable, updateTableStatus } = useTable();
  const { discounts } = useDiscount();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [invoiceOption, setInvoiceOption] = useState<InvoiceOption>('none');
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);

  useEffect(() => {
    if (currentOrderDetails?.customerName) {
        setCustomerName(currentOrderDetails.customerName);
    } else {
        setCustomerName('');
    }
  }, [currentOrderDetails]);

  const availableDiscounts = discounts.filter(d => d.status);
  
  const subtotal = currentOrder.reduce((acc, item) => {
    const extrasPrice = item.selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    const itemPrice = item.price + extrasPrice;
    return acc + (itemPrice * item.quantity);
  }, 0);

  let discountAmount = 0;
  if (selectedDiscount) {
    if (selectedDiscount.value.includes('%')) {
      const percentage = parseFloat(selectedDiscount.value.replace('%', '')) / 100;
      discountAmount = subtotal * percentage;
    } else {
      discountAmount = parseFloat(selectedDiscount.value.replace(/[^0-9.]/g, ''));
    }
  }
  discountAmount = Math.min(subtotal, discountAmount);
  
  const total = subtotal - discountAmount;

  const handleClearOrder = () => {
    if (activeTable) {
        updateTableStatus(activeTable.id, 'available');
    }
    clearCurrentOrder();
    setActiveTable(null);
    setSelectedDiscount(null);
  };

  const handleDiscountChange = (discountCode: string) => {
    if (discountCode === "none") {
        setSelectedDiscount(null);
        return;
    }
    const discount = availableDiscounts.find(d => d.code === discountCode) || null;
    setSelectedDiscount(discount);
  };

  const handleSubmit = () => {
    if (!activeTable) {
        toast({ title: 'Error', description: 'No table is assigned to this order.', variant: 'destructive' });
        return;
    }
    if (!customerName.trim()) {
        toast({ title: 'Required Field', description: 'Please enter the customer name.', variant: 'destructive' });
        return;
    }
    if (!user) {
        toast({ title: 'Authentication Error', description: 'Could not identify the waiter.', variant: 'destructive' });
        return;
    }

    submitOrder({
        customerName: customerName.trim(),
        paymentMethod,
        tableId: activeTable.id,
        tableName: activeTable.name,
        appliedDiscount: selectedDiscount,
        waiterId: user.id,
        waiterName: user.name,
        invoiceOption,
    });
    
    setActiveTable(null);
    setIsCheckoutOpen(false);
    setSelectedDiscount(null);
  };

  return (
    <div className="flex flex-col h-full bg-card border-l">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Current Order</CardTitle>
        {activeTable && (
            <CardDescription className="font-semibold text-lg text-primary !mt-2">
                Table: {activeTable.name}
            </CardDescription>
        )}
      </CardHeader>
      <ScrollArea className="flex-grow no-scrollbar">
        <CardContent>
          {currentOrder.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <p>No items in the order.</p>
              <p className="text-sm">Add items from the menu.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentOrder.map((item) => (
                <div key={item.orderItemId} className="flex items-start justify-between gap-4">
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    {item.selectedExtras.length > 0 && (
                        <ul className="text-xs text-muted-foreground list-disc list-inside pl-2">
                            {item.selectedExtras.map(extra => (
                                <li key={extra.id}>{extra.name} (+${extra.price.toFixed(2)})</li>
                            ))}
                        </ul>
                    )}
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateItemQuantity(item.orderItemId, item.quantity - 1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateItemQuantity(item.orderItemId, item.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItemFromOrder(item.orderItemId)}>
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
            <div className="space-y-2">
                <div className="flex justify-between items-center text-md">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="discount-select" className="text-muted-foreground flex-shrink-0">Discount:</Label>
                    <Select onValueChange={handleDiscountChange} defaultValue="none">
                        <SelectTrigger id="discount-select" className="h-9">
                            <SelectValue placeholder="Apply discount" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="none">None</SelectItem>
                            {availableDiscounts.map(d => (
                                <SelectItem key={d.id} value={d.code}>{d.name} ({d.value})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {selectedDiscount && (
                    <div className="flex justify-between items-center text-md text-destructive">
                        <span>{selectedDiscount.name} ({selectedDiscount.code})</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                )}
            </div>

            <Separator />
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="destructive" onClick={handleClearOrder}>
                <Trash2 className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={() => setIsCheckoutOpen(true)} className="bg-purple-600 text-accent-foreground hover:bg-purple-700">
                <Send className="mr-2 h-4 w-4" /> Submit Order
              </Button>
            </div>
          </CardFooter>
          <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Finalize Order</DialogTitle>
                    <DialogDescription>Fill in the details to send the order to the kitchen.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Customer Name</Label>
                        <Input id="name" placeholder="Customer's name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <RadioGroup defaultValue="cash" value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'cash' | 'card')} className="flex gap-4 pt-1">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cash" id="r1" />
                                <Label htmlFor="r1">Cash</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="card" id="r2" />
                                <Label htmlFor="r2">Card</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label>Invoice Options</Label>
                        <RadioGroup defaultValue="none" value={invoiceOption} onValueChange={(v) => setInvoiceOption(v as InvoiceOption)} className="space-y-1 pt-1">
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="none" id="f0" />
                                <Label htmlFor="f0" className="font-normal flex items-center gap-2"><Ban className="h-4 w-4 text-muted-foreground"/>Not Required</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="print" id="f1" />
                                <Label htmlFor="f1" className="font-normal flex items-center gap-2"><Printer className="h-4 w-4 text-muted-foreground"/>Print at Counter</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="email" id="f2" />
                                <Label htmlFor="f2" className="font-normal flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground"/>Send by Email</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>Submit Order</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
