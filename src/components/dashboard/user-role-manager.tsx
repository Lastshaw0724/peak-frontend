'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Users } from 'lucide-react';

export function UserRoleManager() {
    const { users, updateUserRole } = useAuth();
    const { toast } = useToast();
    const [userRoles, setUserRoles] = useState<Record<string, UserRole>>({});

    if (!updateUserRole || !users) {
        return <p>Loading user data...</p>;
    }
    
    const pendingUsers = users.filter((u) => u.role === 'pending');

    const handleRoleChange = (userId: string, role: UserRole) => {
        setUserRoles(prev => ({...prev, [userId]: role }));
    }

    const handleSave = (userId: string) => {
        const newRole = userRoles[userId];
        if (newRole) {
            updateUserRole(userId, newRole);
            toast({ title: 'Success', description: 'User role has been updated.' });
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                     <Users className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl font-headline">Empleados</CardTitle>
                </div>
                <CardDescription>Aprobar nuevos usuarios y asignarles un rol para concederles acceso.</CardDescription>
            </CardHeader>
            <CardContent>
                <h3 className="text-xl font-headline mb-4">Aprobaciones de nuevos usuarios</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="w-[200px]">Asignar rol</TableHead>
                            <TableHead className="w-[120px]">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingUsers.length > 0 ? (
                            pendingUsers.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Select onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar un rol" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="customer">Cliente</SelectItem>
                                                <SelectItem value="waiter">Mesero</SelectItem>
                                                <SelectItem value="cook">Cocinero</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="sm" onClick={() => handleSave(user.id)} disabled={!userRoles[user.id]}>
                                            Aprobar usuario
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    No hay nuevos usuarios pendientes de aprobación.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
