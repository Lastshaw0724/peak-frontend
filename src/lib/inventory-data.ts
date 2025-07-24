import type { InventoryItem } from './types';

export const initialInventoryData: InventoryItem[] = [
  { id: 'inv-1', name: 'Fresh Tomatoes', category: 'Vegetables', stock: 75, maxStock: 100, supplier: 'Local Provider' },
  { id: 'inv-2', name: 'Mozzarella Cheese', category: 'Dairy', stock: 40, maxStock: 50, supplier: 'Italian Importer' },
  { id: 'inv-3', name: 'Flour Type 00', category: 'Dry Goods', stock: 18, maxStock: 120, supplier: 'Sun Mills' },
  { id: 'inv-4', name: 'Chicken Breast', category: 'Meats', stock: 25, maxStock: 60, supplier: 'Poultry Farm' },
  { id: 'inv-5', name: 'Extra Virgin Olive Oil', category: 'Oils', stock: 15, maxStock: 40, supplier: 'Italian Importer' },
  { id: 'inv-6', name: 'Red Wine (Bottle)', category: 'Beverages', stock: 85, maxStock: 100, supplier: 'Mendoza Vineyards' },
];
