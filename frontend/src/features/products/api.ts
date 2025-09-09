import { api } from '../../lib/api'
import type { Product } from '../../types/product'

export type ProductCreate = {
	name: string
	description?: string | null
	price: number
	discountedPrice?: number | null
	sku: string
}

export type ProductUpdate = Partial<ProductCreate> & { photoUrl?: string | null }

export async function fetchProduct(id: number): Promise<Product> {
	const response = await api.get<Product>(`/products/${id}`)
	return response.data
}

export async function createProduct(payload: ProductCreate): Promise<Product> {
	const response = await api.post<Product>('/products', payload)
	return response.data
}

export async function updateProduct(id: number, payload: ProductUpdate): Promise<Product> {
	const response = await api.put<Product>(`/products/${id}`, payload)
	return response.data
}

export async function deleteProduct(id: number): Promise<void> {
	await api.delete(`/products/${id}`)
}

export async function uploadProductPhoto(id: number, file: File): Promise<Product> {
	const form = new FormData()
	form.append('file', file)
	const response = await api.post<Product>(`/products/${id}/photo`, form)
	return response.data
}

export async function deleteProductPhoto(id: number): Promise<Product> {
	const response = await api.delete<Product>(`/products/${id}/photo`)
	return response.data
}


