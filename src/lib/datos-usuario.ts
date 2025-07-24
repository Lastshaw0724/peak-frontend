import type { Usuario } from './tipos';

// En una aplicación real, estos datos vendrían de una base de datos.
// Las contraseñas están en texto plano solo para fines de demostración. NUNCA hagas esto en producción.
export const usuariosMock: Usuario[] = [
  { id: '1', email: 'admin@gustogo.com', password: 'password', name: 'Usuario Admin', role: 'admin' },
  { id: '2', email: 'cook@gustogo.com', password: 'password', name: 'Chef Remy', role: 'cook' },
  { id: '3', email: 'waiter@gustogo.com', password: 'password', name: 'Luigi', role: 'waiter' },
  { id: '4', email: 'customer@gustogo.com', password: 'password', name: 'Anton Ego', role: 'customer' },
  { id: '5', email: 'pending@gustogo.com', password: 'password', name: 'Nuevo Cliente', role: 'customer' },
  { id: '6', email: 'ossa71924@gmail.com', password: '12345', name: 'Admin Ossa', role: 'admin' },
  { id: '7', email: 'cashier@gustogo.com', password: 'password', name: 'Mona Lisa', role: 'cashier' },
];
