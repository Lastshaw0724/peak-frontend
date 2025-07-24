
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, Package, History, Settings, Warehouse, Percent, AreaChart } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Logo } from '../logo';
import type { UserRole } from '@/lib/types';
import { usePreferences } from '@/hooks/use-preferences';
import Image from 'next/image';

const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

const navItems: { href: string; label: string; icon: React.ElementType; roles: UserRole[] }[] = [
    { href: '/dashboard/empleados', label: 'Empleados', icon: Users, roles: ['admin'] },
    { href: '/dashboard/productos', label: 'Productos', icon: Package, roles: ['admin'] },
    { href: '/dashboard/pedidos', label: 'Historial Pedidos', icon: History, roles: ['admin', 'cashier'] },
    { href: '/dashboard/reportes', label: 'Reportes', icon: AreaChart, roles: ['admin'] },
    { href: '/dashboard/inventario', label: 'Inventario', icon: Warehouse, roles: ['admin'] },
    { href: '/dashboard/descuentos', label: 'Descuentos', icon: Percent, roles: ['admin'] },
    { href: '/dashboard/preferencias', label: 'Preferencias', icon: Settings, roles: ['admin'] },
];

export function NavContent() {
    const pathname = usePathname();
    const { user } = useAuth();
    const { logoUrl } = usePreferences();
    
    if(!user) return null;

    const visibleNavItems = navItems.filter(item => item.roles.includes(user.role));

    return (
        <div className="flex flex-col h-full bg-card text-card-foreground">
            <div className="p-6 flex flex-col items-center gap-4 border-b">
                 <Link href="/">
                    {logoUrl ? (
                        <Image src={logoUrl} alt="Restaurant Logo" width={144} height={56} className="object-contain h-14 w-auto" />
                    ) : (
                        <Logo className="w-36 h-auto mb-4" />
                    )}
                </Link>
                <Avatar className="h-24 w-24">
                    <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.name}`} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{user.name}</h2>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {visibleNavItems.map((item) => (
                    <Button
                        key={item.label}
                        asChild
                        variant={pathname.startsWith(item.href) ? 'default' : 'ghost'}
                        className="w-full justify-start text-base h-11"
                    >
                        <Link href={item.href}>
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </Link>
                    </Button>
                ))}
            </nav>
        </div>
    );
}

export function Sidebar() {
    return (
        <aside className="hidden md:block md:w-64 lg:w-72 border-r bg-card h-screen sticky top-0">
            <NavContent />
        </aside>
    );
}

    
