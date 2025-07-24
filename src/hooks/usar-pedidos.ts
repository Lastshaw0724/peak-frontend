"use client";

import { useContext } from 'react';
import { OrderContext } from '@/components/proveedores/proveedor-pedidos';

export const usarPedidos = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('usarPedidos must be used within an OrderProvider');
  }
  return context;
};
