'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/user-data';
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
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleRedirects: Record<UserRole, string> = {
  admin: '/dashboard',
  waiter: '/waiter',
  cook: '/kitchen',
  customer: '/menu',
  cashier: '/dashboard/orders',
};

const USERS_STORAGE_KEY = 'gustogo-users';
const USER_SESSION_KEY = 'gustogo-user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate session and data loading from storage
    try {
      // Load all users from localStorage
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      let allUsers: User[];
      if (storedUsers) {
        allUsers = JSON.parse(storedUsers);
      } else {
        // If nothing in localStorage, initialize with mock data and save it
        allUsers = mockUsers;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mockUsers));
      }
      setUsers(allUsers);

      // Load the currently logged-in user from sessionStorage
      const storedUser = sessionStorage.getItem(USER_SESSION_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to initialize from storage', error);
      // Fallback to mock users if storage is corrupted
      setUsers(mockUsers);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mockUsers));
      sessionStorage.removeItem(USER_SESSION_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const persistUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  }

  const login = (email: string, password: string) => {
    // We use the 'users' state which is sourced from localStorage
    const foundUser = users.find((u) => u.email === email && u.password === password);
    if (foundUser) {
      const userToStore = { ...foundUser };
      delete userToStore.password; // Don't store password in session
      setUser(userToStore);
      sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(userToStore));
      router.push(roleRedirects[foundUser.role]);
      toast({ title: 'Login Successful', description: `Welcome back, ${foundUser.name}!` });
    } else {
      toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid email or password.' });
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(USER_SESSION_KEY);
    router.push('/login');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  };

  const register = (name: string, email: string, password: string) => {
    if (users.some((u) => u.email === email)) {
      toast({ variant: 'destructive', title: 'Registration Failed', description: 'A user with this email already exists.' });
      return;
    }
    const newUser: User = { id: `user-${Date.now()}`, name, email, password, role: 'customer' };
    const updatedUsers = [...users, newUser];
    persistUsers(updatedUsers);
    
    router.push('/login');
    toast({ title: 'Registration Successful', description: `Welcome! You can now log in to your account.` });
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
      const updatedUsers = users.map(u => (u.id === userId ? { ...u, role: newRole } : u))
      persistUsers(updatedUsers);

      // If the currently logged-in user is the one being updated, refresh their session data
      if (user && user.id === userId) {
        const updatedUserSessionData = updatedUsers.find(u => u.id === userId);
        if (updatedUserSessionData) {
            const userToStore = { ...updatedUserSessionData };
            delete userToStore.password;
            setUser(userToStore);
            sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(userToStore));
        }
      }
  };

  const deleteUser = (userId: string) => {
      const updatedUsers = users.filter(u => u.id !== userId);
      persistUsers(updatedUsers);
      toast({ title: 'Usuario Eliminado', description: 'El usuario ha sido eliminado correctamente.' });
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, register, updateUserRole, deleteUser, isLoading }}>
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
