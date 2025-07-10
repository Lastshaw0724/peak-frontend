
import { NextResponse } from 'next/server';
import type { Order } from '@/lib/types';

// In-memory store for submitted orders
let submittedOrders: Order[] = [];

export async function GET() {
  const sortedOrders = submittedOrders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return NextResponse.json(sortedOrders);
}

export async function POST(request: Request) {
  try {
    const newOrder = await request.json();
    
    const orderWithDate: Order = {
        ...newOrder,
        id: `ORD-${Date.now()}`,
        timestamp: new Date(),
    };
    
    submittedOrders.unshift(orderWithDate); // Add to the beginning of the array

    return NextResponse.json(orderWithDate, { status: 201 });
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message: 'Error submitting order', error: message }, { status: 500 });
  }
}
