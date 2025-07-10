
import { NextResponse } from 'next/server';
import { mockUsers } from '@/lib/user-data'; // This should be a shared, mutable store in a real app
import type { User, UserRole } from '@/lib/types';

let users: User[] = [...mockUsers];

// Update user details (role, password)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const { role, password } = await request.json();
        const index = users.findIndex(u => u.id === id);

        if (index !== -1) {
            if (role) {
                users[index].role = role as UserRole;
            }
            if (password) {
                users[index].password = password;
            }
            const { password: _, ...safeUser } = users[index];
            return NextResponse.json(safeUser);
        }
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
    }
}

// Delete a user
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        const deletedUser = users.splice(index, 1);
        const { password, ...safeUser } = deletedUser[0];
        return NextResponse.json(safeUser);
    }
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
}
