
'use client';

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Table, TableStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface TableContextType {
  tables: Table[];
  updateTableStatus: (tableId: string, status: TableStatus) => Promise<void>;
  activeTable: Table | null;
  setActiveTable: (table: Table | null) => void;
  isLoading: boolean;
  refreshTables: () => Promise<void>;
}

export const TableContext = createContext<TableContextType | undefined>(undefined);

const ACTIVE_TABLE_SESSION_KEY = 'gustogo-active-table';

export const TableProvider = ({ children }: { children: ReactNode }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [activeTable, setActiveTable] = useState<Table | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshTables = useCallback(async () => {
    setIsLoading(true);
    try {
        const response = await fetch('/api/tables');
        if (!response.ok) throw new Error('Failed to fetch tables');
        const data = await response.json();
        setTables(data);
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load table data.' });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    refreshTables();
    
    // Also load active table from session storage
    const storedActiveTable = sessionStorage.getItem(ACTIVE_TABLE_SESSION_KEY);
    if(storedActiveTable) {
        setActiveTable(JSON.parse(storedActiveTable));
    }
  }, [refreshTables]);

  const handleSetActiveTable = (table: Table | null) => {
    setActiveTable(table);
    if (table) {
        sessionStorage.setItem(ACTIVE_TABLE_SESSION_KEY, JSON.stringify(table));
    } else {
        sessionStorage.removeItem(ACTIVE_TABLE_SESSION_KEY);
    }
  }

  const updateTableStatus = async (tableId: string, status: TableStatus) => {
    try {
        const response = await fetch('/api/tables', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tableId, status })
        });
        if (!response.ok) throw new Error('Failed to update table status');
        await refreshTables(); // Re-fetch all tables to ensure consistency
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update table status.' });
    }
  };

  const contextValue = { 
    tables, 
    updateTableStatus, 
    activeTable, 
    setActiveTable: handleSetActiveTable, 
    isLoading,
    refreshTables 
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
};
