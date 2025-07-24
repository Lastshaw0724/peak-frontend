"use client";

import { useContext } from 'react';
import { AuthContext } from '@/components/proveedores/proveedor-autenticacion';
import type { Usuario, RolUsuario } from '@/lib/tipos';

// This is the type that will be exposed by the hook
interface AuthHookType {
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


export const usarAutenticacion = (): AuthHookType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('usarAutenticacion must be used within an AuthProvider');
  }
  return context;
};
