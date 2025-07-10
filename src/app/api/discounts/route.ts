
import { NextResponse } from 'next/server';
import { initialDiscountsData } from '@/lib/discount-data';
import type { Discount } from '@/lib/types';

// In a real application, you would fetch this data from a database.
// For now, we'll simulate it with a mutable in-memory store.
let discounts: Discount[] = [...initialDiscountsData];

export async function GET() {
  return NextResponse.json(discounts);
}

export async function POST(request: Request) {
  try {
    const discountData = await request.json();
    const newDiscount: Discount = {
      ...discountData,
      id: `dsc-${Date.now()}`,
      status: true,
      used: 0,
    };
    discounts.push(newDiscount);
    return NextResponse.json(newDiscount, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating discount' }, { status: 500 });
  }
}
