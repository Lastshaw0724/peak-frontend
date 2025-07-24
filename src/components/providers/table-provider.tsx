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

const TABLES_STORAGE_KEY = 'gustogo-tables';
const ACTIVE_TABLE_SESSION_KEY = 'gustogo-active-table';

const initialTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
    id: `t${i + 1}`,
    name: `Mesa #${i + 1}`,
    status: 'available',
}));

export const TableProvider = ({ children }: { children: ReactNode }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [activeTable, setActiveTable] = useState<Table | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadTables = useCallback(() => {
      try {
        const storedTables = localStorage.getItem(TABLES_STORAGE_KEY);
        if (storedTables) {
            setTables(JSON.parse(storedTables));
        } else {
            setTables(initialTables);
            localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(initialTables));
        }
      } catch (error) {
        console.error("Failed to load tables", error);
        setTables(initialTables);
      }
  }, []);

  const saveTables = useCallback((updatedTables: Table[]) => {
      setTables(updatedTables);
      localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(updatedTables));
  }, []);
  
  useEffect(() => {
    setIsLoading(true);
    loadTables();
    
    try {
        const storedActiveTable = sessionStorage.getItem(ACTIVE_TABLE_SESSION_KEY);
        if(storedActiveTable) {
            setActiveTable(JSON.parse(storedActiveTable));
        }
    } catch(error) {
        console.error("Failed to load active table", error);
    }

    setIsLoading(false);
  }, [loadTables]);

  const handleSetActiveTable = (table: Table | null) => {
    setActiveTable(table);
    if (table) {
        sessionStorage.setItem(ACTIVE_TABLE_SESSION_KEY, JSON.stringify(table));
    } else {
        sessionStorage.removeItem(ACTIVE_TABLE_SESSION_KEY);
    }
  }

  const updateTableStatus = (tableId: string, status: TableStatus) => {
    const updatedTables = tables.map((t) =>
      t.id === tableId ? { ...t, status } : t
    );
    saveTables(updatedTables);
  };

  const contextValue = { 
    tables, 
    updateTableStatus, 
    activeTable, 
    setActiveTable: handleSetActiveTable, 
    isLoading 
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
};
