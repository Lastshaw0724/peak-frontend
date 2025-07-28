"use client";

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { InventoryItem } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { initialInventoryData } from '@/lib/inventory-data';

interface InventoryContextType {
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, data: Omit<InventoryItem, 'id'>) => void;
  deleteInventoryItem: (id: string) => void;
  isLoading: boolean;
}

export const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    setInventory(initialInventoryData);
    setIsLoading(false);
  }, []);

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      ...itemData
    };
    setInventory([...inventory, newItem]);
    toast({
        title: "Insumo Añadido",
        description: `El insumo "${newItem.name}" ha sido añadido al inventario.`,
    });
  };

  const updateInventoryItem = (id: string, data: Omit<InventoryItem, 'id'>) => {
    const updatedInventory = inventory.map(item => 
        item.id === id ? { id, ...data } : item
    );
    setInventory(updatedInventory);
     toast({
        title: "Insumo Actualizado",
        description: `El insumo "${data.name}" ha sido actualizado.`,
    });
  };

  const deleteInventoryItem = (id: string) => {
    const itemToDelete = inventory.find(item => item.id === id);
    const updatedInventory = inventory.filter(item => item.id !== id);
    setInventory(updatedInventory);
     toast({
        title: "Insumo Eliminado",
        description: `El insumo "${itemToDelete?.name}" ha sido eliminado.`,
        variant: "destructive",
    });
  };

  const contextValue = {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    isLoading
  };

  return (
    <InventoryContext.Provider value={contextValue}>
      {children}
    </InventoryContext.Provider>
  );
};
