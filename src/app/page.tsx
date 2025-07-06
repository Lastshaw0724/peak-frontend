'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

const roleRedirects = {
  admin: '/dashboard',
  waiter: '/waiter',
  cook: '/kitchen',
  customer: '/menu',
};

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace(roleRedirects[user.role] || '/login');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
       <Skeleton className="w-full h-screen" />
    </div>
  );
}
