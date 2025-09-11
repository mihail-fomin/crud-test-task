import { useState } from 'react'
import { Image, Upload, Button, Tooltip } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { getProductImageUrl } from '../utils/imageUtils'
import styles from './ProductsCatalog.module.scss'

interface ProductImageProps {
	src?: string | null
	alt: string
	className?: string
	fallbackClassName?: string
	onUpload?: (file: File) => void
	onDelete?: () => void
	uploading?: boolean
}

export default function ProductImage({ 
	src, 
	alt, 
	className = "object-cover w-full h-full",
	fallbackClassName = "flex items-center justify-center text-gray-400",
	onUpload,
	onDelete,
	uploading = false
}: ProductImageProps) {
	const [imageError, setImageError] = useState(false)
	const [imageLoading, setImageLoading] = useState(true)

	const imageUrl = getProductImageUrl(src)

	// Если нет URL или произошла ошибка загрузки
	if (!imageUrl || imageError) {
		const defaultImageContent = (
			<div className={`relative bg-gray-100 ${className} ${fallbackClassName}`}>
				<Image className="text-4xl" src="/images/product-default-image.png" />
				{onUpload && (
					<div className={styles.defaultImageHover}>
						<div className={styles.uploadHint}>
							{uploading ? 'Загрузка...' : 'Загрузить фото'}
						</div>
					</div>
				)}
			</div>
		)

		// Если есть обработчик загрузки, оборачиваем в Upload
		if (onUpload) {
			return (
				<Upload
					showUploadList={false}
					accept="image/*"
					beforeUpload={(file) => {
						onUpload(file)
						return false
					}}
					disabled={uploading}
				>
					{defaultImageContent}
				</Upload>
			)
		}

		return defaultImageContent
	}

	return (
		<div className="relative w-full h-full" style={{ zIndex: 1 }}>
			<Image
				src={imageUrl}
				alt={alt}
				className={className}
				style={{ zIndex: 1, width: '100%', height: '100%' }}
				onError={() => {
					setImageError(true)
				}}
				onLoad={() => {
					setImageLoading(false)
				}}
				loading="lazy"
			/>
			{imageLoading && (
				<div 
					className={`absolute inset-0 bg-gray-100 ${fallbackClassName}`}
					style={{ zIndex: 2 }}
				>
					<div className="w-8 h-8 rounded-full border-b-2 border-gray-400 animate-spin"></div>
				</div>
			)}
			{onDelete && !imageLoading && (
				<Tooltip title="Удалить фотографию" placement="top">
					<Button
						type="text"
						danger
						icon={<CloseOutlined />}
						className={styles.deletePhotoButton}
						onClick={(e) => {
							e.stopPropagation()
							onDelete()
						}}
					/>
				</Tooltip>
			)}
		</div>
	)
}
