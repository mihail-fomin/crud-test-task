import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Typography, Input, Spin, message, Upload, Modal } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { deleteProductPhoto, uploadProductPhoto } from '../features/products/api'
import { useDeleteProduct } from '../features/products/hooks/useDeleteProduct'
import { useCatalogQuery } from '../features/catalog/hooks'
import ProductImage from './ProductImage'
import type { Product } from '../types/product'
import styles from './ProductsCatalog.module.scss'

const { Title, Text, Paragraph } = Typography
const { Search } = Input

interface ProductsCatalogProps {
	onEdit: (product: Product) => void
}

export default function ProductsCatalog({ onEdit }: ProductsCatalogProps) {
	const [searchTerm, setSearchTerm] = useState('')
	const [uploadingId, setUploadingId] = useState<number | null>(null)
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const loadMoreRef = useRef<HTMLDivElement>(null)

	const {
		data,
		isLoading,
		error,
	} = useCatalogQuery()

	const { deleteModal, handleDelete, handleDeleteConfirm, handleDeleteCancel, isDeleting } = useDeleteProduct()

	const handleProductClick = useCallback((product: Product) => {
		navigate(`/product/${product.id}`)
	}, [navigate])

	const handlePhotoUpload = useCallback(async (productId: number, file: File) => {
		try {
			setUploadingId(productId)
			await uploadProductPhoto(productId, file)
			message.success('Фото загружено')
			queryClient.invalidateQueries({ queryKey: ['catalog'] })
			queryClient.invalidateQueries({ queryKey: ['catalog-infinite'] })
		} catch (error) {
			message.error('Ошибка загрузки фото')
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

	// Обработчик скролла для бесконечной прокрутки
	useEffect(() => {
		const handleScroll = () => {
			if (!loadMoreRef.current || !data?.pages[data.pages.length - 1].hasNextPage || isFetchingNextPage) return

			const rect = loadMoreRef.current.getBoundingClientRect()
			if (rect.top <= window.innerHeight + 300) {
				fetchNextPage()
			}
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [fetchNextPage, hasNextPage, isFetchingNextPage])


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
											console.log('Кнопка удаления нажата!', product);
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
								<Text 
									type="secondary" 
									className={styles.sku}
									style={{
										fontSize: '0.75rem',
										color: '#6b7280'
									}}
								>
									Артикул: {product.sku}
								</Text>
							</div>

							{/* Описание */}
							{product.description && (
								<div className={styles.description}>
									<Paragraph 
										className={styles.descriptionText}
										style={{
											fontSize: window.innerWidth <= 480 ? '0.75rem' : window.innerWidth <= 768 ? '0.8rem' : '0.875rem',
											color: '#6b7280',
											margin: 0,
											display: '-webkit-box',
											WebkitLineClamp: window.innerWidth <= 480 ? 1 : window.innerWidth <= 768 ? 2 : 3,
											WebkitBoxOrient: 'vertical',
											overflow: 'hidden'
										}}
									>
										{product.description}
									</Paragraph>
								</div>
							)}

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


			{/* Индикатор загрузки следующей страницы */}
			{isFetchingNextPage && (
				<div className={styles.loadingMore}>
					<Spin size="default" />
					<Text type="secondary" style={{ marginLeft: 8 }}>Загрузка товаров...</Text>
				</div>
			)}

			{/* Элемент для отслеживания скролла */}
			{hasNextPage && !isFetchingNextPage && (
				<div ref={loadMoreRef} className={styles.scrollTrigger} />
			)}

			{/* Сообщение, если товары не найдены */}
			{filteredProducts.length === 0 && searchTerm && (
				<div className={styles.noResults}>
					<Title level={4} className={styles.noResultsTitle}>Товары не найдены</Title>
					<Text type="secondary" className={styles.noResultsText}>
						По запросу "{searchTerm}" ничего не найдено
					</Text>
				</div>
			)}

			{/* Модалка удаления */}
			<Modal
				title="Удалить товар?"
				open={deleteModal.visible}
				onOk={handleDeleteConfirm}
				onCancel={handleDeleteCancel}
				okText="Удалить"
				cancelText="Отмена"
				okButtonProps={{ danger: true }}
				getContainer={() => document.body}
			>
				{deleteModal.product && (
					<p>Вы уверены, что хотите удалить товар "{deleteModal.product.name}"?</p>
				)}
			</Modal>
		</div>
	)
}
