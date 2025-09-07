import { useState } from 'react'
import { Button, Space, Modal } from 'antd'
import InfiniteProductsTable from '../components/InfiniteProductsTable'
import { ProductForm } from '../features/admin/ProductForm'
import type { Product } from '../types/product'

export default function MainPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)
	const [viewingProduct, setViewingProduct] = useState<Product | null>(null)

	const handleAdd = () => {
		setEditingProduct(null)
		setIsModalOpen(true)
	}

	const handleEdit = (product: Product) => {
		setEditingProduct(product)
		setIsModalOpen(true)
	}

	const handleView = (product: Product) => {
		setViewingProduct(product)
		setIsModalOpen(true)
	}

	const handleModalClose = () => {
		setIsModalOpen(false)
		setEditingProduct(null)
		setViewingProduct(null)
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

			<InfiniteProductsTable 
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
					defaultValues={editingProduct || undefined}
					onSubmit={async (values) => {
						console.log('Form submitted:', values)
						handleModalClose()
					}}
					submitting={false}
					readOnly={!!viewingProduct}
				/>
			</Modal>
		</div>
	)
}
