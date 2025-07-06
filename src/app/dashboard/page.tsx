'use client';
import { Logo } from '@/components/logo';
import ProtectedRoute from '@/components/auth/protected-route';
import { AppHeader } from '@/components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRoleManager } from '@/components/dashboard/user-role-manager';
import { AccountingChart } from '@/components/dashboard/accounting-chart';
import { DollarSign, Users } from 'lucide-react';

function DashboardPageContent() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title="Admin Dashboard" />
      <main className="flex flex-col flex-1 p-4 sm:p-8">
        <div className="text-center mb-12">
          <Logo className="w-48 h-auto mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">
            Welcome, Admin
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your restaurant's operations from one central hub.
          </p>
        </div>

        <Tabs defaultValue="users" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="accounting">
                <DollarSign />
                Accounting
            </TabsTrigger>
            <TabsTrigger value="users">
                <Users />
                User Management
            </TabsTrigger>
          </TabsList>
          <TabsContent value="accounting" className="mt-6">
            <AccountingChart />
          </TabsContent>
          <TabsContent value="users" className="mt-6">
             <UserRoleManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <DashboardPageContent />
        </ProtectedRoute>
    )
}
