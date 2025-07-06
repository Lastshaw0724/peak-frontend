'use client';

import React, { createContext, useState, ReactNode } from 'react';
import type { Survey } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface SurveyContextType {
  surveys: Survey[];
  submitSurvey: (surveyData: Omit<Survey, 'id' | 'timestamp'>) => void;
}

export const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider = ({ children }: { children: ReactNode }) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const { toast } = useToast();

  const submitSurvey = (surveyData: Omit<Survey, 'id' | 'timestamp'>) => {
    const newSurvey: Survey = {
      ...surveyData,
      id: `SURVEY-${Date.now()}`,
      timestamp: new Date(),
    };
    setSurveys((prev) => [newSurvey, ...prev]);
    toast({
      title: "Survey Submitted!",
      description: "Thank you for your valuable feedback.",
    });
  };

  return (
    <SurveyContext.Provider value={{ surveys, submitSurvey }}>
      {children}
    </SurveyContext.Provider>
  );
};
