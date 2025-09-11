import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Typography, Spin, message, Modal, Upload, Tooltip } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchProduct, uploadProductPhoto, deleteProductPhoto } from '../features/products/api'
import { getProductImageUrl } from '../utils/imageUtils'
import { useErrorModal } from '../hooks/useErrorModal'
import styles from './ProductPage.module.scss'

const { Title, Text, Paragraph } = Typography

export default function ProductPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const productId = id ? parseInt(id, 10) : 0
	const [uploading, setUploading] = useState(false)
	const [deletePhotoModalVisible, setDeletePhotoModalVisible] = useState(false)

	const { data: product, isLoading, error } = useQuery({
		queryKey: ['product', productId],
		queryFn: () => fetchProduct(productId),
		enabled: !!productId,
	})

	const { showErrorModal, ModalComponent } = useErrorModal()

	const handlePhotoUpload = async (file: File) => {
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

			setUploading(true)
			await uploadProductPhoto(productId, file)
			message.success('Фото загружено')
			queryClient.invalidateQueries({ queryKey: ['product', productId] })
		} catch (error: unknown) {
			showErrorModal(error as { message: string; status?: number })
		} finally {
			setUploading(false)
		}
	}

	const handleDeletePhotoClick = () => {
		setDeletePhotoModalVisible(true)
	}

	const handleDeletePhotoConfirm = async () => {
		try {
			await deleteProductPhoto(productId)
			message.success('Фото удалено')
			queryClient.invalidateQueries({ queryKey: ['product', productId] })
			setDeletePhotoModalVisible(false)
		} catch (error: unknown) {
			showErrorModal(error as { message: string; status?: number })
		}
	}

	const handleDeletePhotoCancel = () => {
		setDeletePhotoModalVisible(false)
	}

	if (isLoading) {
		return (
			<div className={styles.productPage}>
				<div className={styles.container}>
					<div className={styles.loadingContainer}>
						<Spin size="large" />
						<div className={styles.loadingText}>Загрузка товара...</div>
					</div>
				</div>
			</div>
		)
	}

	if (error || !product) {
		return (
			<div className={styles.productPage}>
				<div className={styles.container}>
					<div className={styles.errorContainer}>
						<Title level={2} className={styles.errorTitle}>Товар не найден</Title>
						<Text className={styles.errorText}>
							Товар с ID {productId} не существует
						</Text>
						<Button className={styles.errorButton} onClick={() => navigate('/')}>
							Вернуться к каталогу
						</Button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.productPage}>
			<div className={styles.container}>
				<Button 
					className={styles.backButton} 
					onClick={() => navigate('/')}
				>
					← Назад к каталогу
				</Button>

				<Card className={`${styles.productCard} ${styles.fadeInUp}`}>
					<div className={styles.productGrid}>
						{/* Фото товара */}
						<div className={styles.imageSection}>
							{product.photoUrl ? (
								<div className="relative w-full h-full">
									<img
										src={getProductImageUrl(product.photoUrl) || ''}
										alt={product.name}
										className={styles.productImage}
									/>
									<Tooltip title="Удалить фотографию" placement="top">
										<Button
											type="text"
											danger
											icon={<CloseOutlined />}
											className={styles.deletePhotoButton}
											onClick={handleDeletePhotoClick}
										/>
									</Tooltip>
								</div>
							) : (
								<Upload
									showUploadList={false}
									accept="image/*"
									beforeUpload={(file) => {
										handlePhotoUpload(file)
										return false
									}}
									disabled={uploading}
								>
									<div className={styles.noImagePlaceholder}>
										<div className={styles.noImageIcon}>
											{uploading ? '⏳' : '📷'}
										</div>
										<Text className={styles.noImageText}>
											{uploading ? 'Загрузка...' : 'Загрузить фото'}
										</Text>
									</div>
								</Upload>
							)}
						</div>

						{/* Информация о товаре */}
						<div className={styles.infoSection}>
							<div className={styles.productHeader}>
								<Title level={1} className={styles.productTitle}>
									{product.name}
								</Title>
								<Text className={styles.productSku}>
									Артикул: {product.sku}
								</Text>
							</div>

							{product.description && (
								<div className={styles.descriptionSection}>
									<Title level={4} className={styles.descriptionTitle}>
										Описание
									</Title>
									<Paragraph className={styles.descriptionText}>
										{product.description}
									</Paragraph>
								</div>
							)}

							<div className={styles.priceSection}>
								<Title level={4} className={styles.priceTitle}>
									Цена
								</Title>
								<div className={styles.priceRow}>
									<Text className={styles.currentPrice}>
										{product.price.toLocaleString()} ₽
									</Text>
									{product.discountedPrice && (
										<Text className={styles.oldPrice}>
											{product.discountedPrice.toLocaleString()} ₽
										</Text>
									)}
								</div>
								{product.discountedPrice && (
									<Text className={styles.discountBadge}>
										Экономия: {((product.price - product.discountedPrice) / product.price * 100).toFixed(0)}%
									</Text>
								)}
							</div>

							<div className={styles.metaSection}>
								<Title level={5} className={styles.metaTitle}>
									Информация о товаре
								</Title>
								<div className={styles.metaItem}>
									<span className={styles.metaLabel}>Дата создания:</span>
									<span className={styles.metaValue}>
										{new Date(product.createdAt).toLocaleDateString('ru-RU', {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})}
									</span>
								</div>
								<div className={styles.metaItem}>
									<span className={styles.metaLabel}>Последнее обновление:</span>
									<span className={styles.metaValue}>
										{new Date(product.updatedAt).toLocaleDateString('ru-RU', {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})}
									</span>
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
					okButtonProps={{ danger: true }}
					centered
				>
					<p>Вы уверены, что хотите удалить фотографию товара?</p>
				</Modal>
			</div>
		</div>
	)
}