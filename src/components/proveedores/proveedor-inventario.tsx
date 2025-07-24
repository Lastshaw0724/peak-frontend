
"use client";

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { ArticuloInventario } from '@/lib/tipos';
import { useToast } from "@/hooks/use-toast";
import { datosInicialesInventario } from '@/lib/datos-inventario';

interface InventoryContextType {
  inventory: ArticuloInventario[];
  addInventoryItem: (item: Omit<ArticuloInventario, 'id'>) => void;
  updateInventoryItem: (id: string, data: Omit<ArticuloInventario, 'id'>) => void;
  deleteInventoryItem: (id: string) => void;
  isLoading: boolean;
}

export const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const INVENTORY_STORAGE_KEY = 'gustogo-inventory';

export const ProveedorInventario = ({ children }: { children: ReactNode }) => {
  const [inventory, setInventory] = useState<ArticuloInventario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadInventory = useCallback(() => {
    try {
        const storedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);
        if (storedInventory) {
            setInventory(JSON.parse(storedInventory));
        } else {
            setInventory(datosInicialesInventario);
            localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(datosInicialesInventario));
        }
    } catch (error) {
        console.error("Failed to load inventory", error);
        setInventory(datosInicialesInventario);
    }
  }, []);

  const saveInventory = useCallback((updatedInventory: ArticuloInventario[]) => {
      setInventory(updatedInventory);
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(updatedInventory));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadInventory();
    setIsLoading(false);
  }, [loadInventory]);

  const addInventoryItem = (itemData: Omit<ArticuloInventario, 'id'>) => {
    const newItem: ArticuloInventario = {
      id: `inv-${Date.now()}`,
      ...itemData
    };
    saveInventory([...inventory, newItem]);
    toast({
        title: "Insumo Añadido",
        description: `El insumo "${newItem.name}" ha sido añadido al inventario.`,
    });
  };

  const updateInventoryItem = (id: string, data: Omit<ArticuloInventario, 'id'>) => {
    const updatedInventory = inventory.map(item => 
        item.id === id ? { id, ...data } : item
    );
    saveInventory(updatedInventory);
     toast({
        title: "Insumo Actualizado",
        description: `El insumo "${data.name}" ha sido actualizado.`,
    });
  };

  const deleteInventoryItem = (id: string) => {
    const itemToDelete = inventory.find(item => item.id === id);
    const updatedInventory = inventory.filter(item => item.id !== id);
    saveInventory(updatedInventory);
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
