import { useNavigate } from 'react-router-dom'
import { Button, Space } from 'antd'
import InfiniteProductsTable from '../components/InfiniteProductsTable'
import MockDataPreview from '../components/MockDataPreview'
import type { Product } from '../types/product'

export default function MainPage() {
	const navigate = useNavigate()

	const handleAdd = () => {
		navigate('/admin')
	}

	const handleEdit = (product: Product) => {
		navigate(`/admin?edit=${product.id}`)
	}

	const handleView = (product: Product) => {
		// Теперь используется навигация на отдельную страницу
		console.log('View product:', product)
	}


	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold text-gray-900">Каталог товаров</h1>
				<Space>
					<Button size="large" href="/mock-data">
						Демо мок данных
					</Button>
					<Button type="primary" size="large" onClick={handleAdd}>
						Добавить товар
					</Button>
				</Space>
			</div>

			<MockDataPreview onEdit={handleEdit} onView={handleView} />

			<InfiniteProductsTable 
				onEdit={handleEdit}
				onView={handleView}
			/>

		</div>
	)
}
