"use client";

import React, { createContext, useState, ReactNode } from 'react';
import type { OrderItem, Order, MenuItem } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface OrderContextType {
  currentOrder: OrderItem[];
  submittedOrders: Order[];
  addItemToOrder: (item: MenuItem, quantity: number, customization?: string) => void;
  removeItemFromOrder: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  submitOrder: () => void;
  updateOrderStatus: (orderId: string, status: 'preparing' | 'ready') => void;
  clearCurrentOrder: () => void;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [submittedOrders, setSubmittedOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  const addItemToOrder = (item: MenuItem, quantity: number, customization?: string) => {
    setCurrentOrder((prevOrder) => {
      const existingItem = prevOrder.find((orderItem) => orderItem.id === item.id && orderItem.customization === (customization || ''));
      if (existingItem) {
        return prevOrder.map((orderItem) =>
          orderItem.id === item.id && orderItem.customization === (customization || '')
            ? { ...orderItem, quantity: orderItem.quantity + quantity }
            : orderItem
        );
      } else {
        return [...prevOrder, { ...item, quantity, customization }];
      }
    });
    toast({
      title: "Item Added",
      description: `${item.name} has been added to the order.`,
    });
  };

  const removeItemFromOrder = (itemId: string) => {
    setCurrentOrder((prevOrder) => prevOrder.filter((item) => item.id !== itemId));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromOrder(itemId);
    } else {
      setCurrentOrder((prevOrder) =>
        prevOrder.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );
    }
  };
  
  const submitOrder = () => {
    if (currentOrder.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Order",
        description: "Cannot submit an empty order.",
      });
      return;
    }
    const total = currentOrder.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: currentOrder,
      total,
      timestamp: new Date(),
      status: 'new',
    };
    setSubmittedOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder([]);
    toast({
      title: "Order Submitted!",
      description: "The order has been sent to the kitchen.",
    });
  };

  const updateOrderStatus = (orderId: string, status: 'preparing' | 'ready') => {
    setSubmittedOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
     toast({
      title: "Order Status Updated",
      description: `Order ${orderId} is now ${status}.`,
    });
  };

  const clearCurrentOrder = () => {
    setCurrentOrder([]);
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        submittedOrders,
        addItemToOrder,
        removeItemFromOrder,
        updateItemQuantity,
        submitOrder,
        updateOrderStatus,
        clearCurrentOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
