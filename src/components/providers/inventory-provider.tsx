"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { InventoryItem } from '@/lib/types';
import { initialInventoryData } from '@/lib/inventory-data';
import { useToast } from "@/hooks/use-toast";

interface InventoryContextType {
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
}

export const InventoryContext = createContext<InventoryContextType | undefined>(undefined);
const INVENTORY_STORAGE_KEY = 'gustogo-inventory';

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (storedInventory) {
        setInventory(JSON.parse(storedInventory));
      } else {
        setInventory(initialInventoryData);
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(initialInventoryData));
      }
    } catch (error) {
      console.error("Failed to load inventory from localStorage", error);
      setInventory(initialInventoryData);
    }
  }, []);

  const persistInventory = (updatedInventory: InventoryItem[]) => {
      setInventory(updatedInventory);
      try {
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(updatedInventory));
      } catch (error) {
        console.error("Failed to save inventory to localStorage", error);
      }
  }

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
    };
    const updatedInventory = [...inventory, newItem];
    persistInventory(updatedInventory);
    toast({
      title: "Insumo Añadido",
      description: `El insumo "${newItem.name}" ha sido añadido al inventario.`,
    });
  };

  return (
    <InventoryContext.Provider value={{ inventory, addInventoryItem }}>
      {children}
    </InventoryContext.Provider>
  );
};
