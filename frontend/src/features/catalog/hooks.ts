import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts, fetchProductsPage } from './api'
import { useIsMockMode } from '../../hooks/useApiMode'

export function useCatalogQuery() {
	const [search] = useSearchParams()
	const isMockMode = useIsMockMode()
	const page = Number(search.get('page') || 1)
	const limit = Number(search.get('limit') || 12)
	const sort = search.get('sort') || 'createdAt'
	const order = (search.get('order') || 'DESC') as 'ASC' | 'DESC'
	const q = search.get('q') || undefined
	const minPrice = search.get('minPrice') ? Number(search.get('minPrice')) : undefined
	const maxPrice = search.get('maxPrice') ? Number(search.get('maxPrice')) : undefined

	return useQuery({
		queryKey: ['catalog', { page, limit, sort, order, q, minPrice, maxPrice, isMockMode }],
		queryFn: () => fetchProducts({ page, limit, sort, order, q, minPrice, maxPrice }, isMockMode),
	})
}

export function useInfiniteCatalogQuery() {
	const [search] = useSearchParams()
	const isMockMode = useIsMockMode()
	const limit = Number(search.get('limit') || 20)
	const sort = search.get('sort') || 'createdAt'
	const order = (search.get('order') || 'DESC') as 'ASC' | 'DESC'
	const q = search.get('q') || undefined
	const minPrice = search.get('minPrice') ? Number(search.get('minPrice')) : undefined
	const maxPrice = search.get('maxPrice') ? Number(search.get('maxPrice')) : undefined

	return useInfiniteQuery({
		queryKey: ['catalog-infinite', { limit, sort, order, q, minPrice, maxPrice, isMockMode }],
		queryFn: ({ pageParam }) => fetchProductsPage({ 
			pageParam, 
			limit, 
			sort, 
			order, 
			q, 
			minPrice, 
			maxPrice 
		}, isMockMode),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const totalPages = Math.ceil(lastPage.total / limit)
			return allPages.length < totalPages ? allPages.length + 1 : undefined
		},
	})
}


