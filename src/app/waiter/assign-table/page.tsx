'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function AssignTablePage() {
    return (
        <div className="flex items-center justify-center p-8 h-full">
            <Card className="w-full max-w-lg text-center bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <MapPin className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="mt-4 text-3xl font-headline">Asignar Mesa</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-lg text-zinc-400">
                        Esta funcionalidad para gestionar y asignar mesas está en construcción.
                    </CardDescription>
                </CardContent>
            </Card>
        </div>
    );
}
