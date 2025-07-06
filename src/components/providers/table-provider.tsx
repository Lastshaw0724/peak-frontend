'use client';

import React, { createContext, useState, ReactNode } from 'react';

export type TableStatus = 'available' | 'occupied' | 'reserved';

export interface Table {
  id: string;
  name: string;
  status: TableStatus;
}

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

export const TableProvider = ({ children }: { children: ReactNode }) => {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [activeTable, setActiveTable] = useState<Table | null>(null);

  const updateTableStatus = (tableId: string, status: TableStatus) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, status } : table
      )
    );
  };

  return (
    <TableContext.Provider value={{ tables, updateTableStatus, activeTable, setActiveTable }}>
      {children}
    </TableContext.Provider>
  );
};
