import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Typography, Space, Image, Tag, Spin, message } from 'antd'
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useMockProductQuery, useMockDeleteProduct } from '../hooks/useMockData'

const { Title, Text, Paragraph } = Typography

export default function ProductPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const productId = id ? parseInt(id, 10) : 0

	const { data: product, isLoading, error } = useMockProductQuery(productId)
	const deleteProductMutation = useMockDeleteProduct()

	const handleEdit = () => {
		navigate(`/admin?edit=${productId}`)
	}

	const handleDelete = () => {
		deleteProductMutation.mutate(productId, {
			onSuccess: () => {
				message.success('Товар удален')
				navigate('/')
			},
			onError: () => {
				message.error('Ошибка удаления товара')
			}
		})
	}

	const handleBack = () => {
		navigate(-1)
	}

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
				<Title level={3}>Товар не найден</Title>
				<Text type="secondary">Запрашиваемый товар не существует</Text>
				<div className="mt-4">
					<Button type="primary" onClick={handleBack}>
						Вернуться назад
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-6">
				<Button 
					icon={<ArrowLeftOutlined />} 
					onClick={handleBack}
					className="mb-4"
				>
					Назад
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Изображение товара */}
				<div>
					{product.photoUrl ? (
						<Image
							src={product.photoUrl}
							alt={product.name}
							className="w-full rounded-lg"
							preview={{
								mask: 'Увеличить'
							}}
						/>
					) : (
						<div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
							<Text type="secondary">Изображение отсутствует</Text>
						</div>
					)}
				</div>

				{/* Информация о товаре */}
				<div className="space-y-6">
					<div>
						<Title level={2}>{product.name}</Title>
						<Text type="secondary" className="text-lg">SKU: {product.sku}</Text>
					</div>

					{/* Цена */}
					<div className="bg-gray-50 p-4 rounded-lg">
						<div className="flex items-center gap-4">
							<Title level={3} className="m-0 text-blue-600">
								{product.price} ₽
							</Title>
							{product.discountedPrice && (
								<>
									<Text delete type="secondary" className="text-lg">
										{product.discountedPrice} ₽
									</Text>
									<Tag color="red">
										Скидка {Math.round((1 - product.price / product.discountedPrice) * 100)}%
									</Tag>
								</>
							)}
						</div>
					</div>

					{/* Описание */}
					{product.description && (
						<div>
							<Title level={4}>Описание</Title>
							<Paragraph className="text-gray-700">
								{product.description}
							</Paragraph>
						</div>
					)}

					{/* Дополнительная информация */}
					<div className="space-y-2">
						<Title level={4}>Информация</Title>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<Text strong>ID товара:</Text>
								<br />
								<Text>{product.id}</Text>
							</div>
							<div>
								<Text strong>Дата создания:</Text>
								<br />
								<Text>{new Date(product.createdAt).toLocaleDateString('ru-RU')}</Text>
							</div>
							<div>
								<Text strong>Последнее обновление:</Text>
								<br />
								<Text>{new Date(product.updatedAt).toLocaleDateString('ru-RU')}</Text>
							</div>
							<div>
								<Text strong>Статус:</Text>
								<br />
								<Tag color="green">В наличии</Tag>
							</div>
						</div>
					</div>

					{/* Действия */}
					<div className="pt-4 border-t">
						<Space>
							<Button 
								type="primary" 
								icon={<EditOutlined />}
								onClick={handleEdit}
							>
								Редактировать
							</Button>
							<Button 
								danger 
								icon={<DeleteOutlined />}
								onClick={handleDelete}
								loading={deleteProductMutation.isPending}
							>
								Удалить
							</Button>
						</Space>
					</div>
				</div>
			</div>
		</div>
	)
}
