
"use client";

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Descuento } from '@/lib/tipos';
import { useToast } from "@/hooks/use-toast";
import { datosInicialesDescuentos } from '@/lib/datos-descuentos';

interface DiscountContextType {
  discounts: Descuento[];
  addDiscount: (discount: Omit<Descuento, 'id' | 'status' | 'used'>) => void;
  updateDiscountStatus: (id: string, status: boolean) => void;
  deleteDiscount: (id: string) => void;
  isLoading: boolean;
}

export const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

const DISCOUNTS_STORAGE_KEY = 'gustogo-discounts';

export const ProveedorDescuentos = ({ children }: { children: ReactNode }) => {
  const [discounts, setDiscounts] = useState<Descuento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadDiscounts = useCallback(() => {
    try {
        const storedDiscounts = localStorage.getItem(DISCOUNTS_STORAGE_KEY);
        if (storedDiscounts) {
            setDiscounts(JSON.parse(storedDiscounts));
        } else {
            setDiscounts(datosInicialesDescuentos);
            localStorage.setItem(DISCOUNTS_STORAGE_KEY, JSON.stringify(datosInicialesDescuentos));
        }
    } catch(error) {
        console.error("Failed to load discounts", error);
        setDiscounts(datosInicialesDescuentos);
    }
  }, []);

  const saveDiscounts = useCallback((updatedDiscounts: Descuento[]) => {
      setDiscounts(updatedDiscounts);
      localStorage.setItem(DISCOUNTS_STORAGE_KEY, JSON.stringify(updatedDiscounts));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadDiscounts();
    setIsLoading(false);
  }, [loadDiscounts]);

  const addDiscount = (discountData: Omit<Descuento, 'id' | 'status' | 'used'>) => {
    const newDiscount: Descuento = {
        ...discountData,
        id: `dsc-${Date.now()}`,
        status: true,
        used: 0,
    };
    saveDiscounts([...discounts, newDiscount]);
    toast({
        title: "Descuento Creado",
        description: `El descuento "${newDiscount.name}" ha sido añadido.`
    });
  };

  const updateDiscountStatus = (id: string, status: boolean) => {
    const updatedDiscounts = discounts.map(d => d.id === id ? { ...d, status } : d);
    saveDiscounts(updatedDiscounts);
  };
  
  const deleteDiscount = (id: string) => {
    const updatedDiscounts = discounts.filter(d => d.id !== id);
    saveDiscounts(updatedDiscounts);
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
