'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { usarAutenticacion } from '@/hooks/usar-autenticacion';

export default function PaginaRedireccionPanel() {
    const router = useRouter();
    const { user } = usarAutenticacion();

    useEffect(() => {
        if (user) {
            if (user.role === 'cashier') {
                router.replace('/dashboard/pedidos');
            } else { // default for admin
                router.replace('/dashboard/empleados');
            }
        }
    }, [user, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
             <Skeleton className="w-full h-screen" />
        </div>
    );
}
