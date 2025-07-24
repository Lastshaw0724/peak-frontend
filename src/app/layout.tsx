import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from "@/components/ui/toaster"
import { PreferencesProvider } from '@/components/providers/preferences-provider';

export const metadata: Metadata = {
  title: 'GustoGo | Sistema para Restaurantes',
  description: 'Optimizando las operaciones del restaurante desde el pedido hasta la cocina.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen">
        <AuthProvider>
          <PreferencesProvider>
              {children}
              <Toaster />
          </PreferencesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
