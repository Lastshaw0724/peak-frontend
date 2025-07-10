
import { NextResponse } from 'next/server';
import type { Table, TableStatus } from '@/lib/types';

const initialTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
    id: `t${i + 1}`,
    name: `Mesa #${i + 1}`,
    status: 'available',
}));

// In-memory store
let tables: Table[] = [...initialTables];

export async function GET() {
  return NextResponse.json(tables);
}

// This is not a standard RESTful approach, but simplifies the client-side logic
// for this specific use case of updating a single table's status.
export async function POST(request: Request) {
  try {
    const { tableId, status } = await request.json();
    if (!tableId || !status) {
        return NextResponse.json({ message: 'tableId and status are required' }, { status: 400 });
    }

    const index = tables.findIndex(t => t.id === tableId);
    if (index !== -1) {
        tables[index].status = status;
        return NextResponse.json(tables[index]);
    }
    return NextResponse.json({ message: 'Table not found' }, { status: 404 });
  } catch(error) {
    return NextResponse.json({ message: 'Error updating table status' }, { status: 500 });
  }
}
