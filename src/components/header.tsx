import Link from 'next/link';
import { Logo } from './logo';
import { Button } from './ui/button';
import { Home, NotebookPen, ChefHat, BookOpen, QrCode } from 'lucide-react';

export function AppHeader({ title }: { title: string }) {
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
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/" aria-label="Home"><Home /></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/waiter" aria-label="Waiter View"><NotebookPen /></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/kitchen" aria-label="Kitchen View"><ChefHat /></Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
