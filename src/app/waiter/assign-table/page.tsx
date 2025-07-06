'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type TableStatus = 'available' | 'occupied' | 'reserved';

interface Table {
  id: string;
  name: string;
  status: TableStatus;
}

const tablesData: Table[] = [
  { id: 't1', name: 'Mesa #1', status: 'occupied' },
  { id: 't2', name: 'Mesa #2', status: 'available' },
  { id: 't3', name: 'Mesa #3', status: 'occupied' },
  { id: 't4', name: 'Mesa #4', status: 'available' },
  { id: 't5', name: 'Mesa #5', status: 'occupied' },
  { id: 't6', name: 'Mesa #6', status: 'reserved' },
  { id: 't7', name: 'Mesa #7', status: 'available' },
  { id: 't8', name: 'Mesa #8', status: 'occupied' },
  { id: 't9', name: 'Mesa #9', status: 'available' },
  { id: 't10', name: 'Mesa #10', status: 'available' },
  { id: 't11', name: 'Mesa #11', status: 'occupied' },
  { id: 't12', name: 'Mesa #12', status: 'available' },
];

const statusColors: Record<TableStatus, string> = {
  available: 'bg-green-500',
  occupied: 'bg-red-500',
  reserved: 'bg-yellow-500',
};

export default function AssignTablePage() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tablesPerPage = 8;

  const totalPages = Math.ceil(tablesData.length / tablesPerPage);
  const currentTables = tablesData.slice(
    (currentPage - 1) * tablesPerPage,
    currentPage * tablesPerPage
  );

  const handleSelectTable = (table: Table) => {
    if (table.status === 'available') {
      setSelectedTable(table.id === selectedTable ? null : table.id);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <Input 
            placeholder="Buscar pedido #..." 
            className="max-w-xs bg-zinc-800 border-zinc-700 placeholder:text-zinc-400"
          />
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
                "disabled:opacity-50 disabled:cursor-not-allowed",
                selectedTable === table.id && "border-blue-500 ring-2 ring-blue-500",
                table.status === 'available' && "hover:bg-zinc-700"
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

          <div className="flex gap-4">
            <Button variant="ghost" className="bg-zinc-700 hover:bg-zinc-600">Cancelar</Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!selectedTable}
            >
              Asignar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
