
import { NextResponse } from 'next/server';
import type { Preferences } from '@/components/providers/preferences-provider';

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

// Simulate a single preferences object store
let preferences: Preferences = { ...defaultPreferences };

export async function GET() {
  return NextResponse.json(preferences);
}

export async function POST(request: Request) {
  try {
    const newPreferences = await request.json();
    preferences = { ...preferences, ...newPreferences };
    return NextResponse.json(preferences, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating preferences' }, { status: 500 });
  }
}
