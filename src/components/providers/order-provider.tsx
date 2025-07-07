"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { OrderItem, Order, MenuItem, OrderStatus, Discount } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface OrderContextType {
  currentOrder: OrderItem[];
  submittedOrders: Order[];
  addItemToOrder: (item: MenuItem, quantity: number) => void;
  removeItemFromOrder: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  submitOrder: (details: { 
    customerName: string; 
    paymentMethod: 'efectivo' | 'transferencia'; 
    tableId: string; 
    tableName: string; 
    appliedDiscount: Discount | null;
  }) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  clearCurrentOrder: () => void;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);
const ORDERS_STORAGE_KEY = 'gustogo-orders';


export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [submittedOrders, setSubmittedOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders).map((order: Order) => ({
          ...order,
          timestamp: new Date(order.timestamp),
        }));
        setSubmittedOrders(parsedOrders);
      }
    } catch (error) {
      console.error("Failed to load orders from localStorage", error);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ORDERS_STORAGE_KEY && event.newValue) {
        try {
            const parsedOrders = JSON.parse(event.newValue).map((order: Order) => ({
                ...order,
                timestamp: new Date(order.timestamp),
            }));
            setSubmittedOrders(parsedOrders);
        } catch (error) {
            console.error("Failed to parse orders from storage event", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const persistOrders = (orders: Order[]) => {
      setSubmittedOrders(orders);
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      } catch (error) {
        console.error("Failed to save orders to localStorage", error);
      }
  }

  const addItemToOrder = (item: MenuItem, quantity: number) => {
    setCurrentOrder((prevOrder) => {
      const existingItemIndex = prevOrder.findIndex(
        (orderItem) => orderItem.id === item.id
      );

      if (existingItemIndex > -1) {
        const updatedOrder = [...prevOrder];
        updatedOrder[existingItemIndex] = {
          ...updatedOrder[existingItemIndex],
          quantity: updatedOrder[existingItemIndex].quantity + quantity,
        };
        return updatedOrder;
      } else {
        return [...prevOrder, { ...item, quantity }];
      }
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
        prevOrder.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };
  
  const submitOrder = (details: { 
    customerName: string; 
    paymentMethod: 'efectivo' | 'transferencia'; 
    tableId: string; 
    tableName: string;
    appliedDiscount: Discount | null;
  }) => {
    if (currentOrder.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Order",
        description: "Cannot submit an empty order.",
      });
      return;
    }
    
    const { appliedDiscount, ...restDetails } = details;

    const subtotal = currentOrder.reduce((acc, item) => acc + item.price * item.quantity, 0);

    let discountAmount = 0;
    if (appliedDiscount) {
      if (appliedDiscount.value.includes('%')) {
        const percentage = parseFloat(appliedDiscount.value.replace('%', '')) / 100;
        discountAmount = subtotal * percentage;
      } else {
        discountAmount = parseFloat(appliedDiscount.value.replace(/[^0-9.]/g, ''));
      }
    }
    discountAmount = Math.min(subtotal, discountAmount);

    const total = subtotal - discountAmount;
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: currentOrder,
      subtotal,
      discountCode: appliedDiscount?.code,
      discountAmount,
      total,
      timestamp: new Date(),
      status: 'new',
      ...restDetails
    };

    persistOrders([newOrder, ...submittedOrders]);
    setCurrentOrder([]);
    toast({
      title: "Order Submitted!",
      description: "The order has been sent to the kitchen.",
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updatedOrders = submittedOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
    );
    persistOrders(updatedOrders);
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
