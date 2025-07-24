'use client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import { NavContent } from './sidebar';
import { useAuth } from '@/hooks/use-auth';

export function DashboardHeader() {
    const { user, logout } = useAuth();

    return (
        <header className="flex h-16 items-center justify-between md:justify-end gap-4 border-b bg-card px-4 md:px-6 sticky top-0 z-30">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Menú de navegación</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <NavContent />
                    </SheetContent>
                </Sheet>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">{user?.name}</span>
                 <Button variant="ghost" size="icon" onClick={logout} aria-label="Cerrar sesión">
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
}
