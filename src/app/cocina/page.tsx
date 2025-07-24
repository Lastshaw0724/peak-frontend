'use client';
import { PantallaCocina } from '@/components/cocina/pantalla-cocina';
import { CabeceraApp } from '@/components/cabecera';
import { RutaProtegida } from '@/components/autenticacion/ruta-protegida';

function PaginaCocinaContenido() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <CabeceraApp title="Pantalla de Cocina" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <PantallaCocina />
      </main>
    </div>
  );
}

export default function PaginaCocina() {
    return (
        <RutaProtegida allowedRoles={['cook', 'admin']}>
            <PaginaCocinaContenido />
        </RutaProtegida>
    )
}
