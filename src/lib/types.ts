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
  customization?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  timestamp: Date;
  status: 'new' | 'preparing' | 'ready';
}
