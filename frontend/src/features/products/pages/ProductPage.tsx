import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchProduct } from '../../products/api'
import ProductImage from '../../../components/ProductImage'

export default function ProductPage() {
	const params = useParams()
	const id = Number(params.id)
	const { data, isLoading } = useQuery({ queryKey: ['product', id], queryFn: () => fetchProduct(id), enabled: !!id })

	if (isLoading) return <div>Загрузка...</div>
	if (!data) return <div>Товар не найден</div>

	return (
		<div className="space-y-3">
			<h2 className="text-xl font-semibold">{data.name}</h2>
			<ProductImage
				src={data.photoUrl}
				alt={data.name}
				className="max-w-xs rounded"
			/>
			<div>SKU: {data.sku}</div>
			<div>
				Цена: {data.price}
				{data.discountedPrice != null && <span className="ml-2 text-red-500">{data.discountedPrice}</span>}
			</div>
			<p className="text-sm opacity-80 whitespace-pre-wrap">{data.description}</p>
		</div>
	)
}


