

export type RolUsuario = 'admin' | 'cook' | 'customer' | 'waiter' | 'cashier';

export interface Usuario {
  id: string;
  email: string;
  name: string;
  role: RolUsuario;
  password?: string; // En una app real, esto sería un hash
}

export interface Extra {
  id: string;
  name: string;
  price: number;
}

export interface ArticuloMenu {
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

export interface ArticuloPedido extends ArticuloMenu {
  orderItemId: string; // ID único para este artículo en este pedido específico
  quantity: number;
  selectedExtras: Extra[];
}

export type EstadoPedido = 'new' | 'preparing' | 'ready' | 'delivered' | 'paid';
export type OpcionFactura = 'none' | 'print' | 'email';

export interface Descuento {
    id: string;
    name: string;
    code: string;
    value: string; // ej: '20%' o '$10.00'
    status: boolean;
    used: number;
    expires: string;
}

export interface ArticuloInventario {
  id: string;
  name: string;
  category: string;
  stock: number;
  maxStock: number;
  supplier: string;
}

export interface Pedido {
  id:string;
  tableId: string;
  tableName: string;
  customerName: string;
  waiterId: string;
  waiterName: string;
  paymentMethod: 'efectivo' | 'transferencia';
  items: ArticuloPedido[];
  subtotal: number;
  discountCode?: string;
  discountAmount: number;
  total: number;
  timestamp: Date;
  status: EstadoPedido;
  preparationTime?: number;
  invoiceOption: OpcionFactura;
}

export interface Encuesta {
  id: string;
  customerId: string;
  customerName: string;
  waiterId: string;
  waiterName: string;
  rating: number; // 1 a 5
  comment?: string;
  timestamp: Date;
}

export type EstadoMesa = 'available' | 'occupied' | 'reserved';

export interface Mesa {
  id: string;
  name: string;
  status: EstadoMesa;
}
