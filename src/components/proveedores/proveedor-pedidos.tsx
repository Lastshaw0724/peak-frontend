
"use client";

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { ArticuloPedido, Pedido, ArticuloMenu, EstadoPedido, Descuento, Extra, OpcionFactura } from '@/lib/tipos';
import { useToast } from "@/hooks/use-toast";

type DetallesPedidoActual = {
    customerName: string;
} | null;

interface OrderContextType {
  currentOrder: ArticuloPedido[];
  submittedOrders: Pedido[];
  currentOrderDetails: DetallesPedidoActual;
  addItemToOrder: (item: ArticuloMenu, quantity: number, selectedExtras: Extra[]) => void;
  removeItemFromOrder: (orderItemId: string) => void;
  updateItemQuantity: (orderItemId: string, quantity: number) => void;
  submitOrder: (details: { 
    customerName: string; 
    paymentMethod: 'efectivo' | 'transferencia'; 
    tableId: string; 
    tableName: string; 
    appliedDiscount: Descuento | null;
    waiterId: string;
    waiterName: string;
    invoiceOption: OpcionFactura;
  }) => void;
  updateOrderStatus: (orderId: string, status: EstadoPedido) => void;
  startPreparingOrder: (orderId: string, preparationTime: number) => void;
  clearCurrentOrder: () => void;
  deleteOrder: (orderId: string) => void;
  loadOrderForEdit: (orderId: string) => Pedido | undefined;
  isLoading: boolean;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

const CURRENT_ORDER_KEY = 'gustogo-current-order';
const SUBMITTED_ORDERS_KEY = 'gustogo-submitted-orders';
const CURRENT_ORDER_DETAILS_KEY = 'gustogo-current-order-details';

export const ProveedorPedidos = ({ children }: { children: ReactNode }) => {
  const [currentOrder, setCurrentOrder] = useState<ArticuloPedido[]>([]);
  const [submittedOrders, setSubmittedOrders] = useState<Pedido[]>([]);
  const [currentOrderDetails, setCurrentOrderDetails] = useState<DetallesPedidoActual>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadOrders = useCallback(() => {
    try {
        const storedCurrentOrder = localStorage.getItem(CURRENT_ORDER_KEY);
        if (storedCurrentOrder) setCurrentOrder(JSON.parse(storedCurrentOrder));

        const storedSubmittedOrders = localStorage.getItem(SUBMITTED_ORDERS_KEY);
        if (storedSubmittedOrders) {
            const parsedOrders = JSON.parse(storedSubmittedOrders).map((order: Pedido) => ({
                ...order,
                timestamp: new Date(order.timestamp),
            }));
            setSubmittedOrders(parsedOrders);
        }
        
        const storedDetails = localStorage.getItem(CURRENT_ORDER_DETAILS_KEY);
        if (storedDetails) setCurrentOrderDetails(JSON.parse(storedDetails));

    } catch (error) {
        console.error("Failed to load orders from localStorage", error);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadOrders();
    setIsLoading(false);
  }, [loadOrders]);


  const saveCurrentOrder = (order: ArticuloPedido[]) => {
      setCurrentOrder(order);
      localStorage.setItem(CURRENT_ORDER_KEY, JSON.stringify(order));
  };

  const saveSubmittedOrders = (orders: Pedido[]) => {
      setSubmittedOrders(orders);
      localStorage.setItem(SUBMITTED_ORDERS_KEY, JSON.stringify(orders));
  };
  
  const saveCurrentOrderDetails = (details: DetallesPedidoActual) => {
      setCurrentOrderDetails(details);
      if (details) {
        localStorage.setItem(CURRENT_ORDER_DETAILS_KEY, JSON.stringify(details));
      } else {
        localStorage.removeItem(CURRENT_ORDER_DETAILS_KEY);
      }
  }

  const addItemToOrder = (item: ArticuloMenu, quantity: number, selectedExtras: Extra[]) => {
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
      const newOrderItem: ArticuloPedido = {
        ...item,
        quantity,
        selectedExtras,
        orderItemId: `oitem-${Date.now()}-${Math.random()}`
      };
      newOrder = [...currentOrder, newOrderItem];
    }
    saveCurrentOrder(newOrder);
  };

  const removeItemFromOrder = (orderItemId: string) => {
      const newOrder = currentOrder.filter((item) => item.orderItemId !== orderItemId);
      saveCurrentOrder(newOrder);
  };

  const updateItemQuantity = (orderItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromOrder(orderItemId);
    } else {
      const newOrder = currentOrder.map((item) =>
          item.orderItemId === orderItemId ? { ...item, quantity } : item
      );
      saveCurrentOrder(newOrder);
    }
  };
  
  const submitOrder = (details: { 
    customerName: string; 
    paymentMethod: 'efectivo' | 'transferencia'; 
    tableId: string; 
    tableName: string;
    appliedDiscount: Descuento | null;
    waiterId: string;
    waiterName: string;
    invoiceOption: OpcionFactura;
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
    
    const newOrder: Pedido = {
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

    saveSubmittedOrders([newOrder, ...submittedOrders]);
    saveCurrentOrder([]);
    saveCurrentOrderDetails(null);
    toast({
      title: "¡Pedido Enviado!",
      description: "El pedido ha sido enviado a la cocina.",
    });
  };

  const updateOrderStatus = (orderId: string, status: EstadoPedido) => {
    const updatedOrders = submittedOrders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    saveSubmittedOrders(updatedOrders);
  };

  const startPreparingOrder = (orderId: string, preparationTime: number) => {
    const updatedOrders = submittedOrders.map((order) =>
      order.id === orderId ? { ...order, status: 'preparing', preparationTime } : order
    );
    saveSubmittedOrders(updatedOrders);
    toast({
      title: "Pedido en preparación",
      description: `El pedido #${orderId.slice(-6)} ha comenzado. Tiempo estimado: ${preparationTime} min.`,
    });
  };

  const clearCurrentOrder = () => {
    saveCurrentOrder([]);
    saveCurrentOrderDetails(null);
  };

  const deleteOrder = (orderId: string) => {
    const updatedOrders = submittedOrders.filter(order => order.id !== orderId);
    saveSubmittedOrders(updatedOrders);
    toast({
        title: "Pedido Cancelado",
        description: `El pedido #${orderId.slice(-6)} ha sido eliminado.`,
        variant: 'destructive'
    });
  };

  const loadOrderForEdit = (orderId: string): Pedido | undefined => {
    const orderToEdit = submittedOrders.find(o => o.id === orderId);
    if (orderToEdit) {
        const remainingOrders = submittedOrders.filter(o => o.id !== orderId);
        saveSubmittedOrders(remainingOrders);
        saveCurrentOrder(orderToEdit.items);
        saveCurrentOrderDetails({ customerName: orderToEdit.customerName });
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
