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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    setUsers(mockUsers);
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    const foundUser = users.find((u) => u.email === email && u.password === password);
    if (foundUser) {
        setUser(foundUser);
        router.push(roleRedirects[foundUser.role]);
        toast({ title: 'Inicio de Sesión Exitoso', description: `¡Bienvenido de vuelta, ${foundUser.name}!` });
    } else {
        toast({ variant: 'destructive', title: 'Fallo en el Inicio de Sesión', description: 'Email o contraseña inválidos.' });
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/ingresar');
    toast({ title: 'Sesión Cerrada', description: 'Has cerrado sesión exitosamente.' });
  };

  const register = (name: string, email: string, password: string) => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        toast({ variant: 'destructive', title: 'Fallo en el Registro', description: 'Ya existe un usuario con este email.' });
        return;
    }
    
    const newUser: User = { 
        id: `user-${Date.now()}`, 
        name, 
        email, 
        password, 
        role: 'customer' 
    };
    
    setUsers([...users, newUser]);
    
    router.push('/ingresar');
    toast({ title: 'Registro Exitoso', description: `¡Bienvenido, ${name}! Ahora puedes iniciar sesión.` });
  };

  const addUser = (data: { name: string; email: string; password: string; role: UserRole }) => {
    const existingUser = users.find(u => u.email === data.email);
    if (existingUser) {
        toast({ variant: 'destructive', title: 'Fallo en la Creación', description: 'Ya existe un usuario con este email.' });
        return;
    }

    const newUser: User = {
        id: `user-${Date.now()}`,
        ...data
    };

    setUsers([...users, newUser]);
    toast({ title: 'Usuario Creado', description: `El usuario ${data.name} ha sido creado.` });
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    const updatedUsers = users.map((u) => u.id === userId ? { ...u, role: newRole } : u);
    setUsers(updatedUsers);

    if (user && user.id === userId) {
        setUser({ ...user, role: newRole });
    }

    toast({ title: 'Rol Actualizado', description: "El rol del usuario ha sido actualizado." });
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter((u) => u.id !== userId);
    setUsers(updatedUsers);
    toast({ title: 'Usuario Eliminado', description: 'El usuario ha sido eliminado exitosamente.' });
  };

  const updateUserPassword = (userId: string, newPassword: string) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, password: newPassword } : u);
    setUsers(updatedUsers);
    toast({ title: 'Contraseña Actualizada', description: "La contraseña del usuario ha sido cambiada." });
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
