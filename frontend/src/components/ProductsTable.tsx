import { useState, useMemo } from 'react'
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table'
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table'
import { Button, Input, Select, Space, Upload, message, Modal } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProduct, deleteProductPhoto, uploadProductPhoto } from '../features/products/api'
import type { Product } from '../types/product'

const columnHelper = createColumnHelper<Product>()

interface ProductsTableProps {
	data: Product[]
	onEdit: (product: Product) => void
	onView: (product: Product) => void
}

export default function ProductsTable({ data, onEdit, onView }: ProductsTableProps) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [uploadingId, setUploadingId] = useState<number | null>(null)
	const queryClient = useQueryClient()

	const deleteProductMutation = useMutation({
		mutationFn: deleteProduct,
		onSuccess: () => {
			message.success('Товар удален')
			queryClient.invalidateQueries({ queryKey: ['catalog'] })
		},
		onError: () => message.error('Ошибка удаления товара'),
	})

	const columns = useMemo(
		() => [
			columnHelper.accessor('id', {
				header: 'ID',
				size: 80,
				enableResizing: true,
			}),
			columnHelper.accessor('name', {
				header: 'Название',
				cell: ({ getValue, row }) => (
					<Button 
						type="link" 
						onClick={() => onView(row.original)}
						className="p-0 h-auto text-left font-medium"
					>
						{getValue()}
					</Button>
				),
				enableResizing: true,
			}),
			columnHelper.accessor('sku', {
				header: 'SKU',
				size: 120,
				enableResizing: true,
			}),
			columnHelper.accessor('price', {
				header: 'Цена',
				cell: ({ getValue, row }) => {
					const price = getValue()
					const discountedPrice = row.original.discountedPrice
					return (
						<Space>
							<span className="font-semibold">{price} ₽</span>
							{discountedPrice != null && (
								<span className="text-red-500 line-through">{discountedPrice} ₽</span>
							)}
						</Space>
					)
				},
				enableResizing: true,
			}),
			columnHelper.accessor('photoUrl', {
				header: 'Фото',
				size: 200,
				cell: ({ getValue, row }) => {
					const photoUrl = getValue()
					return (
						<div className="flex items-center gap-2">
							{photoUrl && (
								<img 
									src={photoUrl} 
									className="w-12 h-12 object-cover rounded" 
									alt={row.original.name}
								/>
							)}
							<Upload
								showUploadList={false}
								customRequest={async ({ file, onSuccess, onError }) => {
									try {
										setUploadingId(row.original.id)
										await uploadProductPhoto(row.original.id, file as File)
										onSuccess && onSuccess({}, new XMLHttpRequest())
										message.success('Фото загружено')
										queryClient.invalidateQueries({ queryKey: ['catalog'] })
									} catch (e) {
										onError && onError(new Error('upload failed'))
										message.error('Ошибка загрузки')
									} finally {
										setUploadingId(null)
									}
								}}
							>
								<Button size="small" loading={uploadingId === row.original.id}>
									Загрузить
								</Button>
							</Upload>
							<Button 
								size="small" 
								danger
								onClick={async () => { 
									await deleteProductPhoto(row.original.id)
									message.success('Фото удалено')
									queryClient.invalidateQueries({ queryKey: ['catalog'] })
								}}
							>
								Удалить
							</Button>
						</div>
					)
				},
				enableResizing: true,
			}),
			columnHelper.display({
				id: 'actions',
				header: 'Действия',
				size: 150,
				cell: ({ row }) => (
					<Space>
						<Button size="small" onClick={() => onEdit(row.original)}>
							Редактировать
						</Button>
						<Button 
							size="small" 
							danger 
							onClick={() => {
								Modal.confirm({
									title: 'Удалить товар?',
									okText: 'Удалить',
									okButtonProps: { danger: true },
									onOk: () => deleteProductMutation.mutate(row.original.id),
								})
							}}
						>
							Удалить
						</Button>
					</Space>
				),
				enableResizing: true,
			}),
		],
		[uploadingId, onEdit, onView, deleteProductMutation, queryClient]
	)

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		enableColumnResizing: true,
		columnResizeMode: 'onChange',
	})

	return (
		<div className="space-y-4">
			{/* Фильтры */}
			<div className="flex flex-wrap gap-4 items-center">
				<Input
					placeholder="Поиск по названию..."
					value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
					onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)}
					className="w-64"
				/>
				<Input
					placeholder="Поиск по SKU..."
					value={(table.getColumn('sku')?.getFilterValue() as string) ?? ''}
					onChange={(e) => table.getColumn('sku')?.setFilterValue(e.target.value)}
					className="w-48"
				/>
			</div>

			{/* Таблица */}
			<div className="border rounded-lg overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							{table.getHeaderGroups().map(headerGroup => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map(header => (
										<th
											key={header.id}
											className="px-4 py-3 text-left text-sm font-medium text-gray-500 border-b relative"
											style={{ width: header.getSize() }}
										>
											{header.isPlaceholder ? null : (
												<div
													className={`flex items-center gap-2 ${
														header.column.getCanSort() ? 'cursor-pointer select-none' : ''
													}`}
													onClick={header.column.getToggleSortingHandler()}
												>
													{flexRender(header.column.columnDef.header, header.getContext())}
													{{
														asc: ' ↑',
														desc: ' ↓',
													}[header.column.getIsSorted() as string] ?? null}
												</div>
											)}
											{header.column.getCanResize() && (
												<div
													className="absolute right-0 top-0 h-full w-1 bg-gray-300 cursor-col-resize select-none touch-none"
													onMouseDown={header.getResizeHandler()}
													onTouchStart={header.getResizeHandler()}
												/>
											)}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody className="divide-y divide-gray-200">
							{table.getRowModel().rows.map(row => (
								<tr key={row.id} className="hover:bg-gray-50">
									{row.getVisibleCells().map(cell => (
										<td
											key={cell.id}
											className="px-4 py-3 text-sm text-gray-900"
											style={{ width: cell.column.getSize() }}
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Пагинация */}
			<div className="flex items-center justify-between">
				<div className="text-sm text-gray-700">
					Показано {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} -{' '}
					{Math.min(
						(table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
						table.getFilteredRowModel().rows.length
					)}{' '}
					из {table.getFilteredRowModel().rows.length} записей
				</div>
				<div className="flex items-center gap-2">
					<Button
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
						size="small"
					>
						{'<<'}
					</Button>
					<Button
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						size="small"
					>
						{'<'}
					</Button>
					<Button
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						size="small"
					>
						{'>'}
					</Button>
					<Button
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
						size="small"
					>
						{'>>'}
					</Button>
					<Select
						value={table.getState().pagination.pageSize}
						onChange={(value) => table.setPageSize(Number(value))}
						className="w-20"
						size="small"
					>
						<Select.Option value={10}>10</Select.Option>
						<Select.Option value={20}>20</Select.Option>
						<Select.Option value={50}>50</Select.Option>
						<Select.Option value={100}>100</Select.Option>
					</Select>
				</div>
			</div>
		</div>
	)
}
