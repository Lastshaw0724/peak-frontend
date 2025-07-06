'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function WaiterRedirectPage() {
    const router = useRouter();
    
    useEffect(() => {
        router.replace('/waiter/pos');
    }, [router]);

    return (
        <div className="flex items-center justify-center h-full w-full">
            <Skeleton className="w-full h-full" />
        </div>
    );
}
