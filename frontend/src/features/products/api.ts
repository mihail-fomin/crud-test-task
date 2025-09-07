import { api } from '../../lib/api'
import type { Product } from '../../types/product'
import { generateMockProducts } from '../../data/mockProducts'
import { API_CONFIG } from '../../config/api'

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

export async function fetchProduct(id: number, isMockMode: boolean = false): Promise<Product> {
	// Если используется мок режим
	if (isMockMode) {
		// Симулируем задержку API
		await delay(API_CONFIG.MOCK_DELAY)
		
		// Генерируем мок данные
		const allProducts = generateMockProducts(100)
		const product = allProducts.find(p => p.id === id)
		
		if (!product) {
			throw new Error(`Product with id ${id} not found`)
		}
		
		return product
	}
	
	// Реальный API запрос
	const { data } = await api.get(`/products/${id}`)
	return data
}

export async function createProduct(payload: ProductCreate, isMockMode: boolean = false): Promise<Product> {
	if (isMockMode) {
		await delay(API_CONFIG.MOCK_DELAY)
		// В мок режиме просто возвращаем новый товар с ID
		const newProduct: Product = {
			id: Date.now(), // Простой способ генерации ID
			...payload,
			photoUrl: null,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}
		return newProduct
	}
	
	const { data } = await api.post('/products', payload)
	return data
}

export async function updateProduct(id: number, payload: ProductUpdate, isMockMode: boolean = false): Promise<Product> {
	if (isMockMode) {
		await delay(API_CONFIG.MOCK_DELAY)
		// В мок режиме возвращаем обновленный товар
		const allProducts = generateMockProducts(100)
		const existingProduct = allProducts.find(p => p.id === id)
		if (!existingProduct) {
			throw new Error(`Product with id ${id} not found`)
		}
		return { ...existingProduct, ...payload, updatedAt: new Date().toISOString() }
	}
	
	const { data } = await api.put(`/products/${id}`, payload)
	return data
}

export async function deleteProduct(id: number, isMockMode: boolean = false): Promise<void> {
	if (isMockMode) {
		await delay(API_CONFIG.MOCK_DELAY)
		// В мок режиме просто симулируем удаление
		return
	}
	
	await api.delete(`/products/${id}`)
}

export async function uploadProductPhoto(id: number, file: File, isMockMode: boolean = false): Promise<Product> {
	if (isMockMode) {
		await delay(API_CONFIG.MOCK_DELAY)
		// В мок режиме симулируем загрузку фото
		const allProducts = generateMockProducts(100)
		const existingProduct = allProducts.find(p => p.id === id)
		if (!existingProduct) {
			throw new Error(`Product with id ${id} not found`)
		}
		return { 
			...existingProduct, 
			photoUrl: `/uploads/mock-${id}-${file.name}`,
			updatedAt: new Date().toISOString() 
		}
	}
	
	const form = new FormData()
	form.append('file', file)
	const { data } = await api.post(`/products/${id}/photo`, form, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})
	return data
}

export async function deleteProductPhoto(id: number, isMockMode: boolean = false): Promise<Product> {
	if (isMockMode) {
		await delay(API_CONFIG.MOCK_DELAY)
		// В мок режиме симулируем удаление фото
		const allProducts = generateMockProducts(100)
		const existingProduct = allProducts.find(p => p.id === id)
		if (!existingProduct) {
			throw new Error(`Product with id ${id} not found`)
		}
		return { 
			...existingProduct, 
			photoUrl: null,
			updatedAt: new Date().toISOString() 
		}
	}
	
	const { data } = await api.delete(`/products/${id}/photo`)
	return data
}


