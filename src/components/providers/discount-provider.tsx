"use client";

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Discount } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { initialDiscountsData } from '@/lib/discount-data';

interface DiscountContextType {
  discounts: Discount[];
  addDiscount: (discount: Omit<Discount, 'id' | 'status' | 'used'>) => void;
  updateDiscountStatus: (id: string, status: boolean) => void;
  deleteDiscount: (id: string) => void;
  isLoading: boolean;
}

export const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

export const DiscountProvider = ({ children }: { children: ReactNode }) => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    setDiscounts(initialDiscountsData);
    setIsLoading(false);
  }, []);

  const addDiscount = (discountData: Omit<Discount, 'id' | 'status' | 'used'>) => {
    const newDiscount: Discount = {
        ...discountData,
        id: `dsc-${Date.now()}`,
        status: true,
        used: 0,
    };
    setDiscounts([...discounts, newDiscount]);
    toast({
        title: "Descuento Creado",
        description: `El descuento "${newDiscount.name}" ha sido añadido.`
    });
  };

  const updateDiscountStatus = (id: string, status: boolean) => {
    const updatedDiscounts = discounts.map(d => d.id === id ? { ...d, status } : d);
    setDiscounts(updatedDiscounts);
  };
  
  const deleteDiscount = (id: string) => {
    const updatedDiscounts = discounts.filter(d => d.id !== id);
    setDiscounts(updatedDiscounts);
    toast({
        title: "Descuento Eliminado",
        description: "El descuento ha sido eliminado correctamente.",
        variant: "destructive",
    });
  };

  const contextValue = {
    discounts,
    addDiscount,
    updateDiscountStatus,
    deleteDiscount,
    isLoading
  };

  return (
    <DiscountContext.Provider value={contextValue}>
      {children}
    </DiscountContext.Provider>
  );
};
