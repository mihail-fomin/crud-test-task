import { api } from '../../lib/api'
import type { Product } from '../../types/product'
import { generateMockProducts } from '../../data/mockProducts'

// Функция для симуляции задержки API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export type ProductCreate = {
	name: string
	description?: string | null
	price: number
	discountedPrice?: number | null
	sku: string
}

export type ProductUpdate = Partial<ProductCreate> & { photoUrl?: string | null }

export async function fetchProduct(id: number): Promise<Product> {
	// Симулируем задержку API
	await delay(300)
	
	// Генерируем мок данные
	const allProducts = generateMockProducts(100)
	const product = allProducts.find(p => p.id === id)
	
	if (!product) {
		throw new Error(`Product with id ${id} not found`)
	}
	
	return product
}

export async function createProduct(payload: ProductCreate): Promise<Product> {
	const { data } = await api.post('/products', payload)
	return data
}

export async function updateProduct(id: number, payload: ProductUpdate): Promise<Product> {
	const { data } = await api.put(`/products/${id}`, payload)
	return data
}

export async function deleteProduct(id: number): Promise<void> {
	await api.delete(`/products/${id}`)
}

export async function uploadProductPhoto(id: number, file: File): Promise<Product> {
	const form = new FormData()
	form.append('file', file)
	const { data } = await api.post(`/products/${id}/photo`, form, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})
	return data
}

export async function deleteProductPhoto(id: number): Promise<Product> {
	const { data } = await api.delete(`/products/${id}/photo`)
	return data
}


