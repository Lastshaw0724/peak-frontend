'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardRedirectPage() {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            if (user.role === 'cashier') {
                router.replace('/dashboard/orders');
            } else { // default for admin
                router.replace('/dashboard/employees');
            }
        }
    }, [user, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
             <Skeleton className="w-full h-screen" />
        </div>
    );
}
