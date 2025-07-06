'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Menu } from 'lucide-react';

const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

export function WaiterDashboard() {
    const { user, logout } = useAuth();

    if (!user) return null;

    const navItems = [
        { href: '/qr', label: 'QR' },
        { href: '/waiter/pos', label: 'CARTILLA' },
        { href: '/waiter/pos', label: 'PEDIDOS' },
        { href: '/waiter/assign-table', label: 'ASIGNAR MESA' },
        { href: '/waiter/active-orders', label: 'PEDIDOS EN CURSO' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#1C1C1C] text-white p-6">
            <header className="flex items-start gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-zinc-800 hover:text-white">
                            <Menu className="h-8 w-8" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-[#1C1C1C] text-white border-r border-zinc-700 p-0 flex flex-col">
                         <div className="p-6 border-b border-zinc-700">
                            <h2 className="text-xl font-bold">Menú</h2>
                        </div>
                        <div className="flex-grow p-4">
                        </div>
                        <div className="p-4 mt-auto border-t border-zinc-700">
                             <Button onClick={logout} className="w-full justify-start gap-2 bg-transparent hover:bg-zinc-800 text-lg">
                                <LogOut />
                                Cerrar Sesión
                             </Button>
                        </div>
                    </SheetContent>
                </Sheet>
                <div className="text-left">
                    <h2 className="font-semibold text-lg">Nombre:</h2>
                    <p className="text-lg capitalize">{user.name}/{user.role}</p>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center text-center -mt-20">
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
            </main>
        </div>
    );
}
