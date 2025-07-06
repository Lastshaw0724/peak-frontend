'use client';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { NotebookPen, ChefHat, BookOpen, QrCode } from 'lucide-react';
import { Logo } from '@/components/logo';
import ProtectedRoute from '@/components/auth/protected-route';
import { AppHeader } from '@/components/header';

function DashboardPageContent() {
  const features = [
    {
      title: 'Waiter View',
      href: '/waiter',
      description: 'Take and manage customer orders seamlessly.',
      icon: <NotebookPen className="w-8 h-8 text-primary" />,
    },
    {
      title: 'Kitchen Display',
      href: '/kitchen',
      description: 'View incoming orders in real-time.',
      icon: <ChefHat className="w-8 h-8 text-primary" />,
    },
    {
      title: 'Customer Menu',
      href: '/menu',
      description: 'Browse the digital version of our menu.',
      icon: <BookOpen className="w-8 h-8 text-primary" />,
    },
    {
      title: 'QR Code',
      href: '/qr',
      description: 'Get a QR code for customers to access the menu.',
      icon: <QrCode className="w-8 h-8 text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title="Admin Dashboard" />
      <main className="flex flex-col items-center justify-center flex-1 p-4 sm:p-8">
        <div className="text-center mb-12">
          <Logo className="w-48 h-auto mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">
            Welcome to GustoGo
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            The modern solution for streamlining your restaurant's workflow, from order taking to kitchen execution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {features.map((feature) => (
            <Link href={feature.href} key={feature.title} className="group">
              <Card className="h-full hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl bg-card">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  {feature.icon}
                  <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-card-foreground/80">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
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