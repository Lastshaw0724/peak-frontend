
'use client';

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (name: string, email: string, password: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  deleteUser: (userId: string) => void;
  addUser: (data: { name: string; email: string; password: string; role: UserRole }) => void;
  updateUserPassword: (userId: string, newPassword: string) => void;
  isLoading: boolean;
  refreshUsers: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleRedirects: Record<UserRole, string> = {
  admin: '/dashboard',
  waiter: '/waiter',
  cook: '/kitchen',
  customer: '/menu',
  cashier: '/dashboard/orders',
};

const USER_SESSION_KEY = 'gustogo-user-session';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const refreshUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load user data.' });
    }
  }, [toast]);
  

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        await refreshUsers();
        const storedUser = sessionStorage.getItem(USER_SESSION_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to initialize auth state', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, [refreshUsers]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const foundUser = await response.json();
      setUser(foundUser);
      sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(foundUser));
      router.push(roleRedirects[foundUser.role]);
      toast({ title: 'Login Successful', description: `Welcome back, ${foundUser.name}!` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid email or password.' });
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(USER_SESSION_KEY);
    router.push('/login');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  };

  const register = async (name: string, email: string, password: string) => {
    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role: 'customer' }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }
        
        await refreshUsers();
        router.push('/login');
        toast({ title: 'Registration Successful', description: `Welcome! You can now log in.` });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({ variant: 'destructive', title: 'Registration Failed', description: message });
    }
  };

  const addUser = async (data: { name: string; email: string; password: string; role: UserRole }) => {
     try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add user');
        }

        await refreshUsers();
        toast({ title: 'User Created', description: `User ${data.name} has been created.` });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({ variant: 'destructive', title: 'Creation Failed', description: message });
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) throw new Error('Failed to update role');

      await refreshUsers();

      if (user && user.id === userId) {
        const updatedUser = { ...user, role: newRole };
        setUser(updatedUser);
        sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedUser));
      }
      toast({ title: 'Role Updated', description: "The user's role has been updated." });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update user role.' });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete user');

        await refreshUsers();
        toast({ title: 'User Deleted', description: 'The user has been successfully removed.' });

    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not delete user.' });
    }
  };

  const updateUserPassword = async (userId: string, newPassword: string) => {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: newPassword }),
        });
        if (!response.ok) throw new Error('Failed to update password');
        
        // No need to refresh all users here, just give feedback
        toast({ title: 'Password Updated', description: "The user's password has been changed." });

    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update password.' });
    }
  };

  const contextValue = {
    user,
    users,
    login,
    logout,
    register,
    addUser,
    updateUserRole,
    deleteUser,
    updateUserPassword,
    isLoading,
    refreshUsers
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Skeleton className="w-full h-screen" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
