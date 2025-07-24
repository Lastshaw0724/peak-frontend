import type { Discount } from './types';

export const initialDiscountsData: Discount[] = [
  { id: 'dsc-1', name: 'Mad Tuesday', code: 'TUESDAY20', value: '20%', status: true, used: 45, expires: '31/12/2024' },
  { id: 'dsc-2', name: 'Couple Combo', code: 'LOVE10', value: '$10.00', status: true, used: 120, expires: 'N/A' },
  { id: 'dsc-3', name: 'Summer Discount', code: 'SUMMER15', value: '15%', status: false, used: 210, expires: '30/08/2024' },
  { id: 'dsc-4', name: 'First Purchase', code: 'NEW', value: '25%', status: true, used: 88, expires: 'N/A' },
];
