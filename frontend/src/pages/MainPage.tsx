import { useState } from 'react'
import { Button, Modal } from 'antd'
import { useQueryClient } from '@tanstack/react-query'
import ProductsCatalog from '../components/ProductsCatalog'
import ProductForm from '../components/ProductForm'
import type { Product } from '../types/product'
import styles from './MainPage.module.scss'

export default function MainPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)
	const queryClient = useQueryClient()

	const handleAdd = () => {
		setEditingProduct(null)
		setIsModalOpen(true)
	}

	const handleEdit = (product: Product) => {
		setEditingProduct(product)
		setIsModalOpen(true)
	}


	const handleModalClose = () => {
		setIsModalOpen(false)
		setEditingProduct(null)
	}

	const handleDataChange = () => {
		// Инвалидируем кэш каталога для автоматического обновления данных
		queryClient.invalidateQueries({ queryKey: ['catalog-infinite'] })
		queryClient.invalidateQueries({ queryKey: ['catalog'] })
	}

	const handleFormSuccess = () => {
		handleModalClose()
	}


	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>Каталог товаров</h1>
				<div className={styles.buttonGroup}>
					<Button type="primary" size="large" onClick={handleAdd}>
						Добавить товар
					</Button>
				</div>
			</div>

			<ProductsCatalog 
				onEdit={handleEdit}
			/>

			<Modal
				title={editingProduct ? 'Редактировать товар' : 'Добавить товар'}
				open={isModalOpen}
				onCancel={handleModalClose}
				footer={null}
				width={800}
			>
				<ProductForm
					product={editingProduct}
					onSuccess={handleFormSuccess}
					onCancel={handleModalClose}
					mode={editingProduct ? 'edit' : 'create'}
					onDataChange={handleDataChange}
				/>
			</Modal>
		</div>
	)
}
