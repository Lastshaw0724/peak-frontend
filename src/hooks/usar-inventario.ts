
"use client";

import { useContext } from 'react';
import { InventoryContext } from '@/components/proveedores/proveedor-inventario';

export const usarInventario = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('usarInventario must be used within an InventoryProvider');
  }
  return context;
};
