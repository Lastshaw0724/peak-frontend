'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, Package, History, Settings, Warehouse, Percent } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Logo } from '../logo';

const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

const navItems = [
    { href: '/dashboard/employees', label: 'Empleados', icon: Users },
    { href: '/dashboard/products', label: 'Productos', icon: Package },
    { href: '/dashboard/orders', label: 'Historial Pedidos', icon: History },
    { href: '/dashboard/preferences', label: 'Preferencias', icon: Settings },
    { href: '/dashboard/inventory', label: 'Inventario', icon: Warehouse },
    { href: '/dashboard/discounts', label: 'Descuentos', icon: Percent },
];

export function NavContent() {
    const pathname = usePathname();
    const { user } = useAuth();
    
    if(!user) return null;

    return (
        <div className="flex flex-col h-full bg-card text-card-foreground">
            <div className="p-6 flex flex-col items-center gap-4 border-b">
                 <Link href="/">
                    <Logo className="w-36 h-auto mb-4" />
                </Link>
                <Avatar className="h-24 w-24">
                    <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.name}`} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{user.name}</h2>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
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
