"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { Discount } from '@/lib/types';
import { initialDiscountsData } from '@/lib/discount-data';
import { useToast } from "@/hooks/use-toast";

interface DiscountContextType {
  discounts: Discount[];
  addDiscount: (discount: Omit<Discount, 'id' | 'status' | 'used'>) => void;
  updateDiscountStatus: (id: string, status: boolean) => void;
  deleteDiscount: (id: string) => void;
}

export const DiscountContext = createContext<DiscountContextType | undefined>(undefined);
const DISCOUNTS_STORAGE_KEY = 'gustogo-discounts';

export const DiscountProvider = ({ children }: { children: ReactNode }) => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedDiscounts = localStorage.getItem(DISCOUNTS_STORAGE_KEY);
      if (storedDiscounts) {
        setDiscounts(JSON.parse(storedDiscounts));
      } else {
        setDiscounts(initialDiscountsData);
        localStorage.setItem(DISCOUNTS_STORAGE_KEY, JSON.stringify(initialDiscountsData));
      }
    } catch (error) {
      console.error("Failed to load discounts from localStorage", error);
      setDiscounts(initialDiscountsData);
    }
  }, []);

  const persistDiscounts = (updatedDiscounts: Discount[]) => {
      setDiscounts(updatedDiscounts);
      try {
        localStorage.setItem(DISCOUNTS_STORAGE_KEY, JSON.stringify(updatedDiscounts));
      } catch (error) {
        console.error("Failed to save discounts to localStorage", error);
      }
  }

  const addDiscount = (discountData: Omit<Discount, 'id' | 'status' | 'used'>) => {
    const newDiscount: Discount = {
      ...discountData,
      id: `dsc-${Date.now()}`,
      status: true,
      used: 0,
    };
    const updatedDiscounts = [...discounts, newDiscount];
    persistDiscounts(updatedDiscounts);
    toast({
      title: "Descuento Creado",
      description: `El descuento "${newDiscount.name}" ha sido añadido.`
    });
  };

  const updateDiscountStatus = (id: string, status: boolean) => {
      const updatedDiscounts = discounts.map(d => d.id === id ? { ...d, status } : d);
      persistDiscounts(updatedDiscounts);
  };
  
  const deleteDiscount = (id: string) => {
      const updatedDiscounts = discounts.filter(d => d.id !== id);
      persistDiscounts(updatedDiscounts);
      toast({
          title: "Descuento Eliminado",
          description: "El descuento ha sido eliminado correctamente.",
          variant: "destructive",
      });
  };

  return (
    <DiscountContext.Provider value={{ discounts, addDiscount, updateDiscountStatus, deleteDiscount }}>
      {children}
    </DiscountContext.Provider>
  );
};
