
import { NextResponse } from 'next/server';
import { initialInventoryData } from '@/lib/inventory-data';
import type { InventoryItem } from '@/lib/types';

let inventory: InventoryItem[] = [...initialInventoryData];

export async function GET() {
  return NextResponse.json(inventory);
}

export async function POST(request: Request) {
  try {
    const itemData = await request.json();
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
    };
    inventory.push(newItem);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding inventory item' }, { status: 500 });
  }
}
