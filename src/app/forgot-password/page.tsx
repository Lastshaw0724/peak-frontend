'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would trigger a password reset email flow.
        toast({
            title: "Password Reset Email Sent",
            description: "If an account with that email exists, you will receive reset instructions."
        });
        router.push('/login');
    };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Logo className="w-32 h-auto mx-auto mb-4" />
          <CardTitle className="font-headline text-3xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a reset link.</CardDescription>
        </CardHeader>
        <form onSubmit={handleReset}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">Send Reset Link</Button>
            <div className="text-center text-sm text-muted-foreground">
              Remembered your password?{' '}
              <Link href="/login" className="underline hover:text-primary">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
