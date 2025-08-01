'use client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import { ContenidoNavegacion } from './barra-lateral';
import { usarAutenticacion } from '@/hooks/usar-autenticacion';

export function CabeceraPanel() {
    const { user, logout } = usarAutenticacion();

    return (
        <header className="flex h-16 items-center justify-between md:justify-end gap-4 border-b bg-card px-4 md:px-6 sticky top-0 z-30">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <ContenidoNavegacion />
                    </SheetContent>
                </Sheet>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">{user?.name}</span>
                 <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
}
