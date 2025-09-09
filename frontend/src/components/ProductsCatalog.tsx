import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Typography, Input, Spin, message, Upload, Modal } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { deleteProductPhoto, uploadProductPhoto } from '../features/products/api'
import { useDeleteProduct } from '../features/products/hooks/useDeleteProduct'
import { useInfiniteCatalogQuery } from '../features/catalog/hooks'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import ProductImage from './ProductImage'
import type { Product } from '../types/product'
import styles from './ProductsCatalog.module.scss'

const { Title, Text } = Typography
const { Search } = Input

interface ProductsCatalogProps {
	onEdit: (product: Product) => void
}

export default function ProductsCatalog({ onEdit }: ProductsCatalogProps) {
	const [searchTerm, setSearchTerm] = useState('')
	const [uploadingId, setUploadingId] = useState<number | null>(null)
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	const {
		data,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteCatalogQuery()

	const { handleDelete, isDeleting, showDeleteModal, deleteProduct, confirmDelete, cancelDelete } = useDeleteProduct()

	// Хук для бесконечного скролла
	const { loadMoreRef, isLoading: isScrollLoading } = useInfiniteScroll({
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	})

	const handleProductClick = useCallback((product: Product) => {
		navigate(`/product/${product.id}`)
	}, [navigate])

	const handlePhotoUpload = useCallback(async (productId: number, file: File) => {
		try {
			// Проверяем размер файла (10MB лимит)
			const maxSize = 10 * 1024 * 1024 // 10MB
            console.log('file.size: ', file.size);
			if (file.size > maxSize) {
				message.error('Размер файла не должен превышать 10MB')
				return
			}

			// Проверяем тип файла
			if (!file.type.startsWith('image/')) {
				message.error('Пожалуйста, выберите изображение')
				return
			}

            console.log('productId: ', productId);
			setUploadingId(productId)
			await uploadProductPhoto(productId, file)
			message.success('Фото загружено')
			queryClient.invalidateQueries({ queryKey: ['catalog'] })
			queryClient.invalidateQueries({ queryKey: ['catalog-infinite'] })
		} catch (error: any) {
			console.error('Ошибка загрузки фото:', error)
			let errorMessage = 'Ошибка загрузки фото'
			
			if (error?.status === 413) {
				errorMessage = 'Файл слишком большой. Максимальный размер: 10MB'
			} else if (error?.message) {
				errorMessage = error.message
			}
			
			message.error(errorMessage)
		} finally {
			setUploadingId(null)
		}
	}, [queryClient])

	const handleDeletePhoto = async (productId: number) => {
		try {
			await deleteProductPhoto(productId)
			message.success('Фото удалено')
			queryClient.invalidateQueries({ queryKey: ['catalog'] })
			queryClient.invalidateQueries({ queryKey: ['catalog-infinite'] })
		} catch (error) {
			message.error('Ошибка удаления фото')
		}
	}

	// Объединяем все товары из всех страниц
	const allProducts = data?.pages?.flatMap(page => page.data) || []

	// Фильтрация товаров по поисковому запросу
	const filteredProducts = allProducts.filter(product =>
		product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
		product.description?.toLowerCase().includes(searchTerm.toLowerCase())
	)

	if (isLoading) {
		return (
			<div className={styles.loading}>
				<Spin size="large" />
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles.error}>
				<Title level={3} className={styles.errorTitle}>Ошибка загрузки товаров</Title>
				<Text type="secondary" className={styles.errorText}>Попробуйте обновить страницу</Text>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			{/* Поиск */}
			<div className={styles.searchContainer}>
				<Search
					placeholder="Поиск товаров..."
					allowClear
					enterButton={<SearchOutlined />}
					size="large"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className={styles.searchInput}
				/>
			</div>

			{/* Сетка товаров */}
			<div className={styles.grid}>
				{filteredProducts.map((product) => (
					<Card
						key={product.id}
						hoverable={!isDeleting}
						className={`${styles.card} ${isDeleting ? styles.deleting : ''}`}
						cover={
							<div className={styles.imageContainer}>
								<ProductImage
									src={product.photoUrl}
									alt={product.name}
									className={styles.image}
									onUpload={(file) => handlePhotoUpload(product.id, file)}
									uploading={uploadingId === product.id}
								/>
								
								{/* Кнопки действий */}
								<div className={styles.actions}>
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
								accept="image/*"
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
						<div className={styles.content}>
							{/* Заголовок и артикул */}
							<div className={styles.header}>
								<Title 
									level={5} 
									className={styles.title}
									style={{
										fontSize: window.innerWidth <= 480 ? '0.875rem' : window.innerWidth <= 768 ? '1rem' : '1.125rem',
										fontWeight: 600,
										color: '#111827',
										marginBottom: '0.5rem',
										lineHeight: 1.4,
										display: '-webkit-box',
										WebkitLineClamp: window.innerWidth <= 480 ? 1 : 2,
										WebkitBoxOrient: 'vertical',
										overflow: 'hidden',
										minHeight: window.innerWidth <= 480 ? '1.75rem' : window.innerWidth <= 768 ? '2rem' : '2.5rem'
									}}
								>
									{product.name}
								</Title>
							</div>

							{/* Цена */}
							<div className={styles.priceSection}>
								<div className={styles.priceRow}>
									<Text 
										className={styles.price}
										style={{
											fontSize: window.innerWidth <= 480 ? '0.875rem' : window.innerWidth <= 768 ? '1rem' : '1.125rem',
											fontWeight: 'bold',
											color: '#2563eb'
										}}
									>
										{product.price.toLocaleString()} ₽
									</Text>
									{product.discountedPrice && (
										<Text 
											delete 
											className={styles.oldPrice}
											style={{
												fontSize: '0.875rem',
												color: '#9ca3af',
												textDecoration: 'line-through'
											}}
										>
											{product.discountedPrice.toLocaleString()} ₽
										</Text>
									)}
								</div>
								{product.discountedPrice && (
									<Text 
										className={styles.discount}
										style={{
											fontSize: '0.75rem',
											fontWeight: 600,
											color: '#059669'
										}}
									>
										Экономия: {((product.price - product.discountedPrice) / product.price * 100).toFixed(0)}%
									</Text>
								)}
							</div>

							{/* Кнопка "Подробнее" - всегда внизу */}
							<div className={styles.buttonSection}>
								<Button
									type="primary"
									block
									className={styles.button}
									onClick={() => handleProductClick(product)}
								>
									Подробнее
								</Button>
							</div>
						</div>
					</Card>
				))}
			</div>



			{/* Сообщение, если товары не найдены */}
			{filteredProducts.length === 0 && searchTerm && (
				<div className={styles.noResults}>
					<Title level={4} className={styles.noResultsTitle}>Товары не найдены</Title>
					<Text type="secondary" className={styles.noResultsText}>
						По запросу "{searchTerm}" ничего не найдено
					</Text>
				</div>
			)}

			{/* Индикатор загрузки следующей страницы */}
			{isScrollLoading && (
				<div className={styles.loadingMore}>
					<Spin size="default" />
					<Text type="secondary" style={{ marginLeft: 8 }}>Загрузка товаров...</Text>
				</div>
			)}

			{/* Элемент для отслеживания скролла */}
			{hasNextPage && !isScrollLoading && (
				<div ref={loadMoreRef} className={styles.scrollTrigger} />
			)}

			{/* Модальное окно подтверждения удаления */}
			<Modal
				title="Удалить товар?"
				open={showDeleteModal}
				onOk={confirmDelete}
				onCancel={cancelDelete}
				okText="Удалить"
				cancelText="Отмена"
				okButtonProps={{ danger: true, loading: isDeleting }}
			>
				{deleteProduct && (
					<div>
						<p>Вы уверены, что хотите удалить товар "{deleteProduct.name}"?</p>
					</div>
				)}
			</Modal>

		</div>
	)
}
