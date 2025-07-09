
export type UserRole = 'admin' | 'cook' | 'customer' | 'waiter' | 'cashier';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string; // In a real app, this would be a hash
}

export interface Extra {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Appetizers' | 'Main Courses' | 'Desserts' | 'Drinks';
  image: string;
  dataAiHint?: string;
  allergens?: string[];
  extras?: Extra[];
}

export interface OrderItem extends MenuItem {
  orderItemId: string; // Unique ID for this item in this specific order
  quantity: number;
  selectedExtras: Extra[];
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivered' | 'paid';

export interface Discount {
    id: string;
    name: string;
    code: string;
    value: string; // e.g., '20%' or '$10.00'
    status: boolean;
    used: number;
    expires: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  maxStock: number;
  supplier: string;
}

export interface Order {
  id:string;
  tableId: string;
  tableName: string;
  customerName: string;
  paymentMethod: 'efectivo' | 'transferencia';
  items: OrderItem[];
  subtotal: number;
  discountCode?: string;
  discountAmount: number;
  total: number;
  timestamp: Date;
  status: OrderStatus;
  preparationTime?: number;
}

export interface Survey {
  id: string;
  customerId: string;
  customerName: string;
  waiterId: string;
  waiterName: string;
  rating: number; // 1 to 5
  comment?: string;
  timestamp: Date;
}

export type TableStatus = 'available' | 'occupied' | 'reserved';

export interface Table {
  id: string;
  name: string;
  status: TableStatus;
}
