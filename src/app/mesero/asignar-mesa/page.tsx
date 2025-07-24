'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTable } from '@/hooks/use-table';
import type { Table, TableStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const statusColors: Record<TableStatus, string> = {
  available: 'bg-green-500',
  occupied: 'bg-red-500',
  reserved: 'bg-yellow-500',
};

export default function AssignTablePage() {
  const { tables, updateTableStatus, setActiveTable } = useTable();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tablesPerPage = 8;
  const router = useRouter();

  const totalPages = Math.ceil(tables.length / tablesPerPage);
  const currentTables = tables.slice(
    (currentPage - 1) * tablesPerPage,
    currentPage * tablesPerPage
  );
  
  const selectedTable = tables.find(t => t.id === selectedTableId);

  const handleSelectTable = (table: Table) => {
    if (table.status !== 'available') return;
    setSelectedTableId(table.id === selectedTableId ? null : table.id);
  };

  const handleAssignTable = () => {
    if (!selectedTableId) return;
    const tableToAssign = tables.find(t => t.id === selectedTableId);
    if (!tableToAssign || tableToAssign.status !== 'available') return;

    updateTableStatus(selectedTableId, 'occupied');
    setActiveTable(tableToAssign);
    router.push('/mesero/pos');
  };
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
            <h2 className="text-3xl font-headline mb-2">Estado de las Mesas</h2>
            <p className="text-muted-foreground">Selecciona una mesa disponible para tomar un pedido.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-grow">
          {currentTables.map((table) => (
            <button
              key={table.id}
              onClick={() => handleSelectTable(table)}
              disabled={table.status !== 'available'}
              className={cn(
                "relative flex items-center justify-center aspect-square rounded-lg border-2 text-white font-bold text-xl transition-all",
                "bg-zinc-800/80 border-zinc-700",
                table.status === 'available' && "hover:bg-zinc-700 cursor-pointer",
                table.status !== 'available' && "opacity-50 cursor-not-allowed",
                selectedTableId === table.id && "border-blue-500 ring-2 ring-blue-500"
              )}
            >
              <span>{table.name}</span>
              <div className={cn(
                "absolute top-2 right-2 h-3 w-3 rounded-full",
                statusColors[table.status]
              )} />
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center justify-center gap-4">
            <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold">{currentPage} / {totalPages}</span>
            <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setSelectedTableId(null)} className="bg-zinc-700 hover:bg-zinc-600">
              Limpiar Selección
            </Button>
            
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleAssignTable}
              disabled={!selectedTableId || selectedTable?.status !== 'available'}
            >
              Asignar y Tomar Pedido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
