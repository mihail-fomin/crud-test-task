import { useState } from 'react'
import { Button, Space, Modal, Form, Input, InputNumber, message } from 'antd'
import InfiniteProductsTable from '../components/InfiniteProductsTable'
import ApiModeToggle from '../components/ApiModeToggle'
import type { Product } from '../types/product'

export default function MainPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)
	const [viewingProduct, setViewingProduct] = useState<Product | null>(null)
	const [form] = Form.useForm()

	const handleAdd = () => {
		setEditingProduct(null)
		setViewingProduct(null)
		form.resetFields()
		setIsModalOpen(true)
	}

	const handleEdit = (product: Product) => {
		setEditingProduct(product)
		setViewingProduct(null)
		form.setFieldsValue(product)
		setIsModalOpen(true)
	}

	const handleView = (product: Product) => {
		setViewingProduct(product)
		setEditingProduct(null)
		form.setFieldsValue(product)
		setIsModalOpen(true)
	}

	const handleModalClose = () => {
		setIsModalOpen(false)
		setEditingProduct(null)
		setViewingProduct(null)
		form.resetFields()
	}

	const handleFormSubmit = async (values: any) => {
		try {
			console.log('Form submitted:', values)
			if (editingProduct) {
				message.success('Товар обновлен (мок)')
			} else {
				message.success('Товар создан (мок)')
			}
			handleModalClose()
		} catch (error) {
			message.error('Ошибка сохранения товара')
		}
	}

	return (
		<div className="space-y-6">
			<ApiModeToggle />
			
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
				<Form
					form={form}
					layout="vertical"
					onFinish={handleFormSubmit}
					disabled={!!viewingProduct}
				>
					<Form.Item
						label="Название"
						name="name"
						rules={[{ required: true, message: 'Укажите название товара' }]}
					>
						<Input />
					</Form.Item>
					
					<Form.Item
						label="Описание"
						name="description"
					>
						<Input.TextArea rows={3} />
					</Form.Item>
					
					<Form.Item
						label="Цена"
						name="price"
						rules={[{ required: true, message: 'Укажите цену' }]}
					>
						<InputNumber min={0} step={0.01} style={{ width: '100%' }} />
					</Form.Item>
					
					<Form.Item
						label="Цена со скидкой"
						name="discountedPrice"
					>
						<InputNumber min={0} step={0.01} style={{ width: '100%' }} />
					</Form.Item>
					
					<Form.Item
						label="Артикул"
						name="sku"
						rules={[{ required: true, message: 'Укажите артикул' }]}
					>
						<Input />
					</Form.Item>
					
					{!viewingProduct && (
						<Form.Item>
							<Space>
								<Button type="primary" htmlType="submit">
									{editingProduct ? 'Обновить' : 'Создать'}
								</Button>
								<Button onClick={handleModalClose}>
									Отмена
								</Button>
							</Space>
						</Form.Item>
					)}
				</Form>
			</Modal>
		</div>
	)
}
