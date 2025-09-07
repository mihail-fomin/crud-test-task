import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Typography, Input, Spin, message, Modal, Upload } from 'antd'
import { SearchOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProduct, deleteProductPhoto, uploadProductPhoto } from '../features/products/api'
import { useInfiniteCatalogQuery } from '../features/catalog/hooks'
import { useIsMockMode } from '../hooks/useApiMode'
import ProductImage from './ProductImage'
import type { Product } from '../types/product'

const { Title, Text, Paragraph } = Typography
const { Search } = Input

interface ProductsCatalogProps {
	onEdit: (product: Product) => void
	onView: (product: Product) => void
}

export default function ProductsCatalog({ onEdit, onView }: ProductsCatalogProps) {
	const [searchTerm, setSearchTerm] = useState('')
	const [uploadingId, setUploadingId] = useState<number | null>(null)
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const isMockMode = useIsMockMode()

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
	} = useInfiniteCatalogQuery()

	const deleteProductMutation = useMutation({
		mutationFn: (id: number) => deleteProduct(id, isMockMode),
		onSuccess: () => {
			message.success('Товар удален')
			queryClient.invalidateQueries({ queryKey: ['catalog-infinite'] })
		},
		onError: () => message.error('Ошибка удаления товара'),
	})

	const handleProductClick = useCallback((product: Product) => {
		navigate(`/product/${product.id}`)
	}, [navigate])

	const handleDelete = useCallback((product: Product) => {
		Modal.confirm({
			title: 'Удалить товар?',
			content: `Вы уверены, что хотите удалить товар "${product.name}"?`,
			okText: 'Удалить',
			okButtonProps: { danger: true },
			cancelText: 'Отмена',
			onOk: () => deleteProductMutation.mutate(product.id),
		})
	}, [deleteProductMutation])

	const handlePhotoUpload = useCallback(async (productId: number, file: File) => {
		try {
			setUploadingId(productId)
			await uploadProductPhoto(productId, file, isMockMode)
			message.success('Фото загружено')
			queryClient.invalidateQueries({ queryKey: ['catalog-infinite'] })
		} catch (error) {
			message.error('Ошибка загрузки фото')
		} finally {
			setUploadingId(null)
		}
	}, [queryClient, isMockMode])

	const handleDeletePhoto = useCallback(async (productId: number) => {
		try {
			await deleteProductPhoto(productId, isMockMode)
			message.success('Фото удалено')
			queryClient.invalidateQueries({ queryKey: ['catalog-infinite'] })
		} catch (error) {
			message.error('Ошибка удаления фото')
		}
	}, [queryClient, isMockMode])

	// Фильтрация товаров по поисковому запросу
	const filteredProducts = data?.pages.flatMap(page => page.data)?.filter(product =>
		product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
		product.description?.toLowerCase().includes(searchTerm.toLowerCase())
	) || []

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Spin size="large" />
			</div>
		)
	}

	if (error) {
		return (
			<div className="py-8 text-center">
				<Title level={3} className="text-red-500">Ошибка загрузки товаров</Title>
				<Text type="secondary">Попробуйте обновить страницу</Text>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			{/* Поиск */}
			<div className="max-w-md">
				<Search
					placeholder="Поиск товаров..."
					allowClear
					enterButton={<SearchOutlined />}
					size="large"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="[&_.ant-input-search-button]:bg-gradient-to-r [&_.ant-input-search-button]:from-blue-500 [&_.ant-input-search-button]:to-purple-600 [&_.ant-input-search-button]:border-none hover:[&_.ant-input-search-button]:from-blue-600 hover:[&_.ant-input-search-button]:to-purple-700"
				/>
			</div>

			{/* Сетка товаров */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{filteredProducts.map((product) => (
					<Card
						key={product.id}
						hoverable
						className="h-full transition-all duration-300 ease-in-out group hover:-translate-y-1 hover:shadow-lg"
						cover={
							<div className="relative h-48">
								<ProductImage
									src={product.photoUrl}
									alt={product.name}
									className="object-cover w-full h-full"
								/>
								
								{/* Кнопки действий */}
								<div className="flex absolute top-2 right-2 flex-col gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
									<Button
										size="small"
										icon={<EyeOutlined />}
										onClick={(e) => {
											e.stopPropagation()
											onView(product)
										}}
									/>
									<Button
										size="small"
										icon={<EditOutlined />}
										onClick={(e) => {
											e.stopPropagation()
											onEdit(product)
										}}
									/>
									<Button
										size="small"
										danger
										icon={<DeleteOutlined />}
										onClick={(e) => {
											e.stopPropagation()
											handleDelete(product)
										}}
									/>
								</div>
							</div>
						}
						actions={[
							<Upload
								key="upload"
								showUploadList={false}
								beforeUpload={(file) => {
									handlePhotoUpload(product.id, file)
									return false
								}}
							>
								<Button
									size="small"
									loading={uploadingId === product.id}
									disabled={uploadingId === product.id}
								>
									{product.photoUrl ? 'Изменить фото' : 'Добавить фото'}
								</Button>
							</Upload>,
							product.photoUrl && (
								<Button
									key="delete-photo"
									size="small"
									danger
									onClick={() => handleDeletePhoto(product.id)}
								>
									Удалить фото
								</Button>
							),
						].filter(Boolean)}
					>
						<Card.Meta
							title={
								<div className="space-y-2">
									<Title level={5} className="overflow-hidden mb-1" style={{
										display: '-webkit-box',
										WebkitLineClamp: 2,
										WebkitBoxOrient: 'vertical'
									}}>
										{product.name}
									</Title>
									<Text type="secondary" className="text-xs">
										Артикул: {product.sku}
									</Text>
								</div>
							}
							description={
								<div className="space-y-3">
									{product.description && (
										<Paragraph 
											ellipsis={{ rows: 2 }} 
											className="mb-2 text-sm text-gray-600"
										>
											{product.description}
										</Paragraph>
									)}
									
									<div className="space-y-1">
										<div className="flex gap-2 items-center">
											<Text className="text-lg font-bold text-blue-600">
												{product.price.toLocaleString()} ₽
											</Text>
											{product.discountedPrice && (
												<Text 
													delete 
													className="text-sm text-gray-500"
												>
													{product.discountedPrice.toLocaleString()} ₽
												</Text>
											)}
										</div>
										{product.discountedPrice && (
											<Text className="text-xs font-semibold text-green-600">
												Экономия: {((product.price - product.discountedPrice) / product.price * 100).toFixed(0)}%
											</Text>
										)}
									</div>
								</div>
							}
						/>
						
						<div className="pt-3 mt-4 border-t">
							<Button
								type="primary"
								block
								onClick={() => handleProductClick(product)}
							>
								Подробнее
							</Button>
						</div>
					</Card>
				))}
			</div>

			{/* Кнопка загрузки еще */}
			{hasNextPage && (
				<div className="py-4 text-center">
					<Button
						size="large"
						loading={isFetchingNextPage}
						onClick={() => fetchNextPage()}
					>
						{isFetchingNextPage ? 'Загрузка...' : 'Загрузить еще'}
					</Button>
				</div>
			)}

			{/* Сообщение, если товары не найдены */}
			{filteredProducts.length === 0 && searchTerm && (
				<div className="py-8 text-center">
					<Title level={4}>Товары не найдены</Title>
					<Text type="secondary">
						По запросу "{searchTerm}" ничего не найдено
					</Text>
				</div>
			)}
		</div>
	)
}
