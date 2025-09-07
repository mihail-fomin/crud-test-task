import { useState } from 'react'
import { Card, Typography, Space, Button, Modal } from 'antd'
import MockDataDemo from '../components/MockDataDemo'
import type { Product } from '../types/product'

const { Title } = Typography

export default function MockDataPage() {
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
	const [isEditModalVisible, setIsEditModalVisible] = useState(false)
	const [isViewModalVisible, setIsViewModalVisible] = useState(false)

	const handleEdit = (product: Product) => {
		setSelectedProduct(product)
		setIsEditModalVisible(true)
	}

	const handleView = (product: Product) => {
		setSelectedProduct(product)
		setIsViewModalVisible(true)
	}

	const handleCloseModals = () => {
		setIsEditModalVisible(false)
		setIsViewModalVisible(false)
		setSelectedProduct(null)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="mb-6">
				<Title level={2}>Демонстрация мок данных</Title>
				<p className="text-gray-600 mb-4">
					Эта страница демонстрирует работу с мок данными для товаров. 
					Вы можете переключаться между обычной пагинацией и бесконечным скроллом.
				</p>
				<Space>
					<Button type="primary" href="/">
						Вернуться на главную
					</Button>
				</Space>
			</Card>

			<MockDataDemo onEdit={handleEdit} onView={handleView} />

			{/* Модальное окно для просмотра товара */}
			<Modal
				title="Просмотр товара"
				open={isViewModalVisible}
				onCancel={handleCloseModals}
				footer={[
					<Button key="close" onClick={handleCloseModals}>
						Закрыть
					</Button>,
					<Button key="edit" type="primary" onClick={() => {
						setIsViewModalVisible(false)
						setIsEditModalVisible(true)
					}}>
						Редактировать
					</Button>
				]}
			>
				{selectedProduct && (
					<div className="space-y-4">
						<div>
							<strong>ID:</strong> {selectedProduct.id}
						</div>
						<div>
							<strong>Название:</strong> {selectedProduct.name}
						</div>
						<div>
							<strong>SKU:</strong> {selectedProduct.sku}
						</div>
						<div>
							<strong>Цена:</strong> {selectedProduct.price} ₽
							{selectedProduct.discountedPrice && (
								<span className="text-red-500 ml-2">
									(со скидкой: {selectedProduct.discountedPrice} ₽)
								</span>
							)}
						</div>
						{selectedProduct.description && (
							<div>
								<strong>Описание:</strong> {selectedProduct.description}
							</div>
						)}
						{selectedProduct.photoUrl && (
							<div>
								<strong>Фото:</strong>
								<img 
									src={selectedProduct.photoUrl} 
									alt={selectedProduct.name}
									className="w-32 h-32 object-cover rounded mt-2"
								/>
							</div>
						)}
						<div>
							<strong>Создан:</strong> {new Date(selectedProduct.createdAt).toLocaleString('ru-RU')}
						</div>
						<div>
							<strong>Обновлен:</strong> {new Date(selectedProduct.updatedAt).toLocaleString('ru-RU')}
						</div>
					</div>
				)}
			</Modal>

			{/* Модальное окно для редактирования товара */}
			<Modal
				title="Редактирование товара (мок)"
				open={isEditModalVisible}
				onCancel={handleCloseModals}
				footer={[
					<Button key="cancel" onClick={handleCloseModals}>
						Отмена
					</Button>,
					<Button key="save" type="primary" onClick={() => {
						// В реальном приложении здесь был бы вызов API
						handleCloseModals()
					}}>
						Сохранить
					</Button>
				]}
			>
				{selectedProduct && (
					<div className="space-y-4">
						<p className="text-gray-600">
							В демонстрационном режиме редактирование не реализовано. 
							В реальном приложении здесь была бы форма для редактирования товара.
						</p>
						<div>
							<strong>Товар:</strong> {selectedProduct.name}
						</div>
						<div>
							<strong>ID:</strong> {selectedProduct.id}
						</div>
					</div>
				)}
			</Modal>
		</div>
	)
}
