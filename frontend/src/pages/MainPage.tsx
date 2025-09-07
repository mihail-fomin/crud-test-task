import { useState } from 'react'
import { Button, Space, Modal } from 'antd'
import ProductsCatalog from '../components/ProductsCatalog'
import ProductForm from '../components/ProductForm'
import type { Product } from '../types/product'

export default function MainPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)
	const [viewingProduct, setViewingProduct] = useState<Product | null>(null)

	const handleAdd = () => {
		setEditingProduct(null)
		setViewingProduct(null)
		setIsModalOpen(true)
	}

	const handleEdit = (product: Product) => {
		setEditingProduct(product)
		setViewingProduct(null)
		setIsModalOpen(true)
	}

	const handleView = (product: Product) => {
		setViewingProduct(product)
		setEditingProduct(null)
		setIsModalOpen(true)
	}

	const handleModalClose = () => {
		setIsModalOpen(false)
		setEditingProduct(null)
		setViewingProduct(null)
	}

	const handleFormSuccess = () => {
		handleModalClose()
		// Обновляем каталог товаров
		window.location.reload()
	}


	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold text-gray-900">Каталог товаров</h1>
				<Space>
					<Button type="primary" size="large" onClick={handleAdd}>
						Добавить товар
					</Button>
				</Space>
			</div>

			<ProductsCatalog 
				onEdit={handleEdit}
				onView={handleView}
			/>

			<Modal
				title={editingProduct ? 'Редактировать товар' : viewingProduct ? 'Просмотр товара' : 'Добавить товар'}
				open={isModalOpen}
				onCancel={handleModalClose}
				footer={null}
				width={800}
			>
				<ProductForm
					product={editingProduct || viewingProduct}
					onSuccess={handleFormSuccess}
					onCancel={handleModalClose}
					mode={viewingProduct ? 'view' : editingProduct ? 'edit' : 'create'}
				/>
			</Modal>
		</div>
	)
}
