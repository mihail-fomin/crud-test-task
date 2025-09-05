import { Input, Select, Space, Table } from 'antd'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCatalogQuery } from './hooks'

export default function CatalogPage() {
	const [search, setSearch] = useSearchParams()
	const { data, isLoading } = useCatalogQuery()

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

	return (
		<div className="space-y-6">
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
					onChange: (p, ps) => {
						const next = new URLSearchParams(search)
						next.set('page', String(p))
						next.set('limit', String(ps))
						setSearch(next, { replace: true })
					},
				}}
				loading={isLoading}
			/>
		</div>
	)
}


