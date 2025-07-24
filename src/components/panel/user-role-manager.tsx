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
    name: z.string().min(3, { message: "Name must be at least 3 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    role: z.enum(['customer', 'waiter', 'cook', 'cashier'], { required_error: "You must select a role." }),
});

const passwordSchema = z.object({
    password: z.string().min(6, { message: "New password must be at least 6 characters." }),
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
            toast({ title: 'Role Updated', description: 'The user role has been updated.' });
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
      waiter: 'Waiter',
      cook: 'Cook',
      customer: 'Customer',
      cashier: 'Cashier',
    };

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                     <Users className="h-8 w-8 text-primary" />
                     <div>
                        <CardTitle className="text-2xl font-headline">User Management</CardTitle>
                        <CardDescription>Assign roles and add new employees to the system.</CardDescription>
                     </div>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                            <PlusCircle className="mr-2" />
                            Add Employee
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Employee</DialogTitle>
                            <DialogDescription>
                                Fill in the details to register a new team member.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...employeeForm}>
                            <form onSubmit={employeeForm.handleSubmit(onEmployeeSubmit)} className="space-y-4">
                                <FormField control={employeeForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="E.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={employeeForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="example@email.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={employeeForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Temporary Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={employeeForm.control} name="role" render={({ field }) => (<FormItem><FormLabel>Role</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl><SelectContent><SelectItem value="waiter">Waiter</SelectItem><SelectItem value="cook">Cook</SelectItem><SelectItem value="cashier">Cashier</SelectItem><SelectItem value="customer">Customer</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                <DialogFooter>
                                    <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                    <Button type="submit">Create Employee</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="relative w-full overflow-auto no-scrollbar">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="min-w-[200px]">Assign Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {manageableUsers.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium whitespace-nowrap">{user.name}</TableCell>
                                    <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                                    <TableCell><Badge variant="secondary" className="capitalize">{roleDisplayNames[user.role] || user.role}</Badge></TableCell>
                                    <TableCell>
                                        <Select value={userRoles[user.id] || user.role} onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}>
                                            <SelectTrigger><SelectValue/></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="customer">Customer</SelectItem>
                                                <SelectItem value="waiter">Waiter</SelectItem>
                                                <SelectItem value="cook">Cook</SelectItem>
                                                <SelectItem value="cashier">Cashier</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button size="sm" onClick={() => handleSaveRole(user.id)} disabled={!userRoles[user.id] || userRoles[user.id] === user.role}>
                                                Save
                                            </Button>
                                             <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => openPasswordDialog(user)}>
                                                <KeyRound className="h-4 w-4" />
                                                <span className="sr-only">Change password</span>
                                            </Button>
                                             <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="icon" className="h-9 w-9">
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete user</span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the user 
                                                            <span className="font-semibold"> {user.name}</span> and their data from the system.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteUser(user.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                            Yes, delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

             <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                           You are changing the password for <span className="font-semibold">{selectedUser?.name}</span>. The user will need to use this new password to log in.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <FormField
                                control={passwordForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter the new password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="secondary" onClick={() => setSelectedUser(null)}>Cancel</Button></DialogClose>
                                <Button type="submit">Save Password</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
