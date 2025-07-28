"use client";

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { MenuItem, Extra } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { initialMenuData } from '@/lib/menu-data';

interface MenuContextType {
  menu: MenuItem[];
  addProduct: (product: Omit<MenuItem, 'id'>) => void;
  updateProduct: (id: string, productData: Omit<MenuItem, 'id'>) => void;
  deleteProduct: (id: string) => void;
  isLoading: boolean;
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    setMenu(initialMenuData);
    setIsLoading(false);
  }, []);

  const addProduct = (productData: Omit<MenuItem, 'id'>) => {
    const dataFromForm = productData as Omit<MenuItem, 'id'> & { extras?: ({ name: string, price: number })[] };

    const newProduct: MenuItem = {
      ...dataFromForm,
      id: `prod-${Date.now()}`,
      dataAiHint: dataFromForm.dataAiHint || dataFromForm.name.toLowerCase().split(' ').slice(0, 2).join(' '),
      extras: dataFromForm.extras?.map(extra => ({
        ...extra,
        id: `extra-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      })),
    };

    setMenu([...menu, newProduct]);

    toast({
      title: "¡Producto Añadido!",
      description: `El producto "${newProduct.name}" ha sido añadido al menú.`,
    });
  };

  const updateProduct = (id: string, productData: Omit<MenuItem, 'id'>) => {
     const dataFromForm = productData as Omit<MenuItem, 'id'> & { extras?: ({ id?: string, name: string, price: number })[] };

     const updatedMenu = menu.map(item => {
      if (item.id === id) {
        const updatedProduct = { ...item, ...dataFromForm };
        if (updatedProduct.extras) {
            updatedProduct.extras = updatedProduct.extras.map(extra => ({
                ...extra,
                id: extra.id || `extra-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            })) as Extra[];
        }
        return updatedProduct;
      }
      return item;
    });
    
    setMenu(updatedMenu);
    
    toast({
        title: "Producto Actualizado",
        description: `El producto "${productData.name}" ha sido actualizado.`,
    });
  };

  const deleteProduct = (id: string) => {
    const productToDelete = menu.find(item => item.id === id);
    const updatedMenu = menu.filter(item => item.id !== id);
    setMenu(updatedMenu);
    
    toast({
        title: "Producto Eliminado",
        description: `El producto "${productToDelete?.name}" ha sido eliminado.`,
        variant: "destructive",
    });
  };
  
  const contextValue = { 
    menu, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    isLoading
  };

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  );
};
