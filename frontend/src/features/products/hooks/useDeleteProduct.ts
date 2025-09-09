import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { deleteProduct } from '../api'
import type { Product } from '../../../types/product'

export function useDeleteProduct() {
	const [deleteModal, setDeleteModal] = useState<{ visible: boolean; product: Product | null }>({ 
		visible: false, 
		product: null 
	})
	const queryClient = useQueryClient()

	const deleteProductMutation = useMutation({
		mutationFn: (id: number) => {
			console.log('Удаляем товар с ID:', id);
			return deleteProduct(id);
		},
		onSuccess: async (_, deletedId) => {
			console.log('Товар успешно удален, обновляем кэш...', deletedId);
			message.success('Товар удален')
			
			// Обновляем все запросы каталога (с любыми параметрами)
			await queryClient.invalidateQueries({ 
				queryKey: ['catalog'],
				predicate: (query) => query.queryKey[0] === 'catalog'
			})
			await queryClient.invalidateQueries({ 
				queryKey: ['catalog-infinite'],
				predicate: (query) => query.queryKey[0] === 'catalog-infinite'
			})
			
			console.log('Кэш обновлен');
		},
		onError: (error) => {
			console.error('Ошибка удаления товара:', error);
			message.error('Ошибка удаления товара')
		},
	})

	const handleDelete = (product: Product) => {
		console.log('=== handleDelete вызвана ===');
		console.log('product: ', product);
		console.log('Открываем обычную модалку');
		setDeleteModal({ visible: true, product });
	}

	const handleDeleteConfirm = () => {
		if (deleteModal.product) {
			console.log('onOk вызван, удаляем товар:', deleteModal.product.id);
			deleteProductMutation.mutate(deleteModal.product.id);
			setDeleteModal({ visible: false, product: null });
		}
	}

	const handleDeleteCancel = () => {
		console.log('onCancel вызван');
		setDeleteModal({ visible: false, product: null });
	}

	return {
		deleteModal,
		handleDelete,
		handleDeleteConfirm,
		handleDeleteCancel,
		isDeleting: deleteProductMutation.isPending,
	}
}
