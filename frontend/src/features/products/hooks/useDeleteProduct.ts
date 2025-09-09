import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message, Modal } from 'antd'
import React from 'react'
import { deleteProduct } from '../api'
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
}

export function useDeleteProduct(options?: UseDeleteProductOptions): UseDeleteProductReturn {
  const [deletingId, setDeletingId] = useState<number | null>(null)
	const queryClient = useQueryClient()

	const deleteProductMutation = useMutation({
		mutationFn: (id: number) => deleteProduct(id),
		onMutate: async (deletedId) => {
			// Устанавливаем состояние удаления для анимации
			setDeletingId(deletedId)
      console.log('deleteProductMutation')

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
			message.error('Ошибка удаления товара')
			setDeletingId(null)
			options?.onError?.(error)
		},
		onSettled: () => {
			// Всегда рефетчим после мутации
			queryClient.invalidateQueries({ queryKey: ['catalog-infinite'] })
		},
	})

	const handleDelete = useCallback((product: Product) => {
		console.log('useDeleteProduct handleDelete called', product)
		const confirmText = `Вы уверены, что хотите удалить товар "${product.name}"?`
		const skuText = `Артикул: ${product.sku}`
		const warningText = 'Это действие нельзя отменить.'
		
		Modal.confirm({
			title: 'Удалить товар?',
			content: React.createElement('div', null,
				React.createElement('p', null, confirmText),
				React.createElement('p', { 
					style: { color: '#666', fontSize: '14px', marginTop: '8px' } 
				}, skuText),
				React.createElement('p', { 
					style: { color: '#dc2626', fontSize: '14px', marginTop: '8px' } 
				}, warningText)
			),
			okText: 'Удалить',
			okButtonProps: { 
				danger: true,
				loading: deletingId === product.id
			},
			cancelText: 'Отмена',
			onOk: () => {
				console.log('Modal onOk called, calling mutation for product:', product.id)
				// Вызываем мутацию сразу после подтверждения
				deleteProductMutation.mutate(product.id)
			},
			width: 400,
		})
	}, [deleteProductMutation, deletingId])

	const cancelDelete = useCallback(() => {
		// Упрощенная функция отмены
		setDeletingId(null)
	}, [])

	return {
		deletingId,
		handleDelete,
		cancelDelete,
		isDeleting: deleteProductMutation.isPending,
		error: deleteProductMutation.error,
	}
}
