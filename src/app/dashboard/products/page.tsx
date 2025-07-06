import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

export default function ProductsPage() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Package className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl font-headline">Productos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                    <p>La gestión de productos estará disponible próximamente.</p>
                </div>
            </CardContent>
        </Card>
    );
}
