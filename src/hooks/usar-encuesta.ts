"use client";

import { useContext } from 'react';
import { SurveyContext } from '@/components/proveedores/proveedor-encuestas';

export const usarEncuesta = () => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('usarEncuesta must be used within a SurveyProvider');
  }
  return context;
};
