import { api } from '../../lib/api'
import type { PaginatedResponse, Product } from '../../types/product'

export async function fetchProducts(params: {
	page?: number
	limit?: number
	sort?: string
	order?: 'ASC' | 'DESC'
	q?: string
	minPrice?: number
	maxPrice?: number
}): Promise<PaginatedResponse<Product>> {
	const { data } = await api.get('/products', { params })
	return data
}



