
"use client";

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { OrderItem, Order, MenuItem, OrderStatus, Discount, Extra, InvoiceOption } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

type CurrentOrderDetails = {
    customerName: string;
} | null;

interface OrderContextType {
  currentOrder: OrderItem[];
  submittedOrders: Order[];
  currentOrderDetails: CurrentOrderDetails;
  addItemToOrder: (item: MenuItem, quantity: number, selectedExtras: Extra[]) => void;
  removeItemFromOrder: (orderItemId: string) => void;
  updateItemQuantity: (orderItemId: string, quantity: number) => void;
  submitOrder: (details: { 
    customerName: string; 
    paymentMethod: 'efectivo' | 'transferencia'; 
    tableId: string; 
    tableName: string; 
    appliedDiscount: Discount | null;
    waiterId: string;
    waiterName: string;
    invoiceOption: InvoiceOption;
  }) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  startPreparingOrder: (orderId: string, preparationTime: number) => Promise<void>;
  clearCurrentOrder: () => void;
  deleteOrder: (orderId: string) => Promise<void>;
  loadOrderForEdit: (orderId: string) => Promise<Order | undefined>;
  refreshOrders: () => Promise<void>;
  isLoading: boolean;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [submittedOrders, setSubmittedOrders] = useState<Order[]>([]);
  const [currentOrderDetails, setCurrentOrderDetails] = useState<CurrentOrderDetails>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      const parsedOrders = data.map((order: Order) => ({
        ...order,
        timestamp: new Date(order.timestamp),
      }));
      setSubmittedOrders(parsedOrders);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load order history.' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const addItemToOrder = (item: MenuItem, quantity: number, selectedExtras: Extra[]) => {
    setCurrentOrder((prevOrder) => {
      const extrasKey = selectedExtras.map(e => e.id).sort().join('-');
      const compoundId = `${item.id}-${extrasKey}`;
      
      const existingItemIndex = prevOrder.findIndex(
        (orderItem) => `${orderItem.id}-${orderItem.selectedExtras.map(e => e.id).sort().join('-')}` === compoundId
      );

      if (existingItemIndex > -1) {
        const updatedOrder = [...prevOrder];
        updatedOrder[existingItemIndex] = {
          ...updatedOrder[existingItemIndex],
          quantity: updatedOrder[existingItemIndex].quantity + quantity,
        };
        return updatedOrder;
      } else {
        const newOrderItem: OrderItem = {
          ...item,
          quantity,
          selectedExtras,
          orderItemId: `oitem-${Date.now()}-${Math.random()}`
        };
        return [...prevOrder, newOrderItem];
      }
    });
  };

  const removeItemFromOrder = (orderItemId: string) => {
      setCurrentOrder((prevOrder) => prevOrder.filter((item) => item.orderItemId !== orderItemId));
  };

  const updateItemQuantity = (orderItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromOrder(orderItemId);
    } else {
      setCurrentOrder((prevOrder) =>
        prevOrder.map((item) =>
          item.orderItemId === orderItemId ? { ...item, quantity } : item
        )
      );
    }
  };
  
  const submitOrder = async (details: { 
    customerName: string; 
    paymentMethod: 'efectivo' | 'transferencia'; 
    tableId: string; 
    tableName: string;
    appliedDiscount: Discount | null;
    waiterId: string;
    waiterName: string;
    invoiceOption: InvoiceOption;
  }) => {
    if (currentOrder.length === 0) {
      toast({ variant: "destructive", title: "Empty Order" });
      return;
    }
    
    const { appliedDiscount, ...restDetails } = details;

    const subtotal = currentOrder.reduce((acc, item) => {
        const extrasPrice = item.selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
        return acc + ((item.price + extrasPrice) * item.quantity);
    }, 0);

    let discountAmount = 0;
    if (appliedDiscount) {
      if (appliedDiscount.value.includes('%')) {
        discountAmount = subtotal * (parseFloat(appliedDiscount.value) / 100);
      } else {
        discountAmount = parseFloat(appliedDiscount.value.replace(/[^0-9.]/g, ''));
      }
    }
    const total = subtotal - discountAmount;
    
    const newOrderPayload = {
      items: currentOrder,
      subtotal,
      discountCode: appliedDiscount?.code,
      discountAmount,
      total,
      status: 'new',
      ...restDetails
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrderPayload)
        });
        if (!response.ok) throw new Error('Failed to submit order');

        await refreshOrders();
        setCurrentOrder([]);
        setCurrentOrderDetails(null);
        toast({
          title: "Order Submitted!",
          description: "The order has been sent to the kitchen.",
        });

    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not submit the order.' });
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update status');
        await refreshOrders();
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update order status.' });
    }
  };

  const startPreparingOrder = async (orderId: string, preparationTime: number) => {
    try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'preparing', preparationTime })
        });
        if (!response.ok) throw new Error('Failed to start preparation');
        await refreshOrders();
        toast({
          title: "Pedido en preparación",
          description: `El pedido #${orderId.slice(-6)} ha comenzado. Tiempo estimado: ${preparationTime} min.`,
        });
    } catch(error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo iniciar la preparación del pedido.' });
    }
  };

  const clearCurrentOrder = () => {
    setCurrentOrder([]);
    setCurrentOrderDetails(null);
  };

  const deleteOrder = async (orderId: string) => {
    try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete order');
        await refreshOrders();
        toast({
            title: "Pedido Cancelado",
            description: `El pedido #${orderId.slice(-6)} ha sido eliminado.`,
            variant: 'destructive'
        });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cancelar el pedido.' });
    }
  };

  const loadOrderForEdit = async (orderId: string): Promise<Order | undefined> => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH', // Using PATCH to signify this special "load and remove" operation
      });
      if (!response.ok) throw new Error('Order not found or could not be loaded');

      const orderToEdit: Order = await response.json();
      await refreshOrders(); // Refresh the list now that the order is removed from the main list

      setCurrentOrder(orderToEdit.items);
      setCurrentOrderDetails({ customerName: orderToEdit.customerName });
      
      toast({
          title: "Modificando Pedido",
          description: `Se ha cargado el pedido #${orderId.slice(-6)}.`,
      });

      return orderToEdit;
    } catch (error) {
      toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el pedido para modificar.",
      });
      return undefined;
    }
  };

  const contextValue = {
    currentOrder,
    submittedOrders,
    currentOrderDetails,
    addItemToOrder,
    removeItemFromOrder,
    updateItemQuantity,
    submitOrder,
    updateOrderStatus,
    startPreparingOrder,
    clearCurrentOrder,
    deleteOrder,
    loadOrderForEdit,
    refreshOrders,
    isLoading
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};
