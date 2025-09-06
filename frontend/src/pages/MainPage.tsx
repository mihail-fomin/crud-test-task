import { useState } from 'react'
import { Button, Modal, Space } from 'antd'
import { ProductForm } from '../features/admin/ProductForm'
import InfiniteProductsTable from '../components/InfiniteProductsTable'
import MockDataPreview from '../components/MockDataPreview'
import type { Product } from '../types/product'

export default function MainPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)

	const handleAdd = () => {
		setEditingProduct(null)
		setIsModalOpen(true)
	}

	const handleEdit = (product: Product) => {
		setEditingProduct(product)
		setIsModalOpen(true)
	}

	const handleView = (product: Product) => {
		// Теперь используется навигация на отдельную страницу
		console.log('View product:', product)
	}

	const handleFormSubmit = async (values: any) => {
		// В реальном приложении здесь был бы вызов API
		console.log('Form submitted:', values)
		setIsModalOpen(false)
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold text-gray-900">Каталог товаров</h1>
				<Space>
					<Button size="large" href="/mock-data">
						Демо мок данных
					</Button>
					<Button type="primary" size="large" onClick={handleAdd}>
						Добавить товар
					</Button>
				</Space>
			</div>

			<MockDataPreview onEdit={handleEdit} onView={handleView} />

			<InfiniteProductsTable 
				onEdit={handleEdit}
				onView={handleView}
			/>

			<Modal
				title={editingProduct ? 'Редактировать товар' : 'Добавить товар'}
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				footer={null}
				width={600}
			>
				<ProductForm 
					defaultValues={editingProduct || undefined} 
					onSubmit={handleFormSubmit} 
				/>
			</Modal>

		</div>
	)
}
