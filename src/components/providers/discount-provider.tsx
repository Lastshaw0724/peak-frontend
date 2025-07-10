
"use client";

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Discount } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface DiscountContextType {
  discounts: Discount[];
  addDiscount: (discount: Omit<Discount, 'id' | 'status' | 'used'>) => Promise<void>;
  updateDiscountStatus: (id: string, status: boolean) => Promise<void>;
  deleteDiscount: (id: string) => Promise<void>;
  refreshDiscounts: () => Promise<void>;
  isLoading: boolean;
}

export const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

export const DiscountProvider = ({ children }: { children: ReactNode }) => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshDiscounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/discounts');
      if (!response.ok) throw new Error('Failed to fetch discounts');
      const data = await response.json();
      setDiscounts(data);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load discounts.' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    refreshDiscounts();
  }, [refreshDiscounts]);

  const addDiscount = async (discountData: Omit<Discount, 'id' | 'status' | 'used'>) => {
    try {
      const response = await fetch('/api/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discountData),
      });
      if (!response.ok) throw new Error('Failed to create discount');
      
      const newDiscount = await response.json();
      setDiscounts(prev => [...prev, newDiscount]);
      
      toast({
        title: "Descuento Creado",
        description: `El descuento "${newDiscount.name}" ha sido añadido.`
      });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo crear el descuento.' });
    }
  };

  const updateDiscountStatus = async (id: string, status: boolean) => {
    // This functionality isn't built into a separate API route yet,
    // so we'll update locally for now. For a real app, you'd create a PUT/PATCH endpoint.
    setDiscounts(discounts.map(d => d.id === id ? { ...d, status } : d));
    // In a real app:
    // await fetch(`/api/discounts/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
  };
  
  const deleteDiscount = async (id: string) => {
    // This functionality isn't built into a separate API route yet,
    // so we'll update locally for now. For a real app, you'd create a DELETE endpoint.
    const originalDiscounts = [...discounts];
    setDiscounts(discounts.filter(d => d.id !== id));
    toast({
        title: "Descuento Eliminado",
        description: "El descuento ha sido eliminado correctamente.",
        variant: "destructive",
    });
    // In a real app:
    // try {
    //   const response = await fetch(`/api/discounts/${id}`, { method: 'DELETE' });
    //   if (!response.ok) throw new Error('Failed to delete');
    //   await refreshDiscounts();
    // } catch (error) {
    //   setDiscounts(originalDiscounts);
    //   toast({ variant: 'destructive', title: 'Error', description: 'Could not delete discount.' });
    // }
  };

  const contextValue = {
    discounts,
    addDiscount,
    updateDiscountStatus,
    deleteDiscount,
    refreshDiscounts,
    isLoading
  };

  return (
    <DiscountContext.Provider value={contextValue}>
      {children}
    </DiscountContext.Provider>
  );
};
