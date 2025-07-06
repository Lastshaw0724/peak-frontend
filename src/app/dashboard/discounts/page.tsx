import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Percent, PlusCircle } from 'lucide-react';

const discountsData = [
  { id: 'dsc-1', name: 'Martes Loco', code: 'MARTES20', value: '20%', status: true, used: 45, expires: '31/12/2024' },
  { id: 'dsc-2', name: 'Combo Pareja', code: 'AMOR10', value: '$10.00', status: true, used: 120, expires: 'N/A' },
  { id: 'dsc-3', name: 'Descuento de Verano', code: 'VERANO15', value: '15%', status: false, used: 210, expires: '30/08/2024' },
  { id: 'dsc-4', name: 'Primera Compra', code: 'NUEVO', value: '25%', status: true, used: 88, expires: 'N/A' },
];

export default function DiscountsPage() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <Percent className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-2xl font-headline">Descuentos</CardTitle>
                        <CardDescription>Crea y administra promociones y descuentos.</CardDescription>
                    </div>
                </div>
                <Button>
                    <PlusCircle className="mr-2" />
                    Crear Descuento
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Código</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Usos</TableHead>
                             <TableHead>Expira</TableHead>
                            <TableHead className="text-right">Activo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {discountsData.map(discount => (
                             <TableRow key={discount.id}>
                                <TableCell className="font-medium">{discount.name}</TableCell>
                                <TableCell><Badge variant="secondary">{discount.code}</Badge></TableCell>
                                <TableCell className="font-semibold text-primary">{discount.value}</TableCell>
                                <TableCell>{discount.used}</TableCell>
                                <TableCell>{discount.expires}</TableCell>
                                <TableCell className="text-right">
                                    <Switch defaultChecked={discount.status} aria-label={`Activate discount ${discount.name}`} />
                                </TableCell>
                             </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
