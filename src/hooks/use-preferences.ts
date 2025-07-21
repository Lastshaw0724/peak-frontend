
"use client";

import { useContext } from 'react';
import { PreferencesContext, Preferences } from '@/components/providers/preferences-provider';

interface PreferencesHook extends Preferences {
  isLoading: boolean;
  savePreferences: (newPrefs: Preferences) => void;
}

export const usePreferences = (): PreferencesHook => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
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

    