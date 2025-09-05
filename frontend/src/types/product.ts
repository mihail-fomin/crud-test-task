export interface Product {
	id: number
	name: string
	description?: string | null
	price: number
	discountedPrice?: number | null
	sku: string
	photoUrl?: string | null
	createdAt: string
	updatedAt: string
}

export interface PaginatedResponse<T> {
	data: T[]
	total: number
	page: number
	limit: number
}


