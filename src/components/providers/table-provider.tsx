'use client';

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Table, TableStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface TableContextType {
  tables: Table[];
  updateTableStatus: (tableId: string, status: TableStatus) => void;
  activeTable: Table | null;
  setActiveTable: (table: Table | null) => void;
  isLoading: boolean;
}

export const TableContext = createContext<TableContextType | undefined>(undefined);

const initialTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
    id: `t${i + 1}`,
    name: `Mesa #${i + 1}`,
    status: 'available',
}));

export const TableProvider = ({ children }: { children: ReactNode }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [activeTable, setActiveTable] = useState<Table | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTables(initialTables);
    setIsLoading(false);
  }, []);

  const updateTableStatus = (tableId: string, status: TableStatus) => {
    const updatedTables = tables.map((t) =>
      t.id === tableId ? { ...t, status } : t
    );
    setTables(updatedTables);
  };

  const contextValue = { 
    tables, 
    updateTableStatus, 
    activeTable, 
    setActiveTable, 
    isLoading 
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
};
