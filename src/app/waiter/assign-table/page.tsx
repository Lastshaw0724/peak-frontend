'use client';
import { AppHeader } from '@/components/header';
import ProtectedRoute from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

function AssignTablePageContent() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppHeader title="Asignar Mesa" />
            <main className="flex-1 flex items-center justify-center p-8">
                <Card className="w-full max-w-lg text-center">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                            <MapPin className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="mt-4 text-3xl font-headline">Asignar Mesa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-lg">
                            Esta funcionalidad para gestionar y asignar mesas está en construcción.
                        </CardDescription>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}


export default function AssignTablePage() {
    return (
        <ProtectedRoute allowedRoles={['waiter', 'admin', 'cashier']}>
            <AssignTablePageContent />
        </ProtectedRoute>
    )
}
