import { KitchenDisplay } from '@/components/kitchen/kitchen-display';
import { AppHeader } from '@/components/header';

export default function KitchenPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title="Kitchen Display" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <KitchenDisplay />
      </main>
    </div>
  );
}
