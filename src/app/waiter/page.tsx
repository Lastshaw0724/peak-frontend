import { WaiterInterface } from '@/components/waiter/waiter-interface';
import { AppHeader } from '@/components/header';

export default function WaiterPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader title="Waiter View" />
      <WaiterInterface />
    </div>
  );
}
