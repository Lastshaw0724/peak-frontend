"use client";

import { useContext } from 'react';
import { AuthContext } from '@/components/providers/auth-provider';
import type { User, UserRole } from '@/lib/types';

// This is the type that will be exposed by the hook
interface AuthHookType {
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


export const useAuth = (): AuthHookType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
