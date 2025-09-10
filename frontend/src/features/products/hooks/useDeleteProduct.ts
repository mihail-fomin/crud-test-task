import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { deleteProduct as deleteProductApi } from '../api'
import { showErrorNotification } from '../../../utils/errorHandler'
import type { Product } from '../../../types/product'

interface UseDeleteProductOptions {
	onSuccess?: () => void
	onError?: (error: Error) => void
}

interface UseDeleteProductReturn {
	deletingId: number | null
	handleDelete: (product: Product) => void
	cancelDelete: () => void
	isDeleting: boolean
	error: Error | null
	showDeleteModal: boolean
	deleteProduct: Product | null
	confirmDelete: () => void
}

export function useDeleteProduct(options?: UseDeleteProductOptions): UseDeleteProductReturn {
  const [deletingId, setDeletingId] = useState<number | null>(null)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
	const queryClient = useQueryClient()

	const deleteProductMutation = useMutation({
		mutationFn: (id: number) => deleteProductApi(id),
		onMutate: async (deletedId) => {
			// Устанавливаем состояние удаления для анимации
			setDeletingId(deletedId)
			console.log('deleteProductMutation onMutate for id:', deletedId)

			// Отменяем любые исходящие рефетчи
			await queryClient.cancelQueries({ queryKey: ['catalog-infinite'] })

			// Сохраняем предыдущее значение
			const previousData = queryClient.getQueryData(['catalog-infinite'])

			// Оптимистично обновляем данные
			queryClient.setQueryData(['catalog-infinite'], (old: any) => {
				if (!old) return old
				
				return {
					...old,
					pages: old.pages.map((page: any) => ({
						...page,
						data: page.data.filter((product: Product) => product.id !== deletedId)
					}))
				}
			})

			return { previousData }
		},
		onSuccess: () => {
			message.success('Товар удален')
			setDeletingId(null)
			options?.onSuccess?.()
		},
		onError: (error, _, context) => {
			// Восстанавливаем предыдущее состояние при ошибке
			if (context?.previousData) {
				queryClient.setQueryData(['catalog-infinite'], context.previousData)
			}
			
			// Показываем улучшенное уведомление об ошибке
			showErrorNotification(error, () => {
				if (deleteProduct) {
					deleteProductMutation.mutate(deleteProduct.id)
				}
			})
			
			setDeletingId(null)
			options?.onError?.(error)
		},
		onSettled: () => {
			// Всегда рефетчим после мутации
			queryClient.invalidateQueries({ queryKey: ['catalog-infinite'] })
		},
	})

	const handleDelete = useCallback((product: Product) => {
		setDeleteProduct(product)
		setShowDeleteModal(true)
	}, [])

	const confirmDelete = useCallback(() => {
		if (deleteProduct) {
			console.log('confirmDelete called for product:', deleteProduct.id)
			setShowDeleteModal(false)
			deleteProductMutation.mutate(deleteProduct.id)
		}
	}, [deleteProduct, deleteProductMutation])

	const cancelDelete = useCallback(() => {
		setShowDeleteModal(false)
		setDeleteProduct(null)
		setDeletingId(null)
	}, [])

	return {
		deletingId,
		handleDelete,
		cancelDelete,
		isDeleting: deleteProductMutation.isPending,
		error: deleteProductMutation.error,
		showDeleteModal,
		deleteProduct,
		confirmDelete,
	}
}
