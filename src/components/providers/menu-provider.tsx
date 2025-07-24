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

const MENU_STORAGE_KEY = 'gustogo-menu';

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadMenu = useCallback(() => {
    try {
        const storedMenu = localStorage.getItem(MENU_STORAGE_KEY);
        if (storedMenu) {
            setMenu(JSON.parse(storedMenu));
        } else {
            setMenu(initialMenuData);
            localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(initialMenuData));
        }
    } catch (error) {
        console.error("Failed to load menu", error);
        setMenu(initialMenuData);
    }
  }, []);

  const saveMenu = useCallback((updatedMenu: MenuItem[]) => {
      setMenu(updatedMenu);
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updatedMenu));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadMenu();
    setIsLoading(false);
  }, [loadMenu]);

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

    saveMenu([...menu, newProduct]);

    toast({
      title: "Product Added!",
      description: `Product "${newProduct.name}" has been added to the menu.`,
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
    
    saveMenu(updatedMenu);
    
    toast({
        title: "Product Updated",
        description: `Product "${productData.name}" has been updated.`,
    });
  };

  const deleteProduct = (id: string) => {
    const productToDelete = menu.find(item => item.id === id);
    const updatedMenu = menu.filter(item => item.id !== id);
    saveMenu(updatedMenu);
    
    toast({
        title: "Product Deleted",
        description: `Product "${productToDelete?.name}" has been deleted.`,
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
