'use client';
import { AppHeader } from '@/components/header';
import CustomerMenu from '@/components/menu/customer-menu';
import ProtectedRoute from '@/components/auth/protected-route';

function CustomerMenuPageContent() {
    return (
        <div className="bg-background min-h-screen">
            <AppHeader title="Our Menu" />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">
                     <h1 className="text-5xl md:text-6xl font-bold font-headline text-foreground">
                        Savor the Flavor
                    </h1>
                    <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                        A curated selection of authentic dishes, crafted with the freshest ingredients and a passion for flavor.
                    </p>
                </div>
                <CustomerMenu />
            </main>
        </div>
    );
}

export default function CustomerMenuPage() {
    return (
        <ProtectedRoute allowedRoles={['customer', 'waiter', 'admin']}>
            <CustomerMenuPageContent />
        </ProtectedRoute>
    );
}
