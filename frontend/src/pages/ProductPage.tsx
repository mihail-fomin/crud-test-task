import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Space, Typography, Spin } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { fetchProduct } from '../features/products/api'

const { Title, Text, Paragraph } = Typography

export default function ProductPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const productId = id ? parseInt(id, 10) : 0

	const { data: product, isLoading, error } = useQuery({
		queryKey: ['product', productId],
		queryFn: () => fetchProduct(productId),
		enabled: !!productId,
	})

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Spin size="large" />
			</div>
		)
	}

	if (error || !product) {
		return (
			<div className="text-center py-8">
				<Title level={2} className="text-red-500">Товар не найден</Title>
				<Text type="secondary" className="block mb-4">
					Товар с ID {productId} не существует
				</Text>
				<Button type="primary" onClick={() => navigate('/')}>
					Вернуться к каталогу
				</Button>
			</div>
		)
	}

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<div className="flex justify-between items-center">
				<Button onClick={() => navigate('/')}>
					← Назад к каталогу
				</Button>
			</div>

			<Card>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Фото товара */}
					<div>
						{product.photoUrl ? (
							<img
								src={product.photoUrl}
								alt={product.name}
								className="w-full h-96 object-cover rounded-lg"
							/>
						) : (
							<div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
								<Text type="secondary">Нет фотографии</Text>
							</div>
						)}
					</div>

					{/* Информация о товаре */}
					<div className="space-y-6">
						<div>
							<Title level={1}>{product.name}</Title>
							<Text type="secondary" className="text-lg">Артикул: {product.sku}</Text>
						</div>

						{product.description && (
							<div>
								<Title level={4}>Описание</Title>
								<Paragraph>{product.description}</Paragraph>
							</div>
						)}

						<div>
							<Title level={4}>Цена</Title>
							<div className="space-y-2">
								<div className="flex items-center gap-4">
									<Text className="text-3xl font-bold">
										{product.price.toLocaleString()} ₽
									</Text>
									{product.discountedPrice && (
										<Text 
											delete 
											className="text-xl text-gray-500"
										>
											{product.discountedPrice.toLocaleString()} ₽
										</Text>
									)}
								</div>
								{product.discountedPrice && (
									<Text className="text-green-600 font-semibold">
										Экономия: {((product.price - product.discountedPrice) / product.price * 100).toFixed(0)}%
									</Text>
								)}
							</div>
						</div>

						<div className="pt-4 border-t">
							<Space direction="vertical" size="small">
								<Text type="secondary">
									<strong>Дата создания:</strong> {new Date(product.createdAt).toLocaleDateString('ru-RU')}
								</Text>
								<Text type="secondary">
									<strong>Последнее обновление:</strong> {new Date(product.updatedAt).toLocaleDateString('ru-RU')}
								</Text>
							</Space>
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}