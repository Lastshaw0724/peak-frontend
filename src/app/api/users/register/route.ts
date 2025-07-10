
import { NextResponse } from 'next/server';
import { mockUsers } from '@/lib/user-data';
import type { User } from '@/lib/types';

// In a real application, this would be a shared database instance
let users: User[] = [...mockUsers];

// Separate route for creating a new user (customer registration or admin adding employee)
export async function POST(request: Request) {
  try {
    const { name, email, password, role = 'customer' } = await request.json();

    if (users.some((u) => u.email === email)) {
      return NextResponse.json({ message: 'A user with this email already exists.' }, { status: 409 });
    }

    const newUser: User = { 
        id: `user-${Date.now()}`, 
        name, 
        email, 
        password, 
        role 
    };

    users.push(newUser);

    const { password: _, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}
