import { useState } from 'react'
import { Button, Modal } from 'antd'
import { ProductForm } from '../features/admin/ProductForm'
import InfiniteProductsTable from '../components/InfiniteProductsTable'
import type { Product } from '../types/product'

export default function MainPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

	const handleAdd = () => {
		setEditingProduct(null)
		setIsModalOpen(true)
	}

	const handleEdit = (product: Product) => {
		setEditingProduct(product)
		setIsModalOpen(true)
	}

	const handleView = (product: Product) => {
		setSelectedProduct(product)
	}

	const handleFormSuccess = () => {
		setIsModalOpen(false)
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold text-gray-900">Каталог товаров</h1>
				<Button type="primary" size="large" onClick={handleAdd}>
					Добавить товар
				</Button>
			</div>

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
				<ProductForm product={editingProduct} onSuccess={handleFormSuccess} />
			</Modal>

			<Modal
				title="Информация о товаре"
				open={!!selectedProduct}
				onCancel={() => setSelectedProduct(null)}
				footer={null}
				width={600}
			>
				{selectedProduct && (
					<div className="space-y-4">
						{selectedProduct.photoUrl && (
							<img 
								src={selectedProduct.photoUrl} 
								alt={selectedProduct.name}
								className="w-full h-64 object-cover rounded-lg"
							/>
						)}
						<div>
							<h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
							<p className="text-gray-600">SKU: {selectedProduct.sku}</p>
							<div className="flex items-center gap-2 mt-2">
								<span className="text-2xl font-bold text-blue-600">
									{selectedProduct.price} ₽
								</span>
								{selectedProduct.discountedPrice != null && (
									<span className="text-xl text-red-500 line-through">
										{selectedProduct.discountedPrice} ₽
									</span>
								)}
							</div>
							{selectedProduct.description && (
								<p className="mt-4 text-gray-700 whitespace-pre-wrap">
									{selectedProduct.description}
								</p>
							)}
						</div>
					</div>
				)}
			</Modal>
		</div>
	)
}
