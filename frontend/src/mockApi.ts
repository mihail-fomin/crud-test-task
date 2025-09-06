import type { Product, PaginatedResponse } from './types/product'
import { getMockProducts, getMockProductById } from './mockData'

// Имитация задержки API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Мок API для каталога
export const mockFetchProducts = async (params: {
	page?: number
	limit?: number
	sort?: string
	order?: 'ASC' | 'DESC'
	q?: string
	minPrice?: number
	maxPrice?: number
}): Promise<PaginatedResponse<Product>> => {
	await delay(300) // Имитация задержки сети
	return getMockProducts(params)
}

// Мок API для получения товара по ID
export const mockFetchProductById = async (id: number): Promise<Product> => {
	await delay(200)
	const product = getMockProductById(id)
	if (!product) {
		throw new Error('Товар не найден')
	}
	return product
}

// Мок API для создания товара
export const mockCreateProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
	await delay(500)
	
	const newProduct: Product = {
		...productData,
		id: Date.now(), // Простой способ генерации ID
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	}
	
	return newProduct
}

// Мок API для обновления товара
export const mockUpdateProduct = async (id: number, productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product> => {
	await delay(400)
	
	const existingProduct = getMockProductById(id)
	if (!existingProduct) {
		throw new Error('Товар не найден')
	}
	
	const updatedProduct: Product = {
		...existingProduct,
		...productData,
		updatedAt: new Date().toISOString(),
	}
	
	return updatedProduct
}

// Мок API для удаления товара
export const mockDeleteProduct = async (id: number): Promise<void> => {
	await delay(300)
	
	const existingProduct = getMockProductById(id)
	if (!existingProduct) {
		throw new Error('Товар не найден')
	}
	
	// В реальном приложении здесь был бы запрос к серверу
	// В моке мы просто имитируем успешное удаление
}

// Мок API для загрузки фото товара
export const mockUploadProductPhoto = async (id: number, file: File): Promise<{ photoUrl: string }> => {
	await delay(1000) // Имитация загрузки файла
	
	const existingProduct = getMockProductById(id)
	if (!existingProduct) {
		throw new Error('Товар не найден')
	}
	
	// Имитация загрузки файла - возвращаем случайное изображение
	const photoUrl = `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=400&h=400&fit=crop`
	
	return { photoUrl }
}

// Мок API для удаления фото товара
export const mockDeleteProductPhoto = async (id: number): Promise<void> => {
	await delay(200)
	
	const existingProduct = getMockProductById(id)
	if (!existingProduct) {
		throw new Error('Товар не найден')
	}
	
	// В реальном приложении здесь был бы запрос к серверу
	// В моке мы просто имитируем успешное удаление
}
