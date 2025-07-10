
import { NextResponse } from 'next/server';
import { initialMenuData } from '@/lib/menu-data';
import type { MenuItem, Extra } from '@/lib/types';

let menu: MenuItem[] = [...initialMenuData];

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const productData = await request.json();
        const dataFromForm = productData as Omit<MenuItem, 'id'> & { extras?: ({ id?: string, name: string, price: number })[] };
        
        const index = menu.findIndex(item => item.id === id);

        if (index !== -1) {
            const updatedProduct = { ...menu[index], ...dataFromForm };
            if (updatedProduct.extras) {
                updatedProduct.extras = updatedProduct.extras.map(extra => ({
                    ...extra,
                    id: extra.id || `extra-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                })) as Extra[];
            }
            menu[index] = updatedProduct;
            return NextResponse.json(updatedProduct);
        }
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    } catch (error) {
        return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const index = menu.findIndex(item => item.id === id);
    if (index !== -1) {
        const deletedProduct = menu.splice(index, 1);
        return NextResponse.json(deletedProduct[0]);
    }
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
}
