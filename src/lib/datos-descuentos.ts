import type { Descuento } from './tipos';

export const datosInicialesDescuentos: Descuento[] = [
  { id: 'dsc-1', name: 'Martes Loco', code: 'MARTES20', value: '20%', status: true, used: 45, expires: '31/12/2024' },
  { id: 'dsc-2', name: 'Combo Pareja', code: 'AMOR10', value: '$10.00', status: true, used: 120, expires: 'N/A' },
  { id: 'dsc-3', name: 'Descuento de Verano', code: 'VERANO15', value: '15%', status: false, used: 210, expires: '30/08/2024' },
  { id: 'dsc-4', name: 'Primera Compra', code: 'NUEVO', value: '25%', status: true, used: 88, expires: 'N/A' },
];
