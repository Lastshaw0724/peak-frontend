'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { usePreferences } from '@/hooks/use-preferences';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { logoUrl } = usePreferences();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
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
          <CardTitle className="font-headline text-3xl">Bienvenido de Vuelta</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder a tu cuenta.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">Iniciar Sesión</Button>
            <div className="text-center text-sm text-muted-foreground">
              <p>
                ¿No tienes una cuenta?{' '}
                <Link href="/registro" className="underline hover:text-primary">
                  Regístrate
                </Link>
              </p>
               <p>
                <Link href="/recuperar-clave" className="underline hover:text-primary text-xs">
                  ¿Olvidaste tu contraseña?
                </Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
