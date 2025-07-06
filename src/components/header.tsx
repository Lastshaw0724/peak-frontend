'use client';

import Link from 'next/link';
import { Logo } from './logo';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { LogOut, UserCircle, LayoutDashboard, Utensils, BookOpen, ChefHat, NotebookPen, QrCode, CircleDollarSign } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useRouter } from 'next/navigation';

export function AppHeader({ title }: { title: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const getInitials = (name: string) => {
    if(!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  const navigate = (path: string) => {
    router.push(path);
  }

  return (
    <header className="bg-card shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/">
              <Logo className="w-36 h-auto" />
            </Link>
          </div>
          <h1 className="hidden md:block text-3xl font-headline text-foreground">{title}</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                     <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.name}`} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {user.role === 'admin' && (
                         <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </DropdownMenuItem>
                    )}
                     {user.role === 'waiter' && (
                         <DropdownMenuItem onClick={() => navigate('/waiter')}>
                            <NotebookPen className="mr-2 h-4 w-4" />
                            <span>Waiter View</span>
                        </DropdownMenuItem>
                    )}
                    {user.role === 'cashier' && (
                         <DropdownMenuItem onClick={() => navigate('/waiter')}>
                            <CircleDollarSign className="mr-2 h-4 w-4" />
                            <span>Cashier View</span>
                        </DropdownMenuItem>
                    )}
                     {user.role === 'cook' && (
                         <DropdownMenuItem onClick={() => navigate('/kitchen')}>
                            <ChefHat className="mr-2 h-4 w-4" />
                            <span>Kitchen View</span>
                        </DropdownMenuItem>
                    )}
                    {(user.role === 'customer' || user.role === 'admin' || user.role === 'waiter') && (
                         <DropdownMenuItem onClick={() => navigate('/menu')}>
                            <BookOpen className="mr-2 h-4 w-4" />
                            <span>Customer Menu</span>
                        </DropdownMenuItem>
                    )}
                    {(user.role === 'admin' || user.role === 'waiter') && (
                         <DropdownMenuItem onClick={() => navigate('/qr')}>
                            <QrCode className="mr-2 h-4 w-4" />
                            <span>QR Code</span>
                        </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
