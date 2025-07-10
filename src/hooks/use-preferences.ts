
"use client";

import { useContext } from 'react';
import { PreferencesContext, Preferences } from '@/components/providers/preferences-provider';

interface PreferencesHook extends Preferences {
  isLoading: boolean;
  savePreferences: (newPrefs: Preferences) => Promise<void>;
}

export const usePreferences = (): PreferencesHook => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  
  // The individual setters are deprecated in favor of savePreferences.
  // We only expose the data, loading state, and the master save function.
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
