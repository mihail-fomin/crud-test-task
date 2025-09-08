import { useState } from 'react'
import { Image } from 'antd'
import { getProductImageUrl } from '../utils/imageUtils'

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

	const imageUrl = getProductImageUrl(src)

	// Если нет URL или произошла ошибка загрузки
	if (!imageUrl || imageError) {
		return (
			<div className={`bg-gray-100 ${className} ${fallbackClassName}`}>
				<Image className="text-4xl" src="/images/product-default-image.png" />
			</div>
		)
	}

	return (
		<div className="relative w-full h-full" style={{ zIndex: 1 }}>
			<Image
				src={imageUrl}
				alt={alt}
				className={className}
				style={{ zIndex: 1, width: '100%', height: '100%' }}
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
				<div 
					className={`absolute inset-0 bg-gray-100 ${fallbackClassName}`}
					style={{ zIndex: 2 }}
				>
					<div className="w-8 h-8 rounded-full border-b-2 border-gray-400 animate-spin"></div>
				</div>
			)}
		</div>
	)
}
