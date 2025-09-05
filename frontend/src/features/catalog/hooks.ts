import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts } from './api'

export function useCatalogQuery() {
	const [search] = useSearchParams()
	const page = Number(search.get('page') || 1)
	const limit = Number(search.get('limit') || 12)
	const sort = search.get('sort') || 'createdAt'
	const order = (search.get('order') || 'DESC') as 'ASC' | 'DESC'
	const q = search.get('q') || undefined
	const minPrice = search.get('minPrice') ? Number(search.get('minPrice')) : undefined
	const maxPrice = search.get('maxPrice') ? Number(search.get('maxPrice')) : undefined

	return useQuery({
		queryKey: ['catalog', { page, limit, sort, order, q, minPrice, maxPrice }],
		queryFn: () => fetchProducts({ page, limit, sort, order, q, minPrice, maxPrice }),
	})
}


