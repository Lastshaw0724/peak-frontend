'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usarAutenticacion } from '@/hooks/usar-autenticacion';
import type { RolUsuario } from '@/lib/tipos';
import { Skeleton } from '@/components/ui/skeleton';

interface RutaProtegidaProps {
  children: React.ReactNode;
  allowedRoles: RolUsuario[];
}

export function RutaProtegida({ children, allowedRoles }: RutaProtegidaProps) {
  const { user, isLoading } = usarAutenticacion();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/ingresar');
      } else if (!allowedRoles.includes(user.role)) {
        // Redirect to their default page or a generic 'access-denied' page
        router.replace('/'); 
      }
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading || !user || !allowedRoles.includes(user.role)) {
    return (
        <div className="flex items-center justify-center min-h-screen">
             <Skeleton className="w-full h-screen" />
        </div>
    );
  }

  return <>{children}</>;
}
