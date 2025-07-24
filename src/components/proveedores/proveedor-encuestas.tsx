'use client';

import React, { createContext, useState, ReactNode } from 'react';
import type { Encuesta } from '@/lib/tipos';
import { useToast } from "@/hooks/use-toast";

interface SurveyContextType {
  surveys: Encuesta[];
  submitSurvey: (surveyData: Omit<Encuesta, 'id' | 'timestamp'>) => void;
}

export const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const ProveedorEncuestas = ({ children }: { children: ReactNode }) => {
  const [surveys, setSurveys] = useState<Encuesta[]>([]);
  const { toast } = useToast();

  const submitSurvey = (surveyData: Omit<Encuesta, 'id' | 'timestamp'>) => {
    const newSurvey: Encuesta = {
      ...surveyData,
      id: `SURVEY-${Date.now()}`,
      timestamp: new Date(),
    };
    setSurveys((prev) => [newSurvey, ...prev]);
    toast({
      title: "Encuesta Enviada!",
      description: "Gracias por tus valiosos comentarios.",
    });
  };

  return (
    <SurveyContext.Provider value={{ surveys, submitSurvey }}>
      {children}
    </SurveyContext.Provider>
  );
};
