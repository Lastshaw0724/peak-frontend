
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { QrCode, MapPin, History, LogOut, BookOpen } from 'lucide-react';
import { usarAutenticacion } from '@/hooks/usar-autenticacion';
import { cn } from '@/lib/utils';
import { usarPedidos } from '@/hooks/usar-pedidos';

const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

const navItems = [
    { href: '/qr', label: 'QR', icon: QrCode },
    { href: '/mesero/pos', label: 'Cartilla', icon: BookOpen },
    { href: '/mesero/asignar-mesa', label: 'Asignar Mesa', icon: MapPin },
    { href: '/mesero/pedidos-activos', label: 'Pedidos en Curso', icon: History },
];

export function ContenidoNavegacionMesero() {
    const pathname = usePathname();
    const { user, logout } = usarAutenticacion();
    const { submittedOrders } = usarPedidos();

    const hasReadyOrders = submittedOrders.some(order => order.status === 'ready');
    
    if(!user) return null;

    return (
        <div className="flex flex-col h-full bg-[#1C1C1C] text-white border-r border-zinc-700">
             <div className="p-6 flex flex-col items-center gap-4 border-b border-zinc-700">
                <Link href="/mesero/pos" className="flex flex-col items-center gap-4 text-center hover:opacity-90 transition-opacity">
                    <Avatar className="h-24 w-24 border-4 border-zinc-600">
                        <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.name}`} alt={user.name} />
                        <AvatarFallback className="bg-zinc-700 text-3xl font-bold">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-sm text-zinc-400 capitalize">{user.role}</p>
                </Link>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item, index) => (
                    <Button
                        key={`${item.label}-${index}`}
                        asChild
                        variant="ghost"
                        className={cn(
                            "w-full justify-start text-base h-12 font-semibold",
                            "hover:bg-zinc-800",
                            pathname.startsWith(item.href) ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-transparent text-zinc-300"
                        )}
                    >
                        <Link href={item.href}>
                            <item.icon className="mr-4 h-5 w-5" />
                            {item.label}
                            {item.label === 'Pedidos en Curso' && hasReadyOrders && (
                                <span className="ml-auto h-3 w-3 rounded-full bg-green-400 animate-pulse"></span>
                            )}
                        </Link>
                    </Button>
                ))}
            </nav>
            <div className="p-4 mt-auto border-t border-zinc-700 md:hidden">
                 <Button onClick={logout} variant="ghost" className="w-full justify-start gap-2 hover:bg-zinc-800 text-base h-12 text-zinc-300">
                    <LogOut />
                    Cerrar Sesión
                 </Button>
            </div>
        </div>
    );
}

export function BarraLateralMesero() {
    return (
        <aside className="hidden md:block md:w-72 bg-[#1C1C1C] h-screen sticky top-0">
            <ContenidoNavegacionMesero />
        </aside>
    );
}
