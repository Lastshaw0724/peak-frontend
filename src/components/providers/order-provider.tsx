"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';
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
    paymentMethod: 'cash' | 'card'; 
    tableId: string; 
    tableName: string; 
    appliedDiscount: Discount | null;
    waiterId: string;
    waiterName: string;
    invoiceOption: InvoiceOption;
  }) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  startPreparingOrder: (orderId: string, preparationTime: number) => void;
  clearCurrentOrder: () => void;
  deleteOrder: (orderId: string) => void;
  loadOrderForEdit: (orderId: string) => Order | undefined;
  isLoading: boolean;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [submittedOrders, setSubmittedOrders] = useState<Order[]>([]);
  const [currentOrderDetails, setCurrentOrderDetails] = useState<CurrentOrderDetails>(null);
  const [isLoading, setIsLoading] = useState(false); // No data to load initially
  const { toast } = useToast();

  const addItemToOrder = (item: MenuItem, quantity: number, selectedExtras: Extra[]) => {
    const extrasKey = selectedExtras.map(e => e.id).sort().join('-');
    const compoundId = `${item.id}-${extrasKey}`;
    
    const existingItemIndex = currentOrder.findIndex(
      (orderItem) => `${orderItem.id}-${orderItem.selectedExtras.map(e => e.id).sort().join('-')}` === compoundId
    );

    let newOrder;
    if (existingItemIndex > -1) {
      newOrder = [...currentOrder];
      newOrder[existingItemIndex] = {
        ...newOrder[existingItemIndex],
        quantity: newOrder[existingItemIndex].quantity + quantity,
      };
    } else {
      const newOrderItem: OrderItem = {
        ...item,
        quantity,
        selectedExtras,
        orderItemId: `oitem-${Date.now()}-${Math.random()}`
      };
      newOrder = [...currentOrder, newOrderItem];
    }
    setCurrentOrder(newOrder);
  };

  const removeItemFromOrder = (orderItemId: string) => {
      const newOrder = currentOrder.filter((item) => item.orderItemId !== orderItemId);
      setCurrentOrder(newOrder);
  };

  const updateItemQuantity = (orderItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromOrder(orderItemId);
    } else {
      const newOrder = currentOrder.map((item) =>
          item.orderItemId === orderItemId ? { ...item, quantity } : item
      );
      setCurrentOrder(newOrder);
    }
  };
  
  const submitOrder = (details: { 
    customerName: string; 
    paymentMethod: 'cash' | 'card'; 
    tableId: string; 
    tableName: string;
    appliedDiscount: Discount | null;
    waiterId: string;
    waiterName: string;
    invoiceOption: InvoiceOption;
  }) => {
    if (currentOrder.length === 0) {
      toast({ variant: "destructive", title: "Pedido Vacío" });
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
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: currentOrder,
      timestamp: new Date(),
      subtotal,
      discountCode: appliedDiscount?.code,
      discountAmount,
      total,
      status: 'new',
      ...restDetails
    };

    setSubmittedOrders([newOrder, ...submittedOrders]);
    setCurrentOrder([]);
    setCurrentOrderDetails(null);
    toast({
      title: "¡Pedido Enviado!",
      description: "El pedido ha sido enviado a la cocina.",
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updatedOrders = submittedOrders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    setSubmittedOrders(updatedOrders);
  };

  const startPreparingOrder = (orderId: string, preparationTime: number) => {
    const updatedOrders = submittedOrders.map((order) =>
      order.id === orderId ? { ...order, status: 'preparing', preparationTime } : order
    );
    setSubmittedOrders(updatedOrders);
    toast({
      title: "Pedido en preparación",
      description: `El pedido #${orderId.slice(-6)} ha comenzado. Tiempo estimado: ${preparationTime} min.`,
    });
  };

  const clearCurrentOrder = () => {
    setCurrentOrder([]);
    setCurrentOrderDetails(null);
  };

  const deleteOrder = (orderId: string) => {
    const updatedOrders = submittedOrders.filter(order => order.id !== orderId);
    setSubmittedOrders(updatedOrders);
    toast({
        title: "Pedido Cancelado",
        description: `El pedido #${orderId.slice(-6)} ha sido eliminado.`,
        variant: 'destructive'
    });
  };

  const loadOrderForEdit = (orderId: string): Order | undefined => {
    const orderToEdit = submittedOrders.find(o => o.id === orderId);
    if (orderToEdit) {
        const remainingOrders = submittedOrders.filter(o => o.id !== orderId);
        setSubmittedOrders(remainingOrders);
        setCurrentOrder(orderToEdit.items);
        setCurrentOrderDetails({ customerName: orderToEdit.customerName });
        toast({
            title: "Modificando Pedido",
            description: `Se ha cargado el pedido #${orderId.slice(-6)}.`,
        });
        return orderToEdit;
    }
    toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cargar el pedido para modificar.",
    });
    return undefined;
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
    isLoading
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};
