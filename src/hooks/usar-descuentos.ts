"use client";

import { useContext } from 'react';
import { DiscountContext } from '@/components/proveedores/proveedor-descuentos';

export const usarDescuentos = () => {
  const context = useContext(DiscountContext);
  if (context === undefined) {
    throw new Error('usarDescuentos must be used within a DiscountProvider');
  }
  return context;
};
