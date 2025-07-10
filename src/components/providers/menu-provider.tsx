
"use client";

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { MenuItem } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface MenuContextType {
  menu: MenuItem[];
  addProduct: (product: Omit<MenuItem, 'id'>) => Promise<void>;
  updateProduct: (id: string, productData: Omit<MenuItem, 'id'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshMenu: () => Promise<void>;
  isLoading: boolean;
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshMenu = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/menu');
      if (!response.ok) throw new Error('Failed to fetch menu');
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load menu data.' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    refreshMenu();
  }, [refreshMenu]);

  const addProduct = async (productData: Omit<MenuItem, 'id'>) => {
    try {
        const response = await fetch('/api/menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });
        if (!response.ok) throw new Error('Failed to add product');
        
        const newProduct = await response.json();
        setMenu(prev => [...prev, newProduct]);
        
        toast({
          title: "Producto Añadido!",
          description: `El producto "${newProduct.name}" ha sido añadido al menú.`,
        });

    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo añadir el producto.' });
    }
  };

  const updateProduct = async (id: string, productData: Omit<MenuItem, 'id'>) => {
    try {
        const response = await fetch(`/api/menu/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });
        if (!response.ok) throw new Error('Failed to update product');
        
        await refreshMenu();
        
        toast({
            title: "Producto Actualizado",
            description: `El producto "${productData.name}" ha sido actualizado.`,
        });

    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo actualizar el producto.' });
    }
  };

  const deleteProduct = async (id: string) => {
    const productToDelete = menu.find(item => item.id === id);
    if (!productToDelete) return;
    
    try {
        const response = await fetch(`/api/menu/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete product');

        await refreshMenu();

        toast({
            title: "Producto Eliminado",
            description: `El producto "${productToDelete.name}" ha sido eliminado.`,
            variant: "destructive",
        });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: `No se pudo eliminar el producto "${productToDelete.name}".` });
    }
  };
  
  const contextValue = { 
    menu, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    refreshMenu,
    isLoading
  };

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  );
};
