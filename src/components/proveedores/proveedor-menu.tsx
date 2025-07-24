
"use client";

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { ArticuloMenu, Extra } from '@/lib/tipos';
import { useToast } from "@/hooks/use-toast";
import { datosInicialesMenu } from '@/lib/datos-menu';

interface MenuContextType {
  menu: ArticuloMenu[];
  addProduct: (product: Omit<ArticuloMenu, 'id'>) => void;
  updateProduct: (id: string, productData: Omit<ArticuloMenu, 'id'>) => void;
  deleteProduct: (id: string) => void;
  isLoading: boolean;
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined);

const MENU_STORAGE_KEY = 'gustogo-menu';

export const ProveedorMenu = ({ children }: { children: ReactNode }) => {
  const [menu, setMenu] = useState<ArticuloMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadMenu = useCallback(() => {
    try {
        const storedMenu = localStorage.getItem(MENU_STORAGE_KEY);
        if (storedMenu) {
            setMenu(JSON.parse(storedMenu));
        } else {
            setMenu(datosInicialesMenu);
            localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(datosInicialesMenu));
        }
    } catch (error) {
        console.error("Failed to load menu", error);
        setMenu(datosInicialesMenu);
    }
  }, []);

  const saveMenu = useCallback((updatedMenu: ArticuloMenu[]) => {
      setMenu(updatedMenu);
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updatedMenu));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadMenu();
    setIsLoading(false);
  }, [loadMenu]);

  const addProduct = (productData: Omit<ArticuloMenu, 'id'>) => {
    const dataFromForm = productData as Omit<ArticuloMenu, 'id'> & { extras?: ({ name: string, price: number })[] };

    const newProduct: ArticuloMenu = {
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
      title: "Producto Añadido!",
      description: `El producto "${newProduct.name}" ha sido añadido al menú.`,
    });
  };

  const updateProduct = (id: string, productData: Omit<ArticuloMenu, 'id'>) => {
     const dataFromForm = productData as Omit<ArticuloMenu, 'id'> & { extras?: ({ id?: string, name: string, price: number })[] };

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
        title: "Producto Actualizado",
        description: `El producto "${productData.name}" ha sido actualizado.`,
    });
  };

  const deleteProduct = (id: string) => {
    const productToDelete = menu.find(item => item.id === id);
    const updatedMenu = menu.filter(item => item.id !== id);
    saveMenu(updatedMenu);
    
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
