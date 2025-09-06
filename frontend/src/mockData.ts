import type { Product, PaginatedResponse } from './types/product'

// Генерируем случайные даты в последние 30 дней
const generateRandomDate = () => {
	const now = new Date()
	const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
	const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
	return new Date(randomTime).toISOString()
}

// Мок данные товаров
export const mockProducts: Product[] = [
	{
		id: 1,
		name: 'Смартфон iPhone 15 Pro',
		description: 'Новейший смартфон Apple с титановым корпусом, чипом A17 Pro и камерой 48 МП',
		price: 99990,
		discountedPrice: 89990,
		sku: 'IPH15P-256-BLK',
		photoUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 2,
		name: 'Ноутбук MacBook Air M2',
		description: 'Легкий и мощный ноутбук с чипом M2, 13-дюймовым дисплеем Liquid Retina',
		price: 119990,
		discountedPrice: null,
		sku: 'MBA-M2-256-SLV',
		photoUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 3,
		name: 'Наушники AirPods Pro 2',
		description: 'Беспроводные наушники с активным шумоподавлением и пространственным звуком',
		price: 24990,
		discountedPrice: 19990,
		sku: 'APP2-WHT',
		photoUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 4,
		name: 'Планшет iPad Air',
		description: 'Мощный планшет с чипом M1, 10.9-дюймовым дисплеем Liquid Retina',
		price: 59990,
		discountedPrice: null,
		sku: 'IPA-M1-64-SPACE',
		photoUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 5,
		name: 'Умные часы Apple Watch Series 9',
		description: 'Самые продвинутые Apple Watch с чипом S9 и датчиком температуры',
		price: 39990,
		discountedPrice: 34990,
		sku: 'AWS9-45-GPS',
		photoUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 6,
		name: 'Игровая консоль PlayStation 5',
		description: 'Новейшая игровая консоль Sony с поддержкой 4K и ray tracing',
		price: 59990,
		discountedPrice: null,
		sku: 'PS5-DISC',
		photoUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 7,
		name: 'Беспроводная зарядка MagSafe',
		description: 'Магнитная беспроводная зарядка для iPhone с мощностью 15 Вт',
		price: 3990,
		discountedPrice: 2990,
		sku: 'MS-CHG-WHT',
		photoUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 8,
		name: 'Клавиатура Magic Keyboard',
		description: 'Беспроводная клавиатура с подсветкой клавиш и трекпадом',
		price: 12990,
		discountedPrice: null,
		sku: 'MK-INT-WHT',
		photoUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 9,
		name: 'Монитор 27" 4K',
		description: 'Профессиональный монитор с разрешением 4K и цветовым пространством P3',
		price: 89990,
		discountedPrice: 79990,
		sku: 'MON-27-4K-P3',
		photoUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 10,
		name: 'Веб-камера 4K',
		description: 'Высококачественная веб-камера с разрешением 4K и автофокусом',
		price: 19990,
		discountedPrice: 14990,
		sku: 'CAM-4K-AF',
		photoUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 11,
		name: 'Беспроводная мышь Magic Mouse',
		description: 'Элегантная беспроводная мышь с мультитач поверхностью',
		price: 7990,
		discountedPrice: null,
		sku: 'MM-WHT',
		photoUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 12,
		name: 'Внешний SSD 1TB',
		description: 'Быстрый внешний SSD с интерфейсом Thunderbolt 3 и скоростью до 2800 МБ/с',
		price: 24990,
		discountedPrice: 19990,
		sku: 'SSD-1TB-TB3',
		photoUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 13,
		name: 'Док-станция USB-C',
		description: 'Универсальная док-станция с портами USB-C, HDMI, Ethernet и кардридером',
		price: 15990,
		discountedPrice: null,
		sku: 'DOCK-USB-C-HDMI',
		photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 14,
		name: 'Игровая мышь RGB',
		description: 'Высокоточная игровая мышь с RGB подсветкой и 16000 DPI',
		price: 8990,
		discountedPrice: 6990,
		sku: 'GMOUSE-RGB-16K',
		photoUrl: 'https://images.unsplash.com/photo-1527814050087-379e5e0c0c4a?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 15,
		name: 'Механическая клавиатура',
		description: 'Профессиональная механическая клавиатура с переключателями Cherry MX',
		price: 12990,
		discountedPrice: null,
		sku: 'MKB-CHERRY-MX',
		photoUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 16,
		name: 'Настольная лампа с USB',
		description: 'Современная настольная лампа с USB-портами для зарядки устройств',
		price: 4990,
		discountedPrice: 3990,
		sku: 'LAMP-USB-LED',
		photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 17,
		name: 'Беспроводные колонки',
		description: 'Портативные Bluetooth колонки с водонепроницаемостью IPX7',
		price: 8990,
		discountedPrice: null,
		sku: 'SPK-BT-IPX7',
		photoUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 18,
		name: 'Подставка для ноутбука',
		description: 'Алюминиевая подставка для ноутбука с регулируемым углом наклона',
		price: 3990,
		discountedPrice: 2990,
		sku: 'STAND-AL-ADJ',
		photoUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 19,
		name: 'Кабель Lightning-USB-C',
		description: 'Оригинальный кабель Apple Lightning-USB-C длиной 1 метр',
		price: 1990,
		discountedPrice: null,
		sku: 'CBL-LT-USB-C-1M',
		photoUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
	{
		id: 20,
		name: 'Чехол для iPhone',
		description: 'Силиконовый чехол для iPhone с защитой от ударов и царапин',
		price: 2990,
		discountedPrice: 1990,
		sku: 'CASE-IPH-SIL-BLK',
		photoUrl: 'https://images.unsplash.com/photo-1601972602288-1e0b8b0b8b0b?w=400&h=400&fit=crop',
		createdAt: generateRandomDate(),
		updatedAt: generateRandomDate(),
	},
]

// Функция для получения пагинированных данных
export const getMockProducts = (params: {
	page?: number
	limit?: number
	sort?: string
	order?: 'ASC' | 'DESC'
	q?: string
	minPrice?: number
	maxPrice?: number
}): PaginatedResponse<Product> => {
	const {
		page = 1,
		limit = 12,
		sort = 'createdAt',
		order = 'DESC',
		q,
		minPrice,
		maxPrice
	} = params

	let filteredProducts = [...mockProducts]

	// Фильтрация по поисковому запросу
	if (q) {
		filteredProducts = filteredProducts.filter(product =>
			product.name.toLowerCase().includes(q.toLowerCase()) ||
			product.description?.toLowerCase().includes(q.toLowerCase()) ||
			product.sku.toLowerCase().includes(q.toLowerCase())
		)
	}

	// Фильтрация по цене
	if (minPrice !== undefined) {
		filteredProducts = filteredProducts.filter(product => product.price >= minPrice)
	}
	if (maxPrice !== undefined) {
		filteredProducts = filteredProducts.filter(product => product.price <= maxPrice)
	}

	// Сортировка
	filteredProducts.sort((a, b) => {
		let aValue: any = a[sort as keyof Product]
		let bValue: any = b[sort as keyof Product]

		if (sort === 'price' || sort === 'discountedPrice') {
			aValue = Number(aValue) || 0
			bValue = Number(bValue) || 0
		} else if (sort === 'createdAt' || sort === 'updatedAt') {
			aValue = new Date(aValue).getTime()
			bValue = new Date(bValue).getTime()
		} else {
			aValue = String(aValue).toLowerCase()
			bValue = String(bValue).toLowerCase()
		}

		if (order === 'ASC') {
			return aValue > bValue ? 1 : -1
		} else {
			return aValue < bValue ? 1 : -1
		}
	})

	// Пагинация
	const total = filteredProducts.length
	const startIndex = (page - 1) * limit
	const endIndex = startIndex + limit
	const data = filteredProducts.slice(startIndex, endIndex)

	return {
		data,
		total,
		page,
		limit
	}
}

// Функция для получения товара по ID
export const getMockProductById = (id: number): Product | undefined => {
	return mockProducts.find(product => product.id === id)
}
