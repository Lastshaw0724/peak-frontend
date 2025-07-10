
import { NextResponse } from 'next/server';
import { mockUsers } from '@/lib/user-data';
import type { User } from '@/lib/types';

// In a real application, you would connect to a database.
// For now, we'll use a mutable in-memory array to simulate a user database.
let users: User[] = [...mockUsers];

export async function GET() {
    // In a real app, you'd never send passwords to the client.
    const safeUsers = users.map(({ password, ...user }) => user);
    return NextResponse.json(safeUsers);
}

// For user login
export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const foundUser = users.find((u) => u.email === email && u.password === password);

        if (foundUser) {
            const { password, ...userToReturn } = foundUser;
            return NextResponse.json(userToReturn);
        } else {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
    }
}
