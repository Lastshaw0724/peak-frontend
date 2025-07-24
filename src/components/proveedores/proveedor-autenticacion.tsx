
'use client';

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Usuario, RolUsuario } from '@/lib/tipos';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { usuariosMock } from '@/lib/datos-usuario';

interface AuthContextType {
  user: Usuario | null;
  users: Usuario[];
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (name: string, email: string, password: string) => void;
  updateUserRole: (userId: string, newRole: RolUsuario) => void;
  deleteUser: (userId: string) => void;
  addUser: (data: { name: string; email: string; password: string; role: RolUsuario }) => void;
  updateUserPassword: (userId: string, newPassword: string) => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleRedirects: Record<RolUsuario, string> = {
  admin: '/dashboard',
  waiter: '/mesero',
  cook: '/cocina',
  customer: '/menu',
  cashier: '/dashboard/pedidos',
};

const USER_SESSION_KEY = 'gustogo-user-session';
const ALL_USERS_KEY = 'gustogo-all-users';


export const ProveedorAutenticacion = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [users, setUsers] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const loadUsers = useCallback(() => {
    try {
        const storedUsers = localStorage.getItem(ALL_USERS_KEY);
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        } else {
            setUsers(usuariosMock);
            localStorage.setItem(ALL_USERS_KEY, JSON.stringify(usuariosMock));
        }
    } catch (error) {
        console.error("Failed to load users from local storage", error);
        setUsers(usuariosMock);
    }
  }, []);

  const saveUsers = useCallback((updatedUsers: Usuario[]) => {
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
        toast({ title: 'Inicio de Sesión Exitoso', description: `¡Bienvenido de vuelta, ${foundUser.name}!` });
    } else {
        toast({ variant: 'destructive', title: 'Fallo en el Inicio de Sesión', description: 'Email o contraseña inválidos.' });
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(USER_SESSION_KEY);
    router.push('/ingresar');
    toast({ title: 'Sesión Cerrada', description: 'Has cerrado sesión exitosamente.' });
  };

  const register = (name: string, email: string, password: string) => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        toast({ variant: 'destructive', title: 'Fallo en el Registro', description: 'Ya existe un usuario con este email.' });
        return;
    }
    
    const newUser: Usuario = { 
        id: `user-${Date.now()}`, 
        name, 
        email, 
        password, 
        role: 'customer' 
    };
    
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    
    router.push('/ingresar');
    toast({ title: 'Registro Exitoso', description: `¡Bienvenido, ${name}! Ahora puedes iniciar sesión.` });
  };

  const addUser = (data: { name: string; email: string; password: string; role: RolUsuario }) => {
    const existingUser = users.find(u => u.email === data.email);
    if (existingUser) {
        toast({ variant: 'destructive', title: 'Fallo en la Creación', description: 'Ya existe un usuario con este email.' });
        return;
    }

    const newUser: Usuario = {
        id: `user-${Date.now()}`,
        ...data
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    toast({ title: 'Usuario Creado', description: `El usuario ${data.name} ha sido creado.` });
  };

  const updateUserRole = (userId: string, newRole: RolUsuario) => {
    const updatedUsers = users.map((u) => u.id === userId ? { ...u, role: newRole } : u);
    saveUsers(updatedUsers);

    if (user && user.id === userId) {
        const updatedUser = { ...user, role: newRole };
        setUser(updatedUser);
        sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedUser));
    }

    toast({ title: 'Rol Actualizado', description: "El rol del usuario ha sido actualizado." });
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter((u) => u.id !== userId);
    saveUsers(updatedUsers);
    toast({ title: 'Usuario Eliminado', description: 'El usuario ha sido eliminado exitosamente.' });
  };

  const updateUserPassword = (userId: string, newPassword: string) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, password: newPassword } : u);
    saveUsers(updatedUsers);
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
