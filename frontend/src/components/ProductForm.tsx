import { Form, Input, InputNumber, Button, Space, message, Upload } from 'antd'
import { useState, useEffect } from 'react'
import { createProduct, updateProduct, uploadProductPhoto, type ProductCreate, type ProductUpdate } from '../features/products/api'
import { showErrorNotification } from '../utils/errorHandler'
import { useErrorModal } from '../hooks/useErrorModal.tsx'
import type { Product } from '../types/product'

interface ProductFormProps {
	product?: Product | null
	onSuccess?: () => void
	onCancel?: () => void
	mode?: 'create' | 'edit' | 'view'
	onDataChange?: () => void // Callback для обновления данных
}

export default function ProductForm({ 
	product, 
	onSuccess, 
	onCancel, 
	mode = 'create',
	onDataChange
}: ProductFormProps) {
	const [form] = Form.useForm()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [uploadingPhoto, setUploadingPhoto] = useState(false)
	
	// Используем хук для обработки ошибок
	const { showErrorModal, ModalComponent } = useErrorModal()

	// Сбрасываем форму при изменении продукта или режима
	useEffect(() => {
		if (mode === 'create' || !product) {
			// При создании нового товара сбрасываем форму
			form.resetFields()
		} else if (product) {
			// При редактировании устанавливаем значения продукта
			form.setFieldsValue({
				name: product.name,
				description: product.description,
				price: product.price,
				discountedPrice: product.discountedPrice,
				sku: product.sku,
			})
		}
	}, [product, mode, form])


	const handlePhotoUpload = async (file: File, productId: number) => {
		setUploadingPhoto(true)
		try {
			await uploadProductPhoto(productId, file)
			message.success('Фото загружено')
		} catch (error: any) {
			console.log('Ошибка загрузки фото:', error)
			// Показываем модалку с ошибкой
			showErrorModal({
				message: error.response?.data?.message || error.message || 'Ошибка загрузки файла',
				status: error.response?.status
			})
			// Также показываем уведомление для совместимости
			showErrorNotification(error, () => {
				handlePhotoUpload(file, productId)
			})
		} finally {
			setUploadingPhoto(false)
		}
	}

	const handleSubmit = async (values: any) => {
		setIsSubmitting(true)
		try {
			if (mode === 'edit' && product) {
				// Обновление существующего товара
				const updateData: ProductUpdate = {
					name: values.name,
					description: values.description || null,
					price: values.price,
					discountedPrice: values.discountedPrice || null,
					sku: values.sku,
				}
				
			await updateProduct(product.id, updateData)
			message.success('Товар обновлен')
		} else {
			// Создание нового товара
			const createData: ProductCreate = {
				name: values.name,
				description: values.description || null,
				price: values.price,
				discountedPrice: values.discountedPrice || null,
				sku: values.sku,
			}
			
			await createProduct(createData)
			message.success('Товар создан')
		}
		
		// Сбрасываем форму после успешного сохранения
		form.resetFields()
		
		// Вызываем callback для обновления данных
		onDataChange?.()
		onSuccess?.()
		} catch (error: any) {
			console.error('Ошибка сохранения товара:', error)
			
			// Показываем модалку с ошибкой
			showErrorModal({
				message: error.response?.data?.message || error.message || 'Ошибка сохранения товара',
				status: error.response?.status
			})
			
			// Также показываем уведомление для совместимости
			showErrorNotification(error, () => {
				handleSubmit(values)
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Form
			key={product?.id || 'new'}
			form={form}
			layout="vertical"
			onFinish={handleSubmit}
			disabled={mode === 'view'}
			initialValues={product ? {
				name: product.name,
				description: product.description,
				price: product.price,
				discountedPrice: product.discountedPrice,
				sku: product.sku,
			} : undefined}
		>
			<Form.Item
				label="Название"
				name="name"
				rules={[{ required: true, message: 'Укажите название товара' }]}
			>
				<Input placeholder="Введите название товара" />
			</Form.Item>
			
			<Form.Item
				label="Описание"
				name="description"
			>
				<Input.TextArea 
					rows={3} 
					placeholder="Введите описание товара (необязательно)"
				/>
			</Form.Item>
			
			<Form.Item
				label="Цена"
				name="price"
				rules={[
					{ required: true, message: 'Укажите цену' },
					{ type: 'number', min: 0, message: 'Цена должна быть больше 0' }
				]}
			>
				<InputNumber 
					min={0} 
					step={0.01} 
					style={{ width: '100%' }} 
					placeholder="0.00"
					formatter={value => `₽ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					parser={value => value!.replace(/₽\s?|(,*)/g, '') as any}
				/>
			</Form.Item>
			
			<Form.Item
				label="Цена со скидкой"
				name="discountedPrice"
				rules={[
					{ type: 'number', min: 0, message: 'Цена со скидкой должна быть больше 0' },
					({ getFieldValue }) => ({
						validator(_, value) {
							const price = getFieldValue('price')
							if (!value || !price || value <= price) {
								return Promise.resolve()
							}
							return Promise.reject(new Error('Цена со скидкой должна быть меньше обычной цены'))
						},
					}),
				]}
			>
				<InputNumber 
					min={0} 
					step={0.01} 
					style={{ width: '100%' }} 
					placeholder="0.00"
					formatter={value => `₽ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					parser={value => value!.replace(/₽\s?|(,*)/g, '') as any}
				/>
			</Form.Item>
			
			<Form.Item
				label="Артикул"
				name="sku"
				rules={[
					{ required: true, message: 'Укажите артикул' },
					{ min: 3, message: 'Артикул должен содержать минимум 3 символа' },
					{ max: 50, message: 'Артикул не должен превышать 50 символов' }
				]}
			>
				<Input placeholder="Например: ABC-123" />
			</Form.Item>

			{mode === 'edit' && product && (
				<Form.Item label="Фото товара">
					<Upload
						showUploadList={false}
						accept="image/*"
						beforeUpload={(file) => {
							handlePhotoUpload(file, product.id)
							return false // Предотвращаем автоматическую загрузку
						}}
					>
						<Button loading={uploadingPhoto} disabled={uploadingPhoto}>
							{uploadingPhoto ? 'Загрузка...' : 'Загрузить фото'}
						</Button>
					</Upload>
				</Form.Item>
			)}
			
			{mode !== 'view' && (
				<Form.Item>
					<Space>
						<Button 
							type="primary" 
							htmlType="submit" 
							loading={isSubmitting}
							disabled={isSubmitting}
						>
							{mode === 'edit' ? 'Обновить' : 'Создать'}
						</Button>
						<Button 
							onClick={onCancel}
							disabled={isSubmitting}
						>
							Отмена
						</Button>
					</Space>
				</Form.Item>
			)}
			
			{/* Модалка для ошибок */}
			<ModalComponent />
		</Form>
	)
}
