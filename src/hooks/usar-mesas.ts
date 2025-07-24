"use client";

import { useContext } from 'react';
import { TableContext } from '@/components/proveedores/proveedor-mesas';

export const usarMesas = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('usarMesas must be used within a TableProvider');
  }
  return context;
};
