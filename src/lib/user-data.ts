import type { User } from './types';

// In a real application, this data would come from a database.
// Passwords are in plaintext for demonstration purposes only. NEVER do this in production.
export const mockUsers: User[] = [
  { id: '1', email: 'admin@gustogo.com', password: 'password', name: 'Admin User', role: 'admin' },
  { id: '2', email: 'cook@gustogo.com', password: 'password', name: 'Chef Remy', role: 'cook' },
  { id: '3', email: 'waiter@gustogo.com', password: 'password', name: 'Luigi', role: 'waiter' },
  { id: '4', email: 'customer@gustogo.com', password: 'password', name: 'Anton Ego', role: 'customer' },
  { id: '5', email: 'pending@gustogo.com', password: 'password', name: 'New Customer', role: 'customer' },
  { id: '6', email: 'ossa71924@gmail.com', password: '12345', name: 'Admin Ossa', role: 'admin' },
];
