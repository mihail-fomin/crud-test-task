import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, Typography, Button, Space, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { ProductForm } from '../features/admin/ProductForm'
import { useMockProductQuery, useMockUpdateProduct, useMockCreateProduct } from '../hooks/useMockData'
import type { Product } from '../types/product'

const { Title } = Typography

export default function AdminPage() {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const editId = searchParams.get('edit')
	const productId = editId ? parseInt(editId, 10) : 0

	const { data: product, isLoading } = useMockProductQuery(productId)
	const updateProductMutation = useMockUpdateProduct()
	const createProductMutation = useMockCreateProduct()

	const handleSubmit = async (values: any) => {
		try {
			if (editId) {
				await updateProductMutation.mutateAsync({
					id: productId,
					data: values
				})
				message.success('Товар обновлен')
			} else {
				await createProductMutation.mutateAsync(values)
				message.success('Товар создан')
			}
			navigate('/')
		} catch (error) {
			message.error('Ошибка сохранения товара')
		}
	}

	const handleBack = () => {
		navigate(-1)
	}

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div>Загрузка...</div>
			</div>
		)
	}

	return (
		<div className="max-w-2xl mx-auto">
			<div className="mb-6">
				<Button 
					icon={<ArrowLeftOutlined />} 
					onClick={handleBack}
					className="mb-4"
				>
					Назад
				</Button>
			</div>

			<Card>
				<Title level={2}>
					{editId ? 'Редактирование товара' : 'Создание товара'}
				</Title>
				
				<ProductForm 
					defaultValues={product || undefined} 
					onSubmit={handleSubmit}
					submitting={updateProductMutation.isPending || createProductMutation.isPending}
				/>
			</Card>
		</div>
	)
}
