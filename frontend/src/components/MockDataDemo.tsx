import { useState } from 'react'
import { Button, Card, Space, Typography, Switch, message } from 'antd'
import { useMockCatalogQuery, useMockInfiniteCatalogQuery } from '../hooks/useMockData'
import MockProductsTable from './MockProductsTable'
import MockInfiniteProductsTable from './MockInfiniteProductsTable'

const { Title, Text } = Typography

interface MockDataDemoProps {
	onEdit: (product: any) => void
	onView: (product: any) => void
}

export default function MockDataDemo({ onEdit, onView }: MockDataDemoProps) {
	const [useInfiniteScroll, setUseInfiniteScroll] = useState(false)
	const [showMockData, setShowMockData] = useState(false)

	const { data: catalogData, isLoading: catalogLoading, error: catalogError } = useMockCatalogQuery()
	const { 
		data: infiniteData, 
		isLoading: infiniteLoading, 
		error: infiniteError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	} = useMockInfiniteCatalogQuery()

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
			<Card className="w-full">
				<div className="text-center py-8">
					<Title level={3}>Демонстрация мок данных</Title>
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
		<div className="space-y-6">
			<Card>
				<div className="flex justify-between items-center mb-4">
					<div>
						<Title level={3}>Демонстрация мок данных</Title>
						<Text type="secondary">
							Показаны {catalogData?.total || 0} товаров из мок данных
						</Text>
					</div>
					<Space>
						<Switch 
							checked={useInfiniteScroll}
							onChange={setUseInfiniteScroll}
							checkedChildren="Бесконечный скролл"
							unCheckedChildren="Обычная пагинация"
						/>
						<Switch 
							checked={showMockData}
							onChange={handleToggleMockData}
							checkedChildren="Мок данные"
							unCheckedChildren="Реальные данные"
						/>
					</Space>
				</div>

				{useInfiniteScroll ? (
					<MockInfiniteProductsTable onEdit={onEdit} onView={onView} />
				) : (
					<MockProductsTable 
						data={catalogData?.data || []} 
						onEdit={onEdit} 
						onView={onView} 
					/>
				)}
			</Card>

			<Card>
				<Title level={4}>Информация о мок данных</Title>
				<div className="space-y-2">
					<Text>
						<strong>Всего товаров:</strong> {catalogData?.total || 0}
					</Text>
					<Text>
						<strong>Текущая страница:</strong> {catalogData?.page || 1}
					</Text>
					<Text>
						<strong>Товаров на странице:</strong> {catalogData?.limit || 12}
					</Text>
					<Text>
						<strong>Режим отображения:</strong> {useInfiniteScroll ? 'Бесконечный скролл' : 'Обычная пагинация'}
					</Text>
				</div>
			</Card>
		</div>
	)
}
