import { Input, Select, Space, Button, Modal, Table } from 'antd'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCatalogQuery } from './hooks'
import ProductForm from '../../components/ProductForm'

export default function CatalogPage() {
	const [search, setSearch] = useSearchParams()
	const [isModalOpen, setIsModalOpen] = useState(false)

	// Обычная пагинация
	const { data, isLoading, refetch } = useCatalogQuery()

	const page = Number(search.get('page') || 1)
	const limit = Number(search.get('limit') || 12)
	const sort = search.get('sort') || 'createdAt'
	const order = (search.get('order') || 'DESC') as 'ASC' | 'DESC'

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
				dataSource={data?.data}
				pagination={{
					current: page,
					total: data?.total || 0,
					pageSize: limit,
					onChange: (p: number, ps: number) => {
						const next = new URLSearchParams(search)
						next.set('page', String(p))
						next.set('limit', String(ps))
						setSearch(next, { replace: true })
					},
				}}
				loading={isLoading}
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


