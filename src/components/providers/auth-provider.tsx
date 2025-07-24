
'use client';

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { mockUsers } from '@/lib/user-data';

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
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleRedirects: Record<UserRole, string> = {
  admin: '/dashboard',
  waiter: '/mesero',
  cook: '/cocina',
  customer: '/menu',
  cashier: '/dashboard/pedidos',
};

const USER_SESSION_KEY = 'gustogo-user-session';
const ALL_USERS_KEY = 'gustogo-all-users';


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const loadUsers = useCallback(() => {
    try {
        const storedUsers = localStorage.getItem(ALL_USERS_KEY);
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        } else {
            setUsers(mockUsers);
            localStorage.setItem(ALL_USERS_KEY, JSON.stringify(mockUsers));
        }
    } catch (error) {
        console.error("Failed to load users from local storage", error);
        setUsers(mockUsers);
    }
  }, []);

  const saveUsers = useCallback((updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(updatedUsers));
  }, []);
  

  useEffect(() => {
    setIsLoading(true);
    loadUsers();
    try {
        const storedUser = sessionStorage.getItem(USER_SESSION_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Failed to load user session from session storage", error);
    }
    setIsLoading(false);
  }, [loadUsers]);

  const login = (email: string, password: string) => {
    const foundUser = users.find((u) => u.email === email && u.password === password);
    if (foundUser) {
        setUser(foundUser);
        sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(foundUser));
        router.push(roleRedirects[foundUser.role]);
        toast({ title: 'Login Successful', description: `Welcome back, ${foundUser.name}!` });
    } else {
        toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid email or password.' });
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(USER_SESSION_KEY);
    router.push('/ingresar');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  };

  const register = (name: string, email: string, password: string) => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        toast({ variant: 'destructive', title: 'Registration Failed', description: 'A user with this email already exists.' });
        return;
    }
    
    const newUser: User = { 
        id: `user-${Date.now()}`, 
        name, 
        email, 
        password, 
        role: 'customer' 
    };
    
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    
    router.push('/ingresar');
    toast({ title: 'Registration Successful', description: `Welcome, ${name}! You can now log in.` });
  };

  const addUser = (data: { name: string; email: string; password: string; role: UserRole }) => {
    const existingUser = users.find(u => u.email === data.email);
    if (existingUser) {
        toast({ variant: 'destructive', title: 'Creation Failed', description: 'A user with this email already exists.' });
        return;
    }

    const newUser: User = {
        id: `user-${Date.now()}`,
        ...data
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    toast({ title: 'User Created', description: `User ${data.name} has been created.` });
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    const updatedUsers = users.map((u) => u.id === userId ? { ...u, role: newRole } : u);
    saveUsers(updatedUsers);

    if (user && user.id === userId) {
        const updatedUser = { ...user, role: newRole };
        setUser(updatedUser);
        sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedUser));
    }

    toast({ title: 'Role Updated', description: "The user's role has been updated." });
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter((u) => u.id !== userId);
    saveUsers(updatedUsers);
    toast({ title: 'User Deleted', description: 'The user has been successfully removed.' });
  };

  const updateUserPassword = (userId: string, newPassword: string) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, password: newPassword } : u);
    saveUsers(updatedUsers);
    toast({ title: 'Password Updated', description: "The user's password has been changed." });
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
    isLoading
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
