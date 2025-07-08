import type { InventoryItem } from './types';

export const initialInventoryData: InventoryItem[] = [
  { id: 'inv-1', name: 'Tomates Frescos', category: 'Vegetales', stock: 75, maxStock: 100, supplier: 'Proveedor Local' },
  { id: 'inv-2', name: 'Queso Mozzarella', category: 'Lácteos', stock: 40, maxStock: 50, supplier: 'Importadora Italiana' },
  { id: 'inv-3', name: 'Harina Tipo 00', category: 'Secos', stock: 18, maxStock: 120, supplier: 'Molinos del Sol' },
  { id: 'inv-4', name: 'Pechuga de Pollo', category: 'Carnes', stock: 25, maxStock: 60, supplier: 'Granja Avícola' },
  { id: 'inv-5', name: 'Aceite de Oliva Extra Virgen', category: 'Aceites', stock: 15, maxStock: 40, supplier: 'Importadora Italiana' },
  { id: 'inv-6', name: 'Vino Tinto (Botella)', category: 'Bebidas', stock: 85, maxStock: 100, supplier: 'Viñedos Mendoza' },
];
