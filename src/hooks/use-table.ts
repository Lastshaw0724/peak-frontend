"use client";

import { useContext } from 'react';
import { TableContext } from '@/components/providers/table-provider';

export const useTable = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};
