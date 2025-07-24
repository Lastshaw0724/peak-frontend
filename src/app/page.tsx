'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usarAutenticacion } from '@/hooks/usar-autenticacion';
import { Skeleton } from '@/components/ui/skeleton';

const redireccionesPorRol = {
  admin: '/dashboard',
  waiter: '/mesero',
  cook: '/cocina',
  customer: '/menu',
  cashier: '/dashboard/pedidos',
};

export default function Inicio() {
  const router = useRouter();
  const { user, isLoading } = usarAutenticacion();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace(redireccionesPorRol[user.role] || '/ingresar');
      } else {
        router.replace('/ingresar');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
       <Skeleton className="w-full h-screen" />
    </div>
  );
}
