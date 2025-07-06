import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';

export default function OrderHistoryPage() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <History className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl font-headline">Historial de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                    <p>El historial de pedidos estará disponible próximamente.</p>
                </div>
            </CardContent>
        </Card>
    );
}
