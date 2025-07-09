
'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';

// Interface for all managed preferences
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

// Context type includes all preferences and their individual setters
interface PreferencesContextType extends Preferences {
  setLowStockThreshold: (threshold: number) => void;
  setDarkMode: (enabled: boolean) => void;
  setPublicMenu: (enabled: boolean) => void;
  setRestaurantName: (name: string) => void;
  setWebsiteUrl: (url: string) => void;
  setAddress: (address: string) => void;
  setPhone: (phone: string) => void;
  setTaxRate: (rate: number) => void;
  setTaxIncluded: (enabled: boolean) => void;
  isLoading: boolean;
}

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const PREFERENCES_STORAGE_KEY = 'gustogo-preferences';

// Default values for a new setup
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

  // Load preferences from localStorage on component mount
  useEffect(() => {
    try {
      const storedPreferences = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (storedPreferences) {
        // Merge stored data with defaults to handle new/missing keys gracefully
        setPreferences({ ...defaultPreferences, ...JSON.parse(storedPreferences) });
      } else {
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(defaultPreferences));
      }
    } catch (error) {
      console.error("Failed to load preferences from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generic function to update a single preference and persist all changes
  const updatePreference = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    const updatedPrefs = { ...preferences, [key]: value };
    setPreferences(updatedPrefs);
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(updatedPrefs));
    } catch (error) {
      console.error("Failed to save preferences to localStorage", error);
    }
  };

  // Effect to toggle the 'dark' class on the <html> element
  useEffect(() => {
    if (!isLoading) {
      document.documentElement.classList.toggle('dark', preferences.darkMode);
    }
  }, [preferences.darkMode, isLoading]);

  const value: PreferencesContextType = {
    ...preferences,
    isLoading,
    setLowStockThreshold: (threshold: number) => updatePreference('lowStockThreshold', threshold),
    setDarkMode: (enabled: boolean) => updatePreference('darkMode', enabled),
    setPublicMenu: (enabled: boolean) => updatePreference('publicMenu', enabled),
    setRestaurantName: (name: string) => updatePreference('restaurantName', name),
    setWebsiteUrl: (url: string) => updatePreference('websiteUrl', url),
    setAddress: (address: string) => updatePreference('address', address),
    setPhone: (phone: string) => updatePreference('phone', phone),
    setTaxRate: (rate: number) => updatePreference('taxRate', rate),
    setTaxIncluded: (enabled: boolean) => updatePreference('taxIncluded', enabled),
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};
