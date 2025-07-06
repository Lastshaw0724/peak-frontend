import { MenuDisplay } from './menu-display';
import { OrderSummary } from './order-summary';
import { ScrollArea } from '@/components/ui/scroll-area';

export function WaiterInterface() {
  return (
    <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-0 overflow-hidden">
      <ScrollArea className="lg:col-span-2 xl:col-span-3 h-[calc(100vh-5rem)]">
        <MenuDisplay />
      </ScrollArea>
      <aside className="lg:col-span-1 xl:col-span-2 bg-card h-[calc(100vh-5rem)]">
        <OrderSummary />
      </aside>
    </main>
  );
}
