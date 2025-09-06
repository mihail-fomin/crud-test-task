import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { 
	mockFetchProducts, 
	mockFetchProductById, 
	mockCreateProduct, 
	mockUpdateProduct, 
	mockDeleteProduct,
	mockUploadProductPhoto,
	mockDeleteProductPhoto
} from '../mockApi'
import type { Product } from '../types/product'

// Хук для обычного каталога с мок данными
export function useMockCatalogQuery() {
	const [search] = useSearchParams()
	const page = Number(search.get('page') || 1)
	const limit = Number(search.get('limit') || 12)
	const sort = search.get('sort') || 'createdAt'
	const order = (search.get('order') || 'DESC') as 'ASC' | 'DESC'
	const q = search.get('q') || undefined
	const minPrice = search.get('minPrice') ? Number(search.get('minPrice')) : undefined
	const maxPrice = search.get('maxPrice') ? Number(search.get('maxPrice')) : undefined

	return useQuery({
		queryKey: ['mock-catalog', { page, limit, sort, order, q, minPrice, maxPrice }],
		queryFn: () => mockFetchProducts({ page, limit, sort, order, q, minPrice, maxPrice }),
	})
}

// Хук для бесконечного каталога с мок данными
export function useMockInfiniteCatalogQuery() {
	const [search] = useSearchParams()
	const limit = Number(search.get('limit') || 20)
	const sort = search.get('sort') || 'createdAt'
	const order = (search.get('order') || 'DESC') as 'ASC' | 'DESC'
	const q = search.get('q') || undefined
	const minPrice = search.get('minPrice') ? Number(search.get('minPrice')) : undefined
	const maxPrice = search.get('maxPrice') ? Number(search.get('maxPrice')) : undefined

	return useInfiniteQuery({
		queryKey: ['mock-catalog-infinite', { limit, sort, order, q, minPrice, maxPrice }],
		queryFn: ({ pageParam }) => mockFetchProducts({ 
			page: pageParam, 
			limit, 
			sort, 
			order, 
			q, 
			minPrice, 
			maxPrice 
		}),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const totalPages = Math.ceil(lastPage.total / limit)
			return allPages.length < totalPages ? allPages.length + 1 : undefined
		},
	})
}

// Хук для получения товара по ID с мок данными
export function useMockProductQuery(id: number) {
	return useQuery({
		queryKey: ['mock-product', id],
		queryFn: () => mockFetchProductById(id),
		enabled: !!id,
	})
}

// Хук для создания товара с мок данными
export function useMockCreateProduct() {
	const queryClient = useQueryClient()
	
	return useMutation({
		mutationFn: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => 
			mockCreateProduct(productData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['mock-catalog'] })
			queryClient.invalidateQueries({ queryKey: ['mock-catalog-infinite'] })
		},
	})
}

// Хук для обновления товара с мок данными
export function useMockUpdateProduct() {
	const queryClient = useQueryClient()
	
	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>> }) => 
			mockUpdateProduct(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['mock-catalog'] })
			queryClient.invalidateQueries({ queryKey: ['mock-catalog-infinite'] })
			queryClient.invalidateQueries({ queryKey: ['mock-product', id] })
		},
	})
}

// Хук для удаления товара с мок данными
export function useMockDeleteProduct() {
	const queryClient = useQueryClient()
	
	return useMutation({
		mutationFn: (id: number) => mockDeleteProduct(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['mock-catalog'] })
			queryClient.invalidateQueries({ queryKey: ['mock-catalog-infinite'] })
		},
	})
}

// Хук для загрузки фото товара с мок данными
export function useMockUploadProductPhoto() {
	const queryClient = useQueryClient()
	
	return useMutation({
		mutationFn: ({ id, file }: { id: number; file: File }) => 
			mockUploadProductPhoto(id, file),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['mock-catalog'] })
			queryClient.invalidateQueries({ queryKey: ['mock-catalog-infinite'] })
			queryClient.invalidateQueries({ queryKey: ['mock-product', id] })
		},
	})
}

// Хук для удаления фото товара с мок данными
export function useMockDeleteProductPhoto() {
	const queryClient = useQueryClient()
	
	return useMutation({
		mutationFn: (id: number) => mockDeleteProductPhoto(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ['mock-catalog'] })
			queryClient.invalidateQueries({ queryKey: ['mock-catalog-infinite'] })
			queryClient.invalidateQueries({ queryKey: ['mock-product', id] })
		},
	})
}
