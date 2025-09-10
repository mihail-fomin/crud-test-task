import { useState } from 'react'
import { Typography, Input, Spin, Modal, Button } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { useDeleteProduct } from '../features/products/hooks/useDeleteProduct'
import { useInfiniteCatalogQuery } from '../features/catalog/hooks'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { handleApiError } from '../utils/errorHandler'
import ProductCard from './ProductCard'
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

	const {
		data,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteCatalogQuery()

	const { handleDelete, isDeleting, showDeleteModal, deleteProduct, confirmDelete, cancelDelete } = useDeleteProduct()

	// Хук для бесконечного скролла
	const { loadMoreRef, isLoading: isScrollLoading } = useInfiniteScroll({
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	})

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
		const errorDetails = handleApiError(error)
		
		return (
			<div className={styles.error}>
				<Title level={3} className={styles.errorTitle}>{errorDetails.title}</Title>
				<Text type="secondary" className={styles.errorText}>{errorDetails.description}</Text>
				{errorDetails.canRetry && (
					<Button 
						type="primary" 
						icon={<ReloadOutlined />}
						onClick={() => refetch()}
						style={{ marginTop: '16px' }}
					>
						Попробовать снова
					</Button>
				)}
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
					<ProductCard
						key={product.id}
						product={product}
						onEdit={onEdit}
						onDelete={handleDelete}
						uploadingId={uploadingId}
						setUploadingId={setUploadingId}
						isDeleting={isDeleting}
					/>
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