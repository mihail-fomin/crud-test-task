import { Button, Modal, Table, Upload, message } from 'antd'
import { useMemo, useState } from 'react'
import { useCatalogQuery } from '../catalog/hooks'
import { deleteProduct, deleteProductPhoto, uploadProductPhoto } from '../products/api'

export default function AdminPage() {
	const { data, isLoading, refetch } = useCatalogQuery()
	const [uploadingId, setUploadingId] = useState<number | null>(null)

	const columns = useMemo(
		() => [
			{ title: 'ID', dataIndex: 'id' },
			{ title: 'Название', dataIndex: 'name' },
			{ title: 'SKU', dataIndex: 'sku' },
			{ title: 'Цена', dataIndex: 'price' },
			{
				title: 'Фото',
				render: (_: any, row: any) => (
					<div className="flex items-center gap-2">
						{row.photoUrl && <img src={row.photoUrl} className="w-14 h-14 object-cover rounded" />}
						<Upload
							showUploadList={false}
							customRequest={async ({ file, onSuccess, onError }) => {
								try {
									setUploadingId(row.id)
									await uploadProductPhoto(row.id, file as File)
									onSuccess && onSuccess({}, new XMLHttpRequest())
									message.success('Фото загружено')
									refetch()
								} catch (e) {
									onError && onError(new Error('upload failed'))
									message.error('Ошибка загрузки')
								} finally {
									setUploadingId(null)
								}
							}}
						>
							<Button loading={uploadingId === row.id}>Загрузить</Button>
						</Upload>
						<Button onClick={async () => { await deleteProductPhoto(row.id); message.success('Фото удалено'); refetch() }}>Удалить фото</Button>
					</div>
				),
			},
			{
				title: 'Действия',
				render: (_: any, row: any) => (
					<div className="flex gap-2">
						<Button danger onClick={() => confirmDelete(row.id, refetch)}>Удалить</Button>
					</div>
				),
			},
		],
		[uploadingId, refetch],
	)

	return (
		<Table rowKey="id" loading={isLoading} columns={columns as any} dataSource={data?.data} />
	)
}

function confirmDelete(id: number, refetch: () => void) {
	Modal.confirm({
		title: 'Удалить товар?',
		okText: 'Удалить',
		okButtonProps: { danger: true },
		onOk: async () => {
			await deleteProduct(id)
			message.success('Товар удален')
			refetch()
		},
	})
}


