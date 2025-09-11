import { useState } from 'react'
import { Typography, Spin, Modal, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { useDeleteProduct } from '../features/products/hooks/useDeleteProduct'
import { useInfiniteCatalogQuery } from '../features/catalog/hooks'
import { useSearch } from '../hooks'
import { handleApiError } from '../utils/errorHandler'
import ProductsGrid from './ProductsGrid'
import { SearchContainer } from './search'
import type { Product } from '../types/product'
import styles from './ProductsCatalog.module.scss'

const { Title, Text } = Typography

interface ProductsCatalogProps {
	onEdit: (product: Product) => void
}

export default function ProductsCatalog({ onEdit }: ProductsCatalogProps) {
	const [uploadingId, setUploadingId] = useState<number | null>(null)

	const {
		data,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
		isFetching,
	} = useInfiniteCatalogQuery()

	const { handleDelete, isDeleting, showDeleteModal, deleteProduct, confirmDelete, cancelDelete } = useDeleteProduct()

	// Используем хук поиска
	const { searchTerm, handleSearchChange, handleSearchSubmit } = useSearch()

	// Объединяем все товары из всех страниц
	const allProducts = data?.pages?.flatMap(page => page.data) || []

	return (
		<div className={styles.container}>
			{/* Поиск и сортировка */}
			<SearchContainer
				searchTerm={searchTerm}
				onSearchChange={handleSearchChange}
				onSearchSubmit={handleSearchSubmit}
				loading={isFetching}
			/>

			{/* Состояния загрузки и ошибок */}
			{isLoading && !data ? (
				<div className={styles.loading}>
					<Spin size="large" />
				</div>
			) : error ? (
				<div className={styles.error}>
					{(() => {
						const errorDetails = handleApiError(error)
						return (
							<>
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
							</>
						)
					})()}
				</div>
			) : (
				<>
					{/* Индикатор загрузки при поиске */}
					{isFetching && data && (
						<div className={styles.searchLoading}>
							<Spin size="small" />
							<Text type="secondary" style={{ marginLeft: 8 }}>Поиск...</Text>
						</div>
					)}
					
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
					/>
				</>
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