"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { MenuItem } from '@/lib/types';
import { initialMenuData } from '@/lib/menu-data';
import { useToast } from "@/hooks/use-toast";

interface MenuContextType {
  menu: MenuItem[];
  addProduct: (product: Omit<MenuItem, 'id'>) => void;
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined);
const MENU_STORAGE_KEY = 'gustogo-menu';

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedMenu = localStorage.getItem(MENU_STORAGE_KEY);
      if (storedMenu) {
        setMenu(JSON.parse(storedMenu));
      } else {
        setMenu(initialMenuData);
        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(initialMenuData));
      }
    } catch (error) {
      console.error("Failed to load menu from localStorage", error);
      setMenu(initialMenuData);
    }
  }, []);

  const persistMenu = (updatedMenu: MenuItem[]) => {
      setMenu(updatedMenu);
      try {
        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updatedMenu));
      } catch (error) {
        console.error("Failed to save menu to localStorage", error);
      }
  }

  const addProduct = (productData: Omit<MenuItem, 'id'>) => {
    const newProduct: MenuItem = {
      ...productData,
      id: `prod-${Date.now()}`,
      dataAiHint: productData.name.toLowerCase().split(' ').slice(0, 2).join(' '),
    };
    const updatedMenu = [...menu, newProduct];
    persistMenu(updatedMenu);
    toast({
      title: "Producto Añadido!",
      description: `El producto "${newProduct.name}" ha sido añadido al menú.`,
    });
  };

  return (
    <MenuContext.Provider value={{ menu, addProduct }}>
      {children}
    </MenuContext.Provider>
  );
};
