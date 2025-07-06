'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardRedirectPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/dashboard/employees');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
             <Skeleton className="w-full h-screen" />
        </div>
    );
}
