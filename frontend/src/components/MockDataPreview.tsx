import { useState } from 'react'
import { Card, Button, Space, Typography, Switch, message } from 'antd'
import { useMockCatalogQuery } from '../hooks/useMockData'
import MockProductsTable from './MockProductsTable'
import type { Product } from '../types/product'

const { Title, Text } = Typography

interface MockDataPreviewProps {
	onEdit: (product: Product) => void
	onView: (product: Product) => void
}

export default function MockDataPreview({ onEdit, onView }: MockDataPreviewProps) {
	const [showMockData, setShowMockData] = useState(false)
	const { data: mockData, isLoading } = useMockCatalogQuery()

	const handleToggleMockData = (checked: boolean) => {
		setShowMockData(checked)
		if (checked) {
			message.success('Мок данные включены')
		} else {
			message.info('Мок данные отключены')
		}
	}

	if (!showMockData) {
		return (
			<Card className="mb-6">
				<div className="text-center py-4">
					<Title level={4}>Демонстрация мок данных</Title>
					<Text type="secondary" className="block mb-4">
						Включите мок данные для просмотра демонстрационных товаров
					</Text>
					<Switch 
						checked={showMockData}
						onChange={handleToggleMockData}
						checkedChildren="Включено"
						unCheckedChildren="Выключено"
					/>
				</div>
			</Card>
		)
	}

	return (
		<Card className="mb-6">
			<div className="flex justify-between items-center mb-4">
				<div>
					<Title level={4}>Мок данные товаров</Title>
					<Text type="secondary">
						Показаны {mockData?.total || 0} товаров из мок данных
					</Text>
				</div>
				<Space>
					<Switch 
						checked={showMockData}
						onChange={handleToggleMockData}
						checkedChildren="Мок данные"
						unCheckedChildren="Реальные данные"
					/>
					<Button href="/mock-data" type="primary">
						Полная демонстрация
					</Button>
				</Space>
			</div>

			{isLoading ? (
				<div className="text-center py-8">
					<Text>Загрузка мок данных...</Text>
				</div>
			) : (
				<MockProductsTable 
					data={mockData?.data || []} 
					onEdit={onEdit} 
					onView={onView} 
				/>
			)}
		</Card>
	)
}
