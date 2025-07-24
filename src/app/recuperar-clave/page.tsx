
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { usarPreferencias } from '@/hooks/usar-preferencias';
import Image from 'next/image';

export default function PaginaRecuperarClave() {
    const { toast } = useToast();
    const router = useRouter();
    const { logoUrl } = usarPreferencias();

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would trigger a password reset email flow.
        toast({
            title: "Email de Recuperación Enviado",
            description: "Si existe una cuenta con ese email, recibirás instrucciones para recuperar tu contraseña."
        });
        router.push('/ingresar');
    };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo del Restaurante" width={160} height={80} className="object-contain h-20 w-auto" />
            ) : (
              <Logo className="w-32 h-auto" />
            )}
          </div>
          <CardTitle className="font-headline text-3xl">¿Olvidaste tu Contraseña?</CardTitle>
          <CardDescription>Ingresa tu email para recibir un enlace de recuperación.</CardDescription>
        </CardHeader>
        <form onSubmit={handleReset}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">Enviar Enlace</Button>
            <div className="text-center text-sm text-muted-foreground">
              ¿Recordaste tu contraseña?{' '}
              <Link href="/ingresar" className="underline hover:text-primary">
                Iniciar sesión
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
