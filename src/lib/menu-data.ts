import type { MenuItem } from './types';

export const initialMenuData: MenuItem[] = [
  {
    id: 'app-01',
    name: 'Bruschetta al Pomodoro',
    description: 'Pan tostado con tomates frescos, ajo, albahaca y aceite de oliva.',
    price: 8.50,
    category: 'Appetizers',
    image: 'https://www.recetasnestle.com.ec/sites/default/files/srh_recipes/4e429a398743194e479669534934f826.jpg',
    dataAiHint: 'bruschetta tomato',
    allergens: ['Gluten'],
  },
  {
    id: 'app-02',
    name: 'Calamari Fritti',
    description: 'Aros de calamar fritos dorados servidos con salsa marinara picante.',
    price: 12.00,
    category: 'Appetizers',
    image: 'https://carulla.vtexassets.com/arquivos/ids/2639915/Calamres-apanados-con-salsa-t.jpg?v=637639019862930000',
    dataAiHint: 'fried calamari',
  },
  {
    id: 'app-03',
    name: 'Ensalada Caprese',
    description: 'Mozzarella fresca, tomates maduros, albahaca y un glaseado balsámico.',
    price: 10.00,
    category: 'Appetizers',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'caprese salad',
    allergens: ['Dairy'],
  },
  {
    id: 'main-01',
    name: 'Spaghetti Carbonara',
    description: 'Pasta clásica con panceta, yema de huevo, queso pecorino y pimienta negra.',
    price: 18.00,
    category: 'Main Courses',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'spaghetti carbonara',
    allergens: ['Gluten', 'Egg', 'Dairy'],
  },
  {
    id: 'main-02',
    name: 'Pizza Margherita',
    description: 'Pizza tradicional con tomates San Marzano, mozzarella fresca, albahaca y aceite de oliva.',
    price: 16.50,
    category: 'Main Courses',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'margherita pizza',
    allergens: ['Gluten', 'Dairy'],
    extras: [
      { id: 'extra-1', name: 'Extra Mozzarella', price: 2.50 },
      { id: 'extra-2', name: 'Pepperoni', price: 3.00 },
      { id: 'extra-3', name: 'Champiñones', price: 1.75 },
    ]
  },
  {
    id: 'main-03',
    name: 'Pollo alla Cacciatora',
    description: 'Pollo estofado con cebollas, hierbas, tomates y pimientos.',
    price: 22.00,
    category: 'Main Courses',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'chicken cacciatore',
  },
  {
    id: 'main-04',
    name: 'Bistecca alla Fiorentina',
    description: 'Bistec de T-bone de corte grueso, a la parrilla y sazonado con sal, pimienta y aceite de oliva.',
    price: 45.00,
    category: 'Main Courses',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'florentine steak',
  },
  {
    id: 'dessert-01',
    name: 'Tiramisú',
    description: 'Bizcochos de soletilla empapados en café, en capas con una mezcla batida de huevos, azúcar y queso mascarpone.',
    price: 9.00,
    category: 'Desserts',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'tiramisu dessert',
    allergens: ['Gluten', 'Egg', 'Dairy'],
  },
  {
    id: 'dessert-02',
    name: 'Panna Cotta',
    description: 'Crema endulzada sedosa y suave cubierta con un coulis de bayas.',
    price: 8.00,
    category: 'Desserts',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'panna cotta',
    allergens: ['Dairy'],
  },
  {
    id: 'drink-01',
    name: 'Agua Mineral',
    description: 'Natural o con gas.',
    price: 3.00,
    category: 'Drinks',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'mineral water',
  },
  {
    id: 'drink-02',
    name: 'Espresso',
    description: 'Un shot de café rico e intenso.',
    price: 2.50,
    category: 'Drinks',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'espresso coffee',
  },
];
