'use client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import { ContenidoNavegacionMesero } from './barra-lateral';
import { usarAutenticacion } from '@/hooks/usar-autenticacion';

export function CabeceraMesero() {
    const { user, logout } = usarAutenticacion();

    return (
        <header className="flex h-16 items-center justify-between md:justify-end gap-4 border-b border-zinc-700 bg-[#1C1C1C] px-4 md:px-6 sticky top-0 z-30">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-zinc-800">
                            <Menu className="h-6 w-6 text-white" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72 bg-[#1C1C1C] border-r-0">
                        <ContenidoNavegacionMesero />
                    </SheetContent>
                </Sheet>
            </div>
             <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-zinc-300 hidden sm:inline-block">{user?.name}</span>
                 <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout" className="hover:bg-zinc-800">
                    <LogOut className="h-5 w-5 text-zinc-300" />
                </Button>
            </div>
        </header>
    );
}
