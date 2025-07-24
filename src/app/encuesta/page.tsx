'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usarAutenticacion } from '@/hooks/usar-autenticacion';
import { usarEncuesta } from '@/hooks/usar-encuesta';
import { CabeceraApp } from '@/components/cabecera';
import { RutaProtegida } from '@/components/autenticacion/ruta-protegida';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Star, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function ContenidoPaginaEncuesta() {
    const { user, users } = usarAutenticacion();
    const { submitSurvey } = usarEncuesta();
    const router = useRouter();
    const { toast } = useToast();

    const [waiterId, setWaiterId] = useState<string>('');
    const [rating, setRating] = useState<number>(4);
    const [comment, setComment] = useState<string>('');

    const waiters = users.filter(u => u.role === 'waiter');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!waiterId || !user) {
            toast({
                variant: 'destructive',
                title: 'Formulario Incompleto',
                description: 'Por favor, selecciona el mesero que te atendió.',
            });
            return;
        }
        const waiter = users.find(u => u.id === waiterId);
        if (!waiter) return;

        submitSurvey({
            customerId: user.id,
            customerName: user.name,
            waiterId: waiter.id,
            waiterName: waiter.name,
            rating,
            comment,
        });
        
        router.push('/menu'); // Redirect after submission
    };

    return (
        <div className="bg-background min-h-screen">
            <CabeceraApp title="Encuesta de Satisfacción" />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
                <Card className="w-full max-w-2xl shadow-xl">
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle className="font-headline text-3xl flex items-center gap-3">
                                <Star className="text-primary" />
                                Califica tu Experiencia
                            </CardTitle>
                            <CardDescription>
                                Tus comentarios nos ayudan a mejorar nuestro servicio. Por favor, dinos cómo lo hicimos.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="waiter">¿Qué mesero te atendió?</Label>
                                <Select onValueChange={setWaiterId} value={waiterId} required>
                                    <SelectTrigger id="waiter">
                                        <SelectValue placeholder="Selecciona un mesero" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {waiters.map(waiter => (
                                            <SelectItem key={waiter.id} value={waiter.id}>
                                                {waiter.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rating">Calificación: {rating} / 5</Label>
                                <div className="flex items-center gap-4 pt-2">
                                    <Star className="text-muted-foreground" />
                                    <Slider
                                        id="rating"
                                        min={1}
                                        max={5}
                                        step={1}
                                        value={[rating]}
                                        onValueChange={(value) => setRating(value[0])}
                                    />
                                    <Star className="text-primary fill-primary" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="comment">Comentarios (Opcional)</Label>
                                <Textarea
                                    id="comment"
                                    placeholder="Cuéntanos más sobre tu experiencia..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={!waiterId}>
                                <Send className="mr-2" />
                                Enviar Comentarios
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </main>
        </div>
    );
}

export default function PaginaEncuesta() {
    return (
        <RutaProtegida allowedRoles={['customer', 'admin']}>
            <ContenidoPaginaEncuesta />
        </RutaProtegida>
    );
}
