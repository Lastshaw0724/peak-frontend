'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { User, UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Users, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function UserRoleManager() {
    const { user: currentUser, users, updateUserRole, deleteUser } = useAuth();
    const { toast } = useToast();
    const [userRoles, setUserRoles] = useState<Record<string, UserRole>>({});

    if (!updateUserRole || !users || !currentUser || !deleteUser) {
        return <p>Loading user data...</p>;
    }
    
    const manageableUsers = users.filter((u) => u.id !== currentUser.id);

    const handleRoleChange = (userId: string, role: UserRole) => {
        setUserRoles(prev => ({...prev, [userId]: role }));
    }

    const handleSave = (userId: string) => {
        const newRole = userRoles[userId];
        if (newRole) {
            updateUserRole(userId, newRole);
            toast({ title: 'Rol Actualizado', description: 'El rol del usuario ha sido actualizado.' });
            setUserRoles(prev => {
                const newRoles = { ...prev };
                delete newRoles[userId];
                return newRoles;
            });
        }
    };

    const roleDisplayNames: Record<string, string> = {
      admin: 'Admin',
      waiter: 'Mesero',
      cook: 'Cocinero',
      customer: 'Cliente',
      cashier: 'Cajero',
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                     <Users className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl font-headline">Gestión de Usuarios</CardTitle>
                </div>
                <CardDescription>Asigna roles a los usuarios registrados en el sistema. Los nuevos usuarios son 'Clientes' por defecto.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Rol Actual</TableHead>
                            <TableHead className="w-[200px]">Asignar Nuevo Rol</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {manageableUsers.length > 0 ? (
                            manageableUsers.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="capitalize">
                                            {roleDisplayNames[user.role] || user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Select 
                                            value={userRoles[user.id] || user.role}
                                            onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="customer">Cliente</SelectItem>
                                                <SelectItem value="waiter">Mesero</SelectItem>
                                                <SelectItem value="cook">Cocinero</SelectItem>
                                                <SelectItem value="cashier">Cajero</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button 
                                                size="sm" 
                                                onClick={() => handleSave(user.id)} 
                                                disabled={!userRoles[user.id] || userRoles[user.id] === user.role}
                                            >
                                                Guardar
                                            </Button>
                                             <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="icon" className="h-9 w-9">
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Eliminar usuario</span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario 
                                                            <span className="font-semibold"> {user.name}</span> y sus datos del sistema.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteUser(user.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                            Sí, eliminar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    No hay otros usuarios registrados para gestionar.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
