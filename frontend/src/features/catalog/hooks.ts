import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts } from './api'


export function useInfiniteCatalogQuery() {
	const [search] = useSearchParams()
	const limit = Number(search.get('limit') || 12)
	const sort = search.get('sort') || 'createdAt'
	const order = (search.get('order') || 'DESC') as 'ASC' | 'DESC'
	const q = search.get('q') || undefined
	const minPrice = search.get('minPrice') ? Number(search.get('minPrice')) : undefined
	const maxPrice = search.get('maxPrice') ? Number(search.get('maxPrice')) : undefined

	return useInfiniteQuery({
		queryKey: ['catalog-infinite', { limit, sort, order, q, minPrice, maxPrice }],
		queryFn: ({ pageParam = 1 }) => 
			fetchProducts({ page: pageParam, limit, sort, order, q, minPrice, maxPrice }),
		getNextPageParam: (lastPage) => {
			if (lastPage.page < lastPage.totalPages) {
				return lastPage.page + 1
			}
			return undefined
		},
		initialPageParam: 1,
	})
}



