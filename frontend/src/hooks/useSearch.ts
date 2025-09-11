import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useSearch() {
	const [searchParams, setSearchParams] = useSearchParams()
	const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')

	// Debounced поиск
	const debouncedSearch = useCallback(
		(value: string) => {
			setSearchParams(prev => {
				const newSearchParams = new URLSearchParams(prev)
				if (value.trim()) {
					newSearchParams.set('q', value.trim())
				} else {
					newSearchParams.delete('q')
				}
				return newSearchParams
			})
		},
		[setSearchParams]
	)

	// Обработка поиска с debounce
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			debouncedSearch(searchTerm)
		}, 500) // 500ms debounce

		return () => clearTimeout(timeoutId)
	}, [searchTerm, debouncedSearch])

	// Обработка немедленного поиска при нажатии Enter
	const handleSearchSubmit = useCallback((value: string) => {
		setSearchTerm(value)
		debouncedSearch(value)
	}, [debouncedSearch])

	// Обработка изменения поля ввода
	const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value)
	}, [])

	// Синхронизация только при инициализации компонента
	useEffect(() => {
		const urlSearchTerm = searchParams.get('q') || ''
		setSearchTerm(urlSearchTerm)
	}, []) // Только при монтировании компонента

	return {
		searchTerm,
		handleSearchChange,
		handleSearchSubmit,
	}
}
