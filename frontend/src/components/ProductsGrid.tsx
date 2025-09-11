import { Typography, Spin } from 'antd'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import ProductCard from './ProductCard'
import type { Product } from '../types/product'
import styles from './ProductsGrid.module.scss'

const { Title, Text } = Typography

interface ProductsGridProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  uploadingId: number | null
  setUploadingId: (id: number | null) => void
  isDeleting: boolean
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage?: () => void
}

export default function ProductsGrid({
  products,
  onEdit,
  onDelete,
  uploadingId,
  setUploadingId,
  isDeleting,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage
}: ProductsGridProps) {
  // Хук для бесконечного скролла
  const { loadMoreRef, isLoading: isScrollLoading } = useInfiniteScroll({
    hasNextPage: hasNextPage || false,
    isFetchingNextPage: isFetchingNextPage || false,
    fetchNextPage: fetchNextPage || (() => {}),
  })

  // Сообщение, если товары не найдены
  if (products.length === 0) {
    return (
      <div className={styles.noResults}>
        <Title level={4} className={styles.noResultsTitle}>Товары не найдены</Title>
        <Text type="secondary" className={styles.noResultsText}>
          Товары не найдены
        </Text>
      </div>
    )
  }

  return (
    <>
      {/* Сетка товаров */}
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            uploadingId={uploadingId}
            setUploadingId={setUploadingId}
            isDeleting={isDeleting}
          />
        ))}
      </div>

      {/* Индикатор загрузки следующей страницы */}
      {hasNextPage && (
        <div className={styles.loadingMore}>
          <Spin size="default" />
          <Text type="secondary" style={{ marginLeft: 8 }}>Загрузка товаров...</Text>
        </div>
      )}

      {/* Элемент для отслеживания скролла */}
      {hasNextPage && !isScrollLoading && (
        <div ref={loadMoreRef} className={styles.scrollTrigger} />
      )}
    </>
  )
}
