import { api } from '../../lib/api'
import type { PaginatedResponse, Product } from '../../types/product'
import { generateMockProducts } from '../../data/mockProducts'
import { isMockMode, API_CONFIG } from '../../config/api'

// Функция для симуляции задержки API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function fetchProducts(params: {
	page?: number
	limit?: number
	sort?: string
	order?: 'ASC' | 'DESC'
	q?: string
	minPrice?: number
	maxPrice?: number
}): Promise<PaginatedResponse<Product>> {
	// Если используется мок режим
	if (isMockMode()) {
		// Симулируем задержку API
		await delay(API_CONFIG.MOCK_DELAY)
		
		const page = params.page || 1
		const limit = params.limit || 10
		const search = params.q || ''
		const sortBy = params.sort || 'id'
		const sortOrder = params.order || 'ASC'
		
		// Генерируем больше мок данных для пагинации
		let allProducts = generateMockProducts(100)
		
		// Применяем поиск
		if (search) {
			allProducts = allProducts.filter(product => 
				product.name.toLowerCase().includes(search.toLowerCase()) ||
				product.description?.toLowerCase().includes(search.toLowerCase()) ||
				product.sku.toLowerCase().includes(search.toLowerCase())
			)
		}
		
		// Применяем фильтрацию по цене
		if (params.minPrice !== undefined) {
			allProducts = allProducts.filter(product => product.price >= params.minPrice!)
		}
		if (params.maxPrice !== undefined) {
			allProducts = allProducts.filter(product => product.price <= params.maxPrice!)
		}
		
		// Применяем сортировку
		allProducts.sort((a, b) => {
			let aValue: any = a[sortBy as keyof Product]
			let bValue: any = b[sortBy as keyof Product]
			
			if (typeof aValue === 'string') {
				aValue = aValue.toLowerCase()
				bValue = bValue.toLowerCase()
			}
			
			if (sortOrder === 'DESC') {
				return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
			} else {
				return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
			}
		})
		
		// Применяем пагинацию
		const startIndex = (page - 1) * limit
		const endIndex = startIndex + limit
		const data = allProducts.slice(startIndex, endIndex)
		
		return {
			data,
			total: allProducts.length,
			page,
			limit
		}
	}
	
	// Реальный API запрос
	const { data } = await api.get('/products', { params })
	return data
}

export async function fetchProductsPage(params: {
	pageParam?: number
	limit?: number
	sort?: string
	order?: 'ASC' | 'DESC'
	q?: string
	minPrice?: number
	maxPrice?: number
}): Promise<PaginatedResponse<Product>> {
	const page = params.pageParam || 1
	return fetchProducts({ ...params, page })
}


