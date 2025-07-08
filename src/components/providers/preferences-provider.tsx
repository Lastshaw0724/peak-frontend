
'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface PreferencesContextType {
  lowStockThreshold: number;
  setLowStockThreshold: (threshold: number) => void;
}

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const PREFERENCES_STORAGE_KEY = 'gustogo-preferences';

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [lowStockThreshold, setLowStockThresholdState] = useState<number>(20); // Default value

  useEffect(() => {
    try {
      const storedPreferences = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (storedPreferences) {
        const parsed = JSON.parse(storedPreferences);
        setLowStockThresholdState(parsed.lowStockThreshold || 20);
      }
    } catch (error) {
      console.error("Failed to load preferences from localStorage", error);
    }
  }, []);

  const persistPreferences = (prefs: { lowStockThreshold: number }) => {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.error("Failed to save preferences to localStorage", error);
    }
  }

  const setLowStockThreshold = (threshold: number) => {
    if (threshold >= 0) {
        const newPrefs = { lowStockThreshold: threshold };
        setLowStockThresholdState(threshold);
        persistPreferences(newPrefs);
    }
  };

  return (
    <PreferencesContext.Provider value={{ lowStockThreshold, setLowStockThreshold }}>
      {children}
    </PreferencesContext.Provider>
  );
};
