'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CabeceraApp } from '@/components/cabecera';
import { Button } from '@/components/ui/button';
import { RutaProtegida } from '@/components/autenticacion/ruta-protegida';
import { ArrowLeft } from 'lucide-react';


function ContenidoPaginaCodigoQR() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <CabeceraApp title="Código QR del Menú" />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-4xl">Escanea para Ver Nuestro Menú</CardTitle>
            <CardDescription className="text-lg">
              Apunta la cámara de tu teléfono al código de abajo.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="p-4 bg-white rounded-lg border">
                <Image
                    src="https://placehold.co/300x300.png"
                    alt="Código QR del menú"
                    width={300}
                    height={300}
                    data-ai-hint="qr code"
                    priority
                />
            </div>
            <Button asChild className="w-full max-w-xs mt-2">
                <Link href="/mesero">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Regresar a la Interfaz
                </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function PaginaCodigoQR() {
    return (
        <RutaProtegida allowedRoles={['waiter', 'admin']}>
            <ContenidoPaginaCodigoQR />
        </RutaProtegida>
    );
}
