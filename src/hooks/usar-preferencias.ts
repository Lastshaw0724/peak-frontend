
"use client";

import { useContext } from 'react';
import { PreferencesContext, Preferencias } from '@/components/proveedores/proveedor-preferencias';

interface PreferencesHook extends Preferencias {
  isLoading: boolean;
  savePreferences: (newPrefs: Preferencias) => void;
}

export const usarPreferencias = (): PreferencesHook => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usarPreferencias must be used within a PreferencesProvider');
  }
  
  const { 
    isLoading, 
    savePreferences,
    ...preferencesData
  } = context;

  return {
    ...preferencesData,
    isLoading,
    savePreferences,
  };
};
