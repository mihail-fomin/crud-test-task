import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Typography, Upload, message } from 'antd'
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { deleteProductPhoto, uploadProductPhoto } from '../features/products/api'
import ProductImage from './ProductImage'
import type { Product } from '../types/product'
import styles from './ProductsCatalog.module.scss'
import { useErrorModal } from '../hooks/useErrorModal'

const { Title, Text } = Typography

interface ProductCardProps {
    product: Product
    onEdit: (product: Product) => void
    onDelete: (product: Product) => void
    uploadingId: number | null
    setUploadingId: (id: number | null) => void
    isDeleting: boolean
}

interface RetryState {
    isRetrying: boolean
    retryCount: number
}

export default function ProductCard({
    product,
    onEdit,
    onDelete,
    uploadingId,
    setUploadingId,
    isDeleting
}: ProductCardProps) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [retryState, setRetryState] = useState<RetryState>({
        isRetrying: false,
        retryCount: 0
    })

    const handleProductClick = useCallback((product: Product) => {
        navigate(`/product/${product.id}`)
    }, [navigate])

    const { showErrorModal,  ModalComponent } = useErrorModal()

    const handlePhotoUpload = useCallback(async (productId: number, file: File, isRetry = false) => {
        try {
            // Проверяем размер файла (10MB лимит)
            const maxSize = 10 * 1024 * 1024 // 10MB
            if (file.size > maxSize) {
                const error = {
                    message: 'Размер файла превышает максимально допустимый',
                    status: 413
                }
                showErrorModal(error)
                return
            }

            // Проверяем тип файла
            if (!file.type.startsWith('image/')) {
                const error = {
                    message: 'Неподдерживаемый тип файла',
                    status: 415
                }
                showErrorModal(error)
                return
            }

            setUploadingId(productId)
            if (isRetry) {
                setRetryState(prev => ({ ...prev, isRetrying: true }))
            }

            await uploadProductPhoto(productId, file)
            message.success('Фото загружено')
            queryClient.invalidateQueries({ queryKey: ['catalog'] })
            queryClient.invalidateQueries({ queryKey: ['catalog-infinite'] })
            
            // Сбрасываем счетчик повторов при успехе
            setRetryState({ isRetrying: false, retryCount: 0 })
        } catch (error: any) {
            console.error('Ошибка загрузки фото:', error)
            
            // Показываем улучшенное уведомление об ошибке
            showErrorModal(error)
                
        } finally {
            setUploadingId(null)
            setRetryState(prev => ({ ...prev, isRetrying: false }))
        }
    }, [queryClient, setUploadingId, retryState.retryCount])

    const handleDeletePhoto = async (productId: number) => {
        try {
            await deleteProductPhoto(productId)
            message.success('Фото удалено')
            queryClient.invalidateQueries({ queryKey: ['catalog'] })
            queryClient.invalidateQueries({ queryKey: ['catalog-infinite'] })
        } catch (error: any) {
            console.error('Ошибка удаления фото:', error)
                showErrorModal(error)
        }
    }

    return (
        <>
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
                                onDelete(product)
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
                        icon={retryState.isRetrying ? <ReloadOutlined spin /> : undefined}
                    >
                        {retryState.isRetrying 
                            ? `Повтор ${retryState.retryCount}/3` 
                            : product.photoUrl ? 'Изменить фото' : 'Добавить фото'
                        }
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

        <ModalComponent />
        </>
    )
}
