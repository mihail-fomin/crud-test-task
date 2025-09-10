import { useState } from 'react'
import { Typography, Input, Spin, Modal, Button } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { useDeleteProduct } from '../features/products/hooks/useDeleteProduct'
import { useInfiniteCatalogQuery } from '../features/catalog/hooks'
import { handleApiError } from '../utils/errorHandler'
import ProductsGrid from './ProductsGrid'
import SortDropdown from './SortDropdown'
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
			{/* Поиск и сортировка */}

            <div className={styles.searchContainer}>
            <SortDropdown />
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
			<ProductsGrid
				products={allProducts}
				onEdit={onEdit}
				onDelete={handleDelete}
				uploadingId={uploadingId}
				setUploadingId={setUploadingId}
				isDeleting={isDeleting}
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				fetchNextPage={fetchNextPage}
				searchTerm={searchTerm}
			/>

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