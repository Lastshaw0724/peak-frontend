
'use client';

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Preferences {
  lowStockThreshold: number;
  darkMode: boolean;
  publicMenu: boolean;
  restaurantName: string;
  websiteUrl: string;
  address: string;
  phone: string;
  taxRate: number;
  taxIncluded: boolean;
}

interface SetterFunctions {
  setLowStockThreshold: (threshold: number) => void;
  setDarkMode: (enabled: boolean) => void;
  setPublicMenu: (enabled: boolean) => void;
  setRestaurantName: (name: string) => void;
  setWebsiteUrl: (url: string) => void;
  setAddress: (address: string) => void;
  setPhone: (phone: string) => void;
  setTaxRate: (rate: number) => void;
  setTaxIncluded: (enabled: boolean) => void;
  savePreferences: (newPrefs: Preferences) => Promise<void>;
}

interface PreferencesContextType extends Preferences, SetterFunctions {
  isLoading: boolean;
}

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const defaultPreferences: Preferences = {
  lowStockThreshold: 20,
  darkMode: true,
  publicMenu: false,
  restaurantName: 'GustoGo',
  websiteUrl: 'https://example.com',
  address: '123 Calle Ficticia, Ciudad, País',
  phone: '+1 (555) 123-4567',
  taxRate: 7,
  taxIncluded: true,
};

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/preferences');
      if (!response.ok) throw new Error('Failed to fetch preferences');
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      console.error(error);
      setPreferences(defaultPreferences); // Fallback to default
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  useEffect(() => {
    if (!isLoading) {
      document.documentElement.classList.toggle('dark', preferences.darkMode);
    }
  }, [preferences.darkMode, isLoading]);

  const savePreferences = async (newPrefs: Preferences) => {
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrefs),
      });
      if (!response.ok) throw new Error('Failed to save preferences');
      const data = await response.json();
      setPreferences(data);
      toast({ title: "Preferences Saved", description: "Your changes have been saved successfully." });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save your preferences.' });
    }
  };

  // The individual setters are now gone, as the form will manage local state
  // and use savePreferences to commit all changes at once.
  // We provide dummy functions to avoid breaking the app structure immediately,
  // but they should be removed or refactored out.
  const value: PreferencesContextType = {
    ...preferences,
    isLoading,
    savePreferences,
    // The following setters are now effectively managed by the form state in the PreferencesPage
    // and the `savePreferences` function. They are provided for context completeness but aren't
    // the primary way to update state anymore.
    setLowStockThreshold: () => {},
    setDarkMode: () => {},
    setPublicMenu: () => {},
    setRestaurantName: () => {},
    setWebsiteUrl: () => {},
    setAddress: () => {},
    setPhone: () => {},
    setTaxRate: () => {},
    setTaxIncluded: () => {},
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};
