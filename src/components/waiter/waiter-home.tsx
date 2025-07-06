'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

export function WaiterHome() {
    const { user } = useAuth();

    if (!user) return null;

    const navItems = [
        { href: '/qr', label: 'QR' },
        { href: '/waiter/pos', label: 'CARTILLA' },
        { href: '/waiter/pos', label: 'PEDIDOS' },
        { href: '/waiter/assign-table', label: 'ASIGNAR MESA' },
        { href: '/waiter/active-orders', label: 'PEDIDOS EN CURSO' },
    ];

    return (
        <div className="flex flex-col items-center justify-center text-center p-6 h-full">
            <Avatar className="h-28 w-28 mb-8 border-4 border-zinc-600 bg-zinc-700">
                <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.name}`} alt={user.name} />
                <AvatarFallback className="bg-transparent text-3xl font-bold">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="w-full max-w-xs space-y-3">
                {navItems.map((item, index) => (
                    <Button
                        key={index}
                        asChild
                        className={`w-full h-14 rounded-xl text-base font-bold uppercase tracking-wider
                            ${index === 0
                                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                            }
                        `}
                    >
                        <Link href={item.href}>{item.label}</Link>
                    </Button>
                ))}
            </div>
        </div>
    );
}
