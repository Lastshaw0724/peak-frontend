import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Warehouse } from 'lucide-react';

export default function InventoryPage() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Warehouse className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl font-headline">Inventario</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                    <p>La gestión de inventario estará disponible próximamente.</p>
                </div>
            </CardContent>
        </Card>
    );
}
