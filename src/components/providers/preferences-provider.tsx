
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
  savePreferences: (newPrefs: Preferences) => void;
}

interface PreferencesContextType extends Preferences, SetterFunctions {
  isLoading: boolean;
}

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const PREFERENCES_STORAGE_KEY = 'gustogo-preferences';

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

  const loadPreferences = useCallback(() => {
    try {
        const storedPrefs = localStorage.getItem(PREFERENCES_STORAGE_KEY);
        if (storedPrefs) {
            // Merge stored prefs with defaults to prevent missing keys if the structure changes
            setPreferences({ ...defaultPreferences, ...JSON.parse(storedPrefs) });
        } else {
            setPreferences(defaultPreferences);
            localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(defaultPreferences));
        }
    } catch(error) {
        console.error("Failed to load preferences", error);
        setPreferences(defaultPreferences);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadPreferences();
    setIsLoading(false);
  }, [loadPreferences]);
  
  useEffect(() => {
    if (!isLoading) {
      document.documentElement.classList.toggle('dark', preferences.darkMode);
    }
  }, [preferences.darkMode, isLoading]);

  const savePreferences = (newPrefs: Preferences) => {
    setPreferences(newPrefs);
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(newPrefs));
    toast({ title: "Preferences Saved", description: "Your changes have been saved successfully." });
  };
  
  const createSetter = <K extends keyof Preferences>(key: K) => (value: Preferences[K]) => {
    const newPrefs = { ...preferences, [key]: value };
    savePreferences(newPrefs);
  };
  
  const value: PreferencesContextType = {
    ...preferences,
    isLoading,
    setLowStockThreshold: createSetter('lowStockThreshold'),
    setDarkMode: createSetter('darkMode'),
    setPublicMenu: createSetter('publicMenu'),
    setRestaurantName: createSetter('restaurantName'),
    setWebsiteUrl: createSetter('websiteUrl'),
    setAddress: createSetter('address'),
    setPhone: createSetter('phone'),
    setTaxRate: createSetter('taxRate'),
    setTaxIncluded: createSetter('taxIncluded'),
    savePreferences,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};
