
"use client";

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { InventoryItem } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface InventoryContextType {
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  updateInventoryItem: (id: string, data: Omit<InventoryItem, 'id'>) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  refreshInventory: () => Promise<void>;
  isLoading: boolean;
}

export const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshInventory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load inventory data.' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    refreshInventory();
  }, [refreshInventory]);

  const addInventoryItem = async (itemData: Omit<InventoryItem, 'id'>) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      if (!response.ok) throw new Error('Failed to add item');
      
      const newItem = await response.json();
      setInventory(prev => [...prev, newItem]);
      
      toast({
        title: "Insumo Añadido",
        description: `El insumo "${newItem.name}" ha sido añadido al inventario.`,
      });
    } catch (error) {
       toast({ variant: 'destructive', title: 'Error', description: 'No se pudo añadir el insumo.' });
    }
  };

  const updateInventoryItem = async (id: string, data: Omit<InventoryItem, 'id'>) => {
    try {
        const response = await fetch(`/api/inventory/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update item');
        
        await refreshInventory(); // Refresh the whole list
        
        toast({
            title: "Insumo Actualizado",
            description: `El insumo "${data.name}" ha sido actualizado.`,
        });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo actualizar el insumo.' });
    }
  };

  const deleteInventoryItem = async (id: string) => {
    const itemToDelete = inventory.find(item => item.id === id);
    if (!itemToDelete) return;

    try {
        const response = await fetch(`/api/inventory/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete item');
        
        await refreshInventory(); // Refresh the list from the server

        toast({
            title: "Insumo Eliminado",
            description: `El insumo "${itemToDelete.name}" ha sido eliminado.`,
            variant: "destructive",
        });

    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: `No se pudo eliminar el insumo "${itemToDelete.name}".` });
    }
  };

  const contextValue = {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    refreshInventory,
    isLoading
  };

  return (
    <InventoryContext.Provider value={contextValue}>
      {children}
    </InventoryContext.Provider>
  );
};
