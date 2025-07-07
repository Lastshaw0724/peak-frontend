"use client";

import { useContext } from 'react';
import { MenuContext } from '@/components/providers/menu-provider';

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
