'use client';

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

function hexToHsl(hex: string): string {
    if (!hex) return "0 0% 0%";
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return `${h} ${s}% ${l}%`;
}


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
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
}

interface SetterFunctions {
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
  address: '123 Main Street, Anytown, USA',
  phone: '+1 (555) 123-4567',
  taxRate: 7,
  taxIncluded: true,
  logoUrl: '',
  primaryColor: '#F97316', // Default: orange-500
  accentColor: '#FDE68A', // Default: amber-200
};

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const applyTheme = useCallback((prefs: Preferences) => {
    document.documentElement.classList.toggle('dark', prefs.darkMode);
    document.documentElement.style.setProperty('--primary', hexToHsl(prefs.primaryColor));
    document.documentElement.style.setProperty('--accent', hexToHsl(prefs.accentColor));
  }, []);

  const loadPreferences = useCallback(() => {
    try {
        const storedPrefs = localStorage.getItem(PREFERENCES_STORAGE_KEY);
        const loadedPrefs = storedPrefs ? { ...defaultPreferences, ...JSON.parse(storedPrefs) } : defaultPreferences;
        setPreferences(loadedPrefs);
        applyTheme(loadedPrefs);
    } catch(error) {
        console.error("Failed to load preferences", error);
        setPreferences(defaultPreferences);
        applyTheme(defaultPreferences);
    }
  }, [applyTheme]);

  useEffect(() => {
    setIsLoading(true);
    loadPreferences();
    setIsLoading(false);
  }, [loadPreferences]);

  const savePreferences = (newPrefs: Preferences) => {
    setPreferences(newPrefs);
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(newPrefs));
    applyTheme(newPrefs);
    toast({ title: "Preferences Saved", description: "Your changes have been saved successfully." });
  };
  
  const value: PreferencesContextType = {
    ...preferences,
    isLoading,
    savePreferences,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};
