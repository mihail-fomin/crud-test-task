import { Input, Select, Space, Button, Modal, Table, Spin, Alert } from 'antd'
import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useInfiniteCatalogQuery } from './hooks'
import ProductForm from '../../components/ProductForm'
import { useInView } from 'react-intersection-observer'

export default function CatalogPage() {
	const [search, setSearch] = useSearchParams()
	const [isModalOpen, setIsModalOpen] = useState(false)

	// Бесконечная прокрутка
	const {
		data,
		isLoading,
		isError,
		error,
		hasNextPage,
		isFetchingNextPage,
		refetch
	} = useInfiniteCatalogQuery()

	const sort = search.get('sort') || 'createdAt'
	const order = (search.get('order') || 'DESC') as 'ASC' | 'DESC'

	// Объединяем все страницы в один массив товаров
	const allProducts = useMemo(() => {
		return data?.pages.flatMap(page => page.data) || []
	}, [data])

	// Настройка для отслеживания скролла
	const { ref: loadMoreRef } = useInView({
		threshold: 0.1,
		rootMargin: '100px'
	})

	const columns = useMemo(
		() => [
			{
				title: 'Название',
				dataIndex: 'name',
				key: 'name',
				render: (text: string) => text,
			},
			{
				title: 'Цена',
				dataIndex: 'price',
				key: 'price',
				render: (value: number, row: any) => (
					<Space>
						<span>{value}</span>
						{row.discountedPrice != null && <span className="text-red-500">{row.discountedPrice}</span>}
					</Space>
				),
			},
			{ title: 'Артикул', dataIndex: 'sku', key: 'sku' },
		],
		[],
	)

	const handleModalClose = () => {
		setIsModalOpen(false)
	}

	const handleFormSuccess = () => {
		handleModalClose()
		refetch()
	}

	// Обработка ошибок
	if (isError) {
		return (
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold text-gray-900">Каталог товаров</h1>
					<Button type="primary" size="large" onClick={() => setIsModalOpen(true)}>
						Добавить товар
					</Button>
				</div>
				<Alert
					message="Ошибка загрузки"
					description={error?.message || 'Произошла ошибка при загрузке товаров'}
					type="error"
					showIcon
					action={
						<Button size="small" onClick={() => refetch()}>
							Повторить
						</Button>
					}
				/>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold text-gray-900">Каталог товаров</h1>
				<Button type="primary" size="large" onClick={() => setIsModalOpen(true)}>
					Добавить товар
				</Button>
			</div>

			<div className="flex flex-wrap gap-3">
				<Input.Search
					placeholder="Поиск..."
					defaultValue={search.get('q') || ''}
					onSearch={(q) => {
						const next = new URLSearchParams(search)
						q ? next.set('q', q) : next.delete('q')
						// Удаляем page из URL при поиске, чтобы начать с первой страницы
						next.delete('page')
						setSearch(next, { replace: true })
					}}
					allowClear
				/>
				<Select
					value={`${sort}:${order}`}
					className="w-[220px]"
					onChange={(val) => {
						const [s, o] = val.split(':')
						const next = new URLSearchParams(search)
						next.set('sort', s)
						next.set('order', o)
						// Удаляем page из URL при изменении сортировки
						next.delete('page')
						setSearch(next, { replace: true })
					}}
					options={[
						{ value: 'createdAt:DESC', label: 'Сначала новые' },
						{ value: 'price:ASC', label: 'Цена: по возрастанию' },
						{ value: 'price:DESC', label: 'Цена: по убыванию' },
					]}
				/>
			</div>

			<Table
				rowKey="id"
				columns={columns as any}
				dataSource={allProducts}
				pagination={false}
				loading={isLoading}
				scroll={{ y: 600 }}
			/>



			<Modal
				title="Добавить товар"
				open={isModalOpen}
				onCancel={handleModalClose}
				footer={null}
				width={800}
			>
				<ProductForm
					onSuccess={handleFormSuccess}
					onCancel={handleModalClose}
					mode="create"
				/>
			</Modal>
		</div>
	)
}


