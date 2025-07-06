export type UserRole = 'admin' | 'cook' | 'customer' | 'waiter' | 'cashier';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string; // In a real app, this would be a hash
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
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  tableId: string;
  tableName: string;
  customerName: string;
  paymentMethod: 'efectivo' | 'transferencia';
  items: OrderItem[];
  total: number;
  timestamp: Date;
  status: 'new' | 'preparing' | 'ready';
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
