import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function PreferencesPage() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Settings className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl font-headline">Preferencias</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                    <p>La gestión de preferencias estará disponible próximamente.</p>
                </div>
            </CardContent>
        </Card>
    );
}
