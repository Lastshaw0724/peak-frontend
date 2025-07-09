'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { Table, TableStatus } from '@/lib/types';


const initialTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: `t${i + 1}`,
  name: `Mesa #${i + 1}`,
  status: 'available',
}));

interface TableContextType {
  tables: Table[];
  updateTableStatus: (tableId: string, status: TableStatus) => void;
  activeTable: Table | null;
  setActiveTable: (table: Table | null) => void;
}

export const TableContext = createContext<TableContextType | undefined>(undefined);
const TABLES_STORAGE_KEY = 'gustogo-tables';

export const TableProvider = ({ children }: { children: ReactNode }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [activeTable, setActiveTable] = useState<Table | null>(null);

  useEffect(() => {
    try {
      const storedTables = localStorage.getItem(TABLES_STORAGE_KEY);
      if (storedTables) {
        setTables(JSON.parse(storedTables));
      } else {
        setTables(initialTables);
        localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(initialTables));
      }
    } catch (error) {
      console.error("Failed to load tables from localStorage", error);
      setTables(initialTables);
    }

     // Listen for changes in other tabs
     const handleStorageChange = (event: StorageEvent) => {
        if (event.key === TABLES_STORAGE_KEY && event.newValue) {
          try {
              setTables(JSON.parse(event.newValue));
          } catch (error) {
              console.error("Failed to parse tables from storage event", error);
          }
        }
      };
  
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };

  }, []);

  const persistTables = (updatedTables: Table[]) => {
      setTables(updatedTables);
      try {
        localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(updatedTables));
      } catch (error) {
        console.error("Failed to save tables to localStorage", error);
      }
  }


  const updateTableStatus = (tableId: string, status: TableStatus) => {
    const updatedTables = tables.map((table) =>
        table.id === tableId ? { ...table, status } : table
    );
    persistTables(updatedTables);
  };

  return (
    <TableContext.Provider value={{ tables, updateTableStatus, activeTable, setActiveTable }}>
      {children}
    </TableContext.Provider>
  );
};
