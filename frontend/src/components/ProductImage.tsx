import { useState } from 'react'
import { PictureOutlined } from '@ant-design/icons'
import { getProductImageUrl } from '../utils/imageUtils'
import { useIsMockMode } from '../hooks/useApiMode'

interface ProductImageProps {
	src?: string | null
	alt: string
	className?: string
	fallbackClassName?: string
}

export default function ProductImage({ 
	src, 
	alt, 
	className = "object-cover w-full h-full",
	fallbackClassName = "flex items-center justify-center text-gray-400"
}: ProductImageProps) {
	const [imageError, setImageError] = useState(false)
	const [imageLoading, setImageLoading] = useState(true)
	const isMockMode = useIsMockMode()

	// Получаем правильный URL для изображения
	const imageUrl = getProductImageUrl(src, isMockMode)

	// Если нет URL или произошла ошибка загрузки
	if (!imageUrl || imageError) {
		return (
			<div className={`bg-gray-100 ${className} ${fallbackClassName}`}>
				<PictureOutlined className="text-4xl" />
			</div>
		)
	}

	return (
		<div className="relative">
			<img
				src={imageUrl}
				alt={alt}
				className={className}
				onError={() => {
					console.log('Image failed to load:', imageUrl)
					setImageError(true)
				}}
				onLoad={() => {
					console.log('Image loaded successfully:', imageUrl)
					setImageLoading(false)
				}}
				loading="lazy"
			/>
			{imageLoading && (
				<div className={`absolute inset-0 bg-gray-100 ${fallbackClassName}`}>
					<div className="w-8 h-8 rounded-full border-b-2 border-gray-400 animate-spin"></div>
				</div>
			)}
		</div>
	)
}
