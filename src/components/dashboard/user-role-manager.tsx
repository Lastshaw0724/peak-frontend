'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
                <CardTitle>New User Approvals</CardTitle>
                <CardDescription>Review new users and assign them a role to grant them access.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="w-[200px]">Assign Role</TableHead>
                            <TableHead className="w-[120px]">Action</TableHead>
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
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="customer">Customer</SelectItem>
                                                <SelectItem value="waiter">Waiter</SelectItem>
                                                <SelectItem value="cook">Cook</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="sm" onClick={() => handleSave(user.id)} disabled={!userRoles[user.id]}>
                                            Approve User
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    No new users awaiting approval.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
