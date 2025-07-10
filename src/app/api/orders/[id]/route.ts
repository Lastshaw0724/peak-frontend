
import { NextResponse } from 'next/server';
import type { Order } from '@/lib/types';

// In-memory store for submitted orders - in a real app, this would be a database
let submittedOrders: Order[] = [];

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const { status, preparationTime } = await request.json();
        const index = submittedOrders.findIndex(order => order.id === id);

        if (index !== -1) {
            const updatedOrder = { ...submittedOrders[index] };
            if (status) {
                updatedOrder.status = status;
            }
            if (preparationTime !== undefined) {
                updatedOrder.preparationTime = preparationTime;
            }
            submittedOrders[index] = updatedOrder;
            return NextResponse.json(updatedOrder);
        }
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating order' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const index = submittedOrders.findIndex(order => order.id === id);
    if (index !== -1) {
        const [deletedOrder] = submittedOrders.splice(index, 1);
        return NextResponse.json(deletedOrder);
    }
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
}

// Special route to handle loading an order for editing
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const orderToEdit = submittedOrders.find(o => o.id === id);

    if (orderToEdit) {
        submittedOrders = submittedOrders.filter(o => o.id !== id);
        return NextResponse.json(orderToEdit);
    }
    
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
}
