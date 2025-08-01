'use client';

import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { usePreferences } from '@/hooks/use-preferences';

export const Logo = ({ className }: { className?: string }) => {
  const { restaurantName } = usePreferences();
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
        <UtensilsCrossed className="w-1/3 h-1/3 text-primary" />
        <span className="font-headline text-4xl ml-2 text-foreground">{restaurantName}</span>
    </div>
  );
};
