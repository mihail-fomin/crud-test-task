import type { Product } from '../types/product';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: 'Новейший смартфон от Apple с титановым корпусом',
    price: 99999.99,
    discountedPrice: 89999.99,
    sku: 'IPH15PRO-256',
    photoUrl: '/uploads/iphone15pro.jpg',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Флагманский Android смартфон с S Pen',
    price: 89999.99,
    discountedPrice: null,
    sku: 'SGS24U-512',
    photoUrl: '/uploads/galaxy-s24-ultra.jpg',
    createdAt: '2024-01-16T14:20:00.000Z',
    updatedAt: '2024-01-16T14:20:00.000Z',
  },
  {
    id: 3,
    name: 'MacBook Pro 16"',
    description: 'Профессиональный ноутбук с чипом M3 Pro',
    price: 199999.99,
    discountedPrice: 179999.99,
    sku: 'MBP16-M3PRO',
    photoUrl: '/uploads/macbook-pro-16.jpg',
    createdAt: '2024-01-17T09:15:00.000Z',
    updatedAt: '2024-01-17T09:15:00.000Z',
  },
  {
    id: 4,
    name: 'iPad Air 5',
    description: 'Планшет с чипом M1 и поддержкой Apple Pencil',
    price: 59999.99,
    discountedPrice: null,
    sku: 'IPADAIR5-256',
    photoUrl: '/uploads/ipad-air-5.jpg',
    createdAt: '2024-01-18T11:45:00.000Z',
    updatedAt: '2024-01-18T11:45:00.000Z',
  },
  {
    id: 5,
    name: 'AirPods Pro 2',
    description: 'Беспроводные наушники с активным шумоподавлением',
    price: 24999.99,
    discountedPrice: 19999.99,
    sku: 'APP2-USB-C',
    photoUrl: '/uploads/airpods-pro-2.jpg',
    createdAt: '2024-01-19T16:30:00.000Z',
    updatedAt: '2024-01-19T16:30:00.000Z',
  },
  {
    id: 6,
    name: 'Apple Watch Series 9',
    description: 'Умные часы с датчиком температуры',
    price: 39999.99,
    discountedPrice: null,
    sku: 'AWS9-45MM',
    photoUrl: '/uploads/apple-watch-9.jpg',
    createdAt: '2024-01-20T13:20:00.000Z',
    updatedAt: '2024-01-20T13:20:00.000Z',
  },
  {
    id: 7,
    name: 'Sony WH-1000XM5',
    description: 'Премиальные наушники с лучшим шумоподавлением',
    price: 34999.99,
    discountedPrice: 29999.99,
    sku: 'SONY-WH1000XM5',
    photoUrl: '/uploads/sony-wh1000xm5.jpg',
    createdAt: '2024-01-21T08:10:00.000Z',
    updatedAt: '2024-01-21T08:10:00.000Z',
  },
  {
    id: 8,
    name: 'Dell XPS 13',
    description: 'Ультрабук с безрамочным дисплеем',
    price: 129999.99,
    discountedPrice: null,
    sku: 'DELL-XPS13-9320',
    photoUrl: '/uploads/dell-xps13.jpg',
    createdAt: '2024-01-22T12:00:00.000Z',
    updatedAt: '2024-01-22T12:00:00.000Z',
  },
  {
    id: 9,
    name: 'Nintendo Switch OLED',
    description: 'Игровая консоль с OLED экраном',
    price: 29999.99,
    discountedPrice: 24999.99,
    sku: 'NSW-OLED-64GB',
    photoUrl: '/uploads/nintendo-switch-oled.jpg',
    createdAt: '2024-01-23T15:45:00.000Z',
    updatedAt: '2024-01-23T15:45:00.000Z',
  },
  {
    id: 10,
    name: 'Canon EOS R6 Mark II',
    description: 'Зеркальная камера для профессиональной съемки',
    price: 249999.99,
    discountedPrice: 219999.99,
    sku: 'CANON-R6M2',
    photoUrl: '/uploads/canon-r6-mark2.jpg',
    createdAt: '2024-01-24T10:30:00.000Z',
    updatedAt: '2024-01-24T10:30:00.000Z',
  },
];

export const generateMockProducts = (count: number): Product[] => {
  const products: Product[] = [];
  const baseProducts = mockProducts;
  
  for (let i = 0; i < count; i++) {
    const baseProduct = baseProducts[i % baseProducts.length];
    products.push({
      ...baseProduct,
      id: i + 1,
      name: `${baseProduct.name} ${i + 1}`,
      sku: `${baseProduct.sku}-${i + 1}`,
      price: baseProduct.price + (Math.random() * 10000),
      discountedPrice: Math.random() > 0.5 ? baseProduct.price * 0.8 : null,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  return products;
};
