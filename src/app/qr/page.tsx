import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppHeader } from '@/components/header';
import { Button } from '@/components/ui/button';

export default function QrCodePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title="Menu QR Code" />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-4xl">Scan to View Our Menu</CardTitle>
            <CardDescription className="text-lg">
              Point your phone's camera at the code below.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="p-4 bg-white rounded-lg border">
                <Image
                    src="https://placehold.co/300x300.png"
                    alt="QR Code for menu"
                    width={300}
                    height={300}
                    data-ai-hint="qr code"
                    priority
                />
            </div>
            <p className="text-muted-foreground">Having trouble scanning?</p>
            <Button asChild>
                <Link href="/menu">
                    Click Here to View Menu
                </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
