"use client";

import { useContext } from 'react';
import { MenuContext } from '@/components/proveedores/proveedor-menu';

export const usarMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('usarMenu must be used within a MenuProvider');
  }
  return context;
};
