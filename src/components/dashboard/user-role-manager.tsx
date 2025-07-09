'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { User, UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Users, Trash2, PlusCircle, KeyRound } from 'lucide-react';
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
import { useForm, useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


const employeeSchema = z.object({
    name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
    email: z.string().email({ message: "Por favor, introduce un email válido." }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
    role: z.enum(['customer', 'waiter', 'cook', 'cashier'], { required_error: "Debes seleccionar un rol." }),
});

const passwordSchema = z.object({
    password: z.string().min(6, { message: "La nueva contraseña debe tener al menos 6 caracteres." }),
});

export function UserRoleManager() {
    const { user: currentUser, users, updateUserRole, deleteUser, addUser, updateUserPassword } = useAuth();
    const { toast } = useToast();
    const [userRoles, setUserRoles] = useState<Record<string, UserRole>>({});
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const employeeForm = useForm<z.infer<typeof employeeSchema>>({
        resolver: zodResolver(employeeSchema),
        defaultValues: { name: "", email: "", password: "", role: "waiter" },
    });
    
    const passwordForm = useHookForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: "" },
    });

    if (!updateUserRole || !users || !currentUser || !deleteUser || !addUser || !updateUserPassword) {
        return <p>Loading user data...</p>;
    }
    
    function onEmployeeSubmit(values: z.infer<typeof employeeSchema>) {
        addUser(values);
        employeeForm.reset();
        setIsAddDialogOpen(false);
    }

    function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
        if (selectedUser) {
            updateUserPassword(selectedUser.id, values.password);
            passwordForm.reset();
            setIsPasswordDialogOpen(false);
            setSelectedUser(null);
        }
    }
    
    const manageableUsers = users.filter((u) => u.id !== currentUser.id);

    const handleRoleChange = (userId: string, role: UserRole) => {
        setUserRoles(prev => ({...prev, [userId]: role }));
    }

    const handleSaveRole = (userId: string) => {
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
    
    const openPasswordDialog = (user: User) => {
        setSelectedUser(user);
        setIsPasswordDialogOpen(true);
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
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                     <Users className="h-8 w-8 text-primary" />
                     <div>
                        <CardTitle className="text-2xl font-headline">Gestión de Usuarios</CardTitle>
                        <CardDescription>Asigna roles y añade nuevos empleados al sistema.</CardDescription>
                     </div>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2" />
                            Añadir Empleado
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Añadir Nuevo Empleado</DialogTitle>
                            <DialogDescription>
                                Completa los datos para registrar un nuevo miembro del equipo.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...employeeForm}>
                            <form onSubmit={employeeForm.handleSubmit(onEmployeeSubmit)} className="space-y-4">
                                <FormField control={employeeForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Nombre Completo</FormLabel><FormControl><Input placeholder="Ej: Juan Pérez" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={employeeForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="ejemplo@correo.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={employeeForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Contraseña Temporal</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={employeeForm.control} name="role" render={({ field }) => (<FormItem><FormLabel>Rol</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un rol" /></SelectTrigger></FormControl><SelectContent><SelectItem value="waiter">Mesero</SelectItem><SelectItem value="cook">Cocinero</SelectItem><SelectItem value="cashier">Cajero</SelectItem><SelectItem value="customer">Cliente</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                <DialogFooter>
                                    <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
                                    <Button type="submit">Crear Empleado</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
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
                                    <TableCell><Badge variant="secondary" className="capitalize">{roleDisplayNames[user.role] || user.role}</Badge></TableCell>
                                    <TableCell>
                                        <Select value={userRoles[user.id] || user.role} onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}>
                                            <SelectTrigger><SelectValue/></SelectTrigger>
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
                                            <Button size="sm" onClick={() => handleSaveRole(user.id)} disabled={!userRoles[user.id] || userRoles[user.id] === user.role}>
                                                Guardar Rol
                                            </Button>
                                            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => openPasswordDialog(user)}>
                                                <KeyRound className="h-4 w-4" />
                                                <span className="sr-only">Cambiar contraseña</span>
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

             <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Cambiar Contraseña</DialogTitle>
                        <DialogDescription>
                           Estás cambiando la contraseña para <span className="font-semibold">{selectedUser?.name}</span>. El usuario deberá usar esta nueva contraseña para iniciar sesión.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <FormField
                                control={passwordForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nueva Contraseña</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Introduce la nueva contraseña" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="secondary" onClick={() => setSelectedUser(null)}>Cancelar</Button></DialogClose>
                                <Button type="submit">Guardar Contraseña</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
