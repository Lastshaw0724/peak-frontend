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

const INVENTORY_STORAGE_KEY = 'gustogo-inventory';

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadInventory = useCallback(() => {
    try {
        const storedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);
        if (storedInventory) {
            setInventory(JSON.parse(storedInventory));
        } else {
            setInventory(initialInventoryData);
            localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(initialInventoryData));
        }
    } catch (error) {
        console.error("Failed to load inventory", error);
        setInventory(initialInventoryData);
    }
  }, []);

  const saveInventory = useCallback((updatedInventory: InventoryItem[]) => {
      setInventory(updatedInventory);
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(updatedInventory));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadInventory();
    setIsLoading(false);
  }, [loadInventory]);

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      ...itemData
    };
    saveInventory([...inventory, newItem]);
    toast({
        title: "Item Added",
        description: `Item "${newItem.name}" has been added to inventory.`,
    });
  };

  const updateInventoryItem = (id: string, data: Omit<InventoryItem, 'id'>) => {
    const updatedInventory = inventory.map(item => 
        item.id === id ? { id, ...data } : item
    );
    saveInventory(updatedInventory);
     toast({
        title: "Item Updated",
        description: `Item "${data.name}" has been updated.`,
    });
  };

  const deleteInventoryItem = (id: string) => {
    const itemToDelete = inventory.find(item => item.id === id);
    const updatedInventory = inventory.filter(item => item.id !== id);
    saveInventory(updatedInventory);
     toast({
        title: "Item Deleted",
        description: `Item "${itemToDelete?.name}" has been deleted.`,
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
