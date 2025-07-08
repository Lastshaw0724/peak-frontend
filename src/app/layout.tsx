
import type { Metadata } from 'next';
import './globals.css';
import { OrderProvider } from '@/components/providers/order-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from "@/components/ui/toaster"
import { SurveyProvider } from '@/components/providers/survey-provider';
import { TableProvider } from '@/components/providers/table-provider';
import { MenuProvider } from '@/components/providers/menu-provider';
import { DiscountProvider } from '@/components/providers/discount-provider';
import { PreferencesProvider } from '@/components/providers/preferences-provider';

export const metadata: Metadata = {
  title: 'GustoGo | Restaurant System',
  description: 'Streamlining restaurant operations from order to kitchen.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen">
        <AuthProvider>
          <PreferencesProvider>
            <SurveyProvider>
              <TableProvider>
                <MenuProvider>
                  <DiscountProvider>
                    <OrderProvider>
                      {children}
                      <Toaster />
                    </OrderProvider>
                  </DiscountProvider>
                </MenuProvider>
              </TableProvider>
            </SurveyProvider>
          </PreferencesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
