import { api } from '../../lib/api'
import { Product } from '../../types/product'

export type ProductCreate = {
	name: string
	description?: string | null
	price: number
	discountedPrice?: number | null
	sku: string
}

export type ProductUpdate = Partial<ProductCreate> & { photoUrl?: string | null }

export async function fetchProduct(id: number): Promise<Product> {
	const { data } = await api.get(`/products/${id}`)
	return data
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


