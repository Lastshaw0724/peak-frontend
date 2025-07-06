'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/user-data';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleRedirects: Record<UserRole, string> = {
  admin: '/dashboard',
  waiter: '/waiter',
  cook: '/kitchen',
  customer: '/menu',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate session loading
    try {
      const storedUser = sessionStorage.getItem('gustogo-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from sessionStorage', error);
      sessionStorage.removeItem('gustogo-user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email: string, password: string) => {
    const foundUser = users.find((u) => u.email === email && u.password === password);
    if (foundUser) {
      const userToStore = { ...foundUser };
      delete userToStore.password; // Don't store password in session
      setUser(userToStore);
      sessionStorage.setItem('gustogo-user', JSON.stringify(userToStore));
      router.push(roleRedirects[foundUser.role]);
      toast({ title: 'Login Successful', description: `Welcome back, ${foundUser.name}!` });
    } else {
      toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid email or password.' });
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('gustogo-user');
    router.push('/login');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  };

  const register = (name: string, email: string, password: string, role: UserRole) => {
    if (users.some((u) => u.email === email)) {
      toast({ variant: 'destructive', title: 'Registration Failed', description: 'A user with this email already exists.' });
      return;
    }
    const newUser: User = { id: String(users.length + 1), name, email, password, role };
    setUsers([...users, newUser]);
    
    // Log in the new user immediately
    const userToStore = { ...newUser };
    delete userToStore.password;
    setUser(userToStore);
    sessionStorage.setItem('gustogo-user', JSON.stringify(userToStore));
    router.push(roleRedirects[newUser.role]);
    toast({ title: 'Registration Successful', description: `Welcome, ${name}!` });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Skeleton className="w-64 h-32" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
