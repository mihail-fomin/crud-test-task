import { useEffect, useRef, useState } from 'react'

interface UseInfiniteScrollOptions {
	hasNextPage: boolean
	isFetchingNextPage: boolean
	fetchNextPage: () => void
	threshold?: number // Расстояние от низа страницы до триггера (в пикселях)
}

export function useInfiniteScroll({
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
	threshold = 300,
}: UseInfiniteScrollOptions) {
	const loadMoreRef = useRef<HTMLDivElement>(null)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage || isLoading) return

			const rect = loadMoreRef.current.getBoundingClientRect()
			if (rect.top <= window.innerHeight + threshold) {
				setIsLoading(true)
				fetchNextPage()
			}
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, threshold])

	useEffect(() => {
		if (!isFetchingNextPage && isLoading) {
			setIsLoading(false)
		}
	}, [isFetchingNextPage, isLoading])

	return {
		loadMoreRef,
		isLoading: isLoading,
	}
}
