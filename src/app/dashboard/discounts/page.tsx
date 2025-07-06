import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Percent } from 'lucide-react';

export default function DiscountsPage() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Percent className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl font-headline">Descuentos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                    <p>La gestión de descuentos estará disponible próximamente.</p>
                </div>
            </CardContent>
        </Card>
    );
}
