
import { NextResponse } from 'next/server';
import { initialMenuData } from '@/lib/menu-data';
import type { MenuItem } from '@/lib/types';

let menu: MenuItem[] = [...initialMenuData];

export async function GET() {
  return NextResponse.json(menu);
}

export async function POST(request: Request) {
  try {
    const productData = await request.json();
    const dataFromForm = productData as Omit<MenuItem, 'id'> & { extras?: ({ name: string, price: number })[] };

    const newProduct: MenuItem = {
      ...dataFromForm,
      id: `prod-${Date.now()}`,
      dataAiHint: dataFromForm.dataAiHint || dataFromForm.name.toLowerCase().split(' ').slice(0, 2).join(' '),
      extras: dataFromForm.extras?.map(extra => ({
        ...extra,
        id: `extra-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      })),
    };

    menu.push(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating product' }, { status: 500 });
  }
}
