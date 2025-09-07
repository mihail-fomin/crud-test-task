import { Card, Typography } from 'antd'
import InfiniteProductsTable from './InfiniteProductsTable'

const { Title, Text } = Typography

interface MockDataDemoProps {
	onEdit: (product: any) => void
	onView: (product: any) => void
}

export default function MockDataDemo({ onEdit, onView }: MockDataDemoProps) {
	return (
		<div className="space-y-6">
			<Card>
				<div className="mb-4">
					<Title level={3}>Демонстрация мок данных</Title>
					<Text type="secondary">
						Таблица с бесконечным скроллом и мок данными для демонстрации функциональности
					</Text>
				</div>

				<InfiniteProductsTable onEdit={onEdit} onView={onView} />
			</Card>

			<Card>
				<Title level={4}>Информация о мок данных</Title>
				<div className="space-y-2">
					<Text>
						<strong>Всего товаров:</strong> 100 (генерируются автоматически)
					</Text>
					<Text>
						<strong>Функции:</strong> Поиск, сортировка, фильтрация, загрузка фото
					</Text>
					<Text>
						<strong>Режим отображения:</strong> Бесконечный скролл
					</Text>
					<Text>
						<strong>Примечание:</strong> Все операции выполняются с мок данными
					</Text>
				</div>
			</Card>
		</div>
	)
}
