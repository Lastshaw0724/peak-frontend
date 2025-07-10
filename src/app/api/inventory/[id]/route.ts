
import { NextResponse } from 'next/server';
import { initialInventoryData } from '@/lib/inventory-data'; // This should be a shared, mutable store in a real app
import type { InventoryItem } from '@/lib/types';

// This is a placeholder for a real data store.
let inventory: InventoryItem[] = [...initialInventoryData];

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const data = await request.json();
        const index = inventory.findIndex(item => item.id === id);
        if (index !== -1) {
            inventory[index] = { id, ...data };
            return NextResponse.json(inventory[index]);
        }
        return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating item' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const index = inventory.findIndex(item => item.id === id);
    if (index !== -1) {
        const deletedItem = inventory.splice(index, 1);
        return NextResponse.json(deletedItem[0]);
    }
    return NextResponse.json({ message: 'Item not found' }, { status: 404 });
}
