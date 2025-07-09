
"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { OrderItem, Order, MenuItem, OrderStatus, Discount, Extra } from '@/lib/types';
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
  }) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  startPreparingOrder: (orderId: string, preparationTime: number) => void;
  clearCurrentOrder: () => void;
  deleteOrder: (orderId: string) => void;
  loadOrderForEdit: (orderId: string) => Order | undefined;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);
const ORDERS_STORAGE_KEY = 'gustogo-orders';


export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [submittedOrders, setSubmittedOrders] = useState<Order[]>([]);
  const [currentOrderDetails, setCurrentOrderDetails] = useState<CurrentOrderDetails>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders).map((order: Order) => ({
          ...order,
          timestamp: new Date(order.timestamp),
          items: order.items.map((item, index) => ({
            ...item,
            orderItemId: item.orderItemId || `oitem-${order.id}-${index}`,
            selectedExtras: item.selectedExtras || [],
          }))
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
                items: order.items.map((item, index) => ({
                  ...item,
                  orderItemId: item.orderItemId || `oitem-${order.id}-${index}`,
                  selectedExtras: item.selectedExtras || [],
                }))
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

  const addItemToOrder = (item: MenuItem, quantity: number, selectedExtras: Extra[]) => {
    setCurrentOrder((prevOrder) => {
      // Create a consistent key for an item with specific extras
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
  
  const submitOrder = (details: { 
    customerName: string; 
    paymentMethod: 'efectivo' | 'transferencia'; 
    tableId: string; 
    tableName: string;
    appliedDiscount: Discount | null;
    waiterId: string;
    waiterName: string;
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

    const subtotal = currentOrder.reduce((acc, item) => {
        const extrasPrice = item.selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
        const itemPrice = item.price + extrasPrice;
        return acc + (itemPrice * item.quantity);
    }, 0);

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
    setCurrentOrderDetails(null);
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

  const startPreparingOrder = (orderId: string, preparationTime: number) => {
    const updatedOrders = submittedOrders.map((order) =>
      order.id === orderId ? { ...order, status: 'preparing', preparationTime } : order
    );
    persistOrders(updatedOrders);
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
    const orderToDelete = submittedOrders.find(o => o.id === orderId);
    if (orderToDelete) {
        const updatedOrders = submittedOrders.filter(o => o.id !== orderId);
        persistOrders(updatedOrders);
        toast({
            title: "Pedido Cancelado",
            description: `El pedido #${orderId.slice(-6)} ha sido eliminado.`,
            variant: 'destructive'
        });
    }
  };

  const loadOrderForEdit = (orderId: string): Order | undefined => {
    const orderToEdit = submittedOrders.find(o => o.id === orderId);
    
    if (!orderToEdit) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo encontrar el pedido para modificar.",
        });
        return undefined;
    }

    const remainingOrders = submittedOrders.filter(o => o.id !== orderId);
    persistOrders(remainingOrders);
    
    const itemsToLoad = orderToEdit.items.map(item => ({
        ...item,
        orderItemId: item.orderItemId || `oitem-${Date.now()}-${Math.random()}`,
        selectedExtras: item.selectedExtras || [],
    }));

    setCurrentOrder(itemsToLoad);
    setCurrentOrderDetails({ customerName: orderToEdit.customerName });
    
    toast({
        title: "Modificando Pedido",
        description: `Se ha cargado el pedido #${orderId.slice(-6)}. Realiza los cambios y vuelve a finalizar el pedido.`,
    });

    return orderToEdit;
  };


  return (
    <OrderContext.Provider
      value={{
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
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
