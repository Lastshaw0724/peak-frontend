
'use client';

import { RutaProtegida } from '@/components/autenticacion/ruta-protegida';
import { BarraLateralMesero } from '@/components/mesero/barra-lateral';
import { CabeceraMesero } from '@/components/mesero/cabecera';
import { usarEncuesta } from '@/hooks/usar-encuesta';
import { usarAutenticacion } from '@/hooks/usar-autenticacion';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';
import { ProveedorPedidos } from '@/components/proveedores/proveedor-pedidos';
import { ProveedorMesas } from '@/components/proveedores/proveedor-mesas';
import { ProveedorMenu } from '@/components/proveedores/proveedor-menu';
import { ProveedorEncuestas } from '@/components/proveedores/proveedor-encuestas';
import { ProveedorDescuentos } from '@/components/proveedores/proveedor-descuentos';

function ContenidoLayoutMesero({ children }: { children: React.ReactNode }) {
    const { user } = usarAutenticacion();
    const { surveys } = usarEncuesta();
    const { toast } = useToast();
    const notifiedSurveyIdsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!user || (user.role !== 'waiter' && user.role !== 'admin')) return;
        
        const relevantSurveys = user.role === 'admin' 
            ? surveys 
            : surveys.filter(s => s.waiterId === user.id);

        relevantSurveys.forEach(survey => {
        if (!notifiedSurveyIdsRef.current.has(survey.id)) {
            const title = user.role === 'admin'
                ? `Feedback para ${survey.waiterName}`
                : `¡Nuevo Feedback Recibido!`;
            
            toast({
            title: title,
            description: `${survey.customerName} dio una calificación de ${survey.rating}/5. "${survey.comment || 'Sin comentario.'}"`,
            duration: 10000,
            });
            
            notifiedSurveyIdsRef.current.add(survey.id);
        }
        });

    }, [surveys, user, toast]);

    return (
        <div className="flex min-h-screen bg-[#1C1C1C] text-white">
            <BarraLateralMesero />
            <div className="flex flex-col flex-1">
                <CabeceraMesero />
                <main className="flex-1 overflow-y-auto no-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function LayoutMesero({ children }: { children: React.ReactNode }) {
    return (
        <RutaProtegida allowedRoles={['waiter', 'admin']}>
            <ProveedorEncuestas>
                <ProveedorMenu>
                    <ProveedorMesas>
                        <ProveedorDescuentos>
                            <ProveedorPedidos>
                                <ContenidoLayoutMesero>{children}</ContenidoLayoutMesero>
                            </ProveedorPedidos>
                        </ProveedorDescuentos>
                    </ProveedorMesas>
                </ProveedorMenu>
            </ProveedorEncuestas>
        </RutaProtegida>
    );
}
