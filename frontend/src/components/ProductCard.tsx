import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Typography, message, Modal } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
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
    const [deletePhotoModalVisible, setDeletePhotoModalVisible] = useState(false)
    const [isDeletingPhoto, setIsDeletingPhoto] = useState(false)

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

    const handleDeletePhotoClick = () => {
        setDeletePhotoModalVisible(true)
    }

    const handleDeletePhotoConfirm = async () => {
        try {
            setIsDeletingPhoto(true)
            await deleteProductPhoto(product.id)
            message.success('Фото удалено')
            queryClient.invalidateQueries({ queryKey: ['catalog'] })
            queryClient.invalidateQueries({ queryKey: ['catalog-infinite'] })
            setDeletePhotoModalVisible(false)
        } catch (error: any) {
            console.error('Ошибка удаления фото:', error)
            showErrorModal(error)
        } finally {
            setIsDeletingPhoto(false)
        }
    }

    const handleDeletePhotoCancel = () => {
        setDeletePhotoModalVisible(false)
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
                        onDelete={handleDeletePhotoClick}
                        uploading={uploadingId === product.id}
                    />
                    
                </div>
            }
            actions={[]}
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

                {/* Кнопки действий - всегда внизу */}
                <div className={styles.buttonSection}>
                    <div className={styles.buttonRow}>
                        <Button
                            type="primary"
                            className={styles.detailsButton}
                            onClick={() => handleProductClick(product)}
                        >
                            Подробнее
                        </Button>
                        <div className={styles.actionButtons}>
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onEdit(product)
                                }}
                                title="Редактировать товар"
                            />
                            <Button
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete(product)
                                }}
                                title="Удалить товар"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Card>

        <ModalComponent />
        
        {/* Модальное окно подтверждения удаления фотографии */}
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Удаление фотографии</span>
                </div>
            }
            open={deletePhotoModalVisible}
            onOk={handleDeletePhotoConfirm}
            onCancel={handleDeletePhotoCancel}
            okText="Удалить"
            cancelText="Отмена"
            okButtonProps={{ 
                danger: true,
                loading: isDeletingPhoto,
                disabled: isDeletingPhoto
            }}
            cancelButtonProps={{
                disabled: isDeletingPhoto
            }}
            centered
        >
            <p>Вы уверены, что хотите удалить фотографию товара?</p>
        </Modal>
        </>
    )
}
