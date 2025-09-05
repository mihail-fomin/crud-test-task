import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input, InputNumber } from 'antd'
import type { Product } from '../../types/product'

const schema = z.object({
	name: z.string().min(1, 'Укажите название'),
	description: z.string().optional().nullable(),
	price: z
		.number({ invalid_type_error: 'Цена должна быть числом' })
		.positive('Цена должна быть > 0'),
	discountedPrice: z
		.number({ invalid_type_error: 'Цена со скидкой должна быть числом' })
		.positive('Цена со скидкой должна быть > 0')
		.optional()
		.nullable(),
	sku: z.string().min(1, 'Укажите артикул'),
})

export type ProductFormValues = z.infer<typeof schema>

export function ProductForm({
	defaultValues,
	onSubmit,
  submitting,
}: {
	defaultValues?: Partial<Product>
	onSubmit: (values: ProductFormValues) => void | Promise<void>
  submitting?: boolean
}) {
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ProductFormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: defaultValues?.name || '',
			description: defaultValues?.description || '',
			price: defaultValues?.price ?? 0,
			discountedPrice: defaultValues?.discountedPrice ?? undefined,
			sku: defaultValues?.sku || '',
		},
	})

	return (
		<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label className="block text-sm mb-1">Название</label>
				<Input {...register('name')} />
				{errors.name && <div className="text-red-500 text-xs mt-1">{errors.name.message}</div>}
			</div>
			<div>
				<label className="block text-sm mb-1">Описание</label>
				<Input.TextArea rows={3} {...register('description')} />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				<div>
					<label className="block text-sm mb-1">Цена</label>
					<Controller
						name="price"
						control={control}
						render={({ field }) => (
							<InputNumber className="w-full" min={0} step={0.01} {...field} />
						)}
					/>
					{errors.price && <div className="text-red-500 text-xs mt-1">{errors.price.message}</div>}
				</div>
				<div>
					<label className="block text-sm mb-1">Цена со скидкой</label>
					<Controller
						name="discountedPrice"
						control={control}
						render={({ field }) => (
							<InputNumber className="w-full" min={0} step={0.01} {...field} />
						)}
					/>
				</div>
				<div>
					<label className="block text-sm mb-1">Артикул</label>
					<Input {...register('sku')} />
					{errors.sku && <div className="text-red-500 text-xs mt-1">{errors.sku.message}</div>}
				</div>
			</div>
			<div className="flex justify-end gap-2">
				<Button htmlType="submit" type="primary" loading={submitting}>Сохранить</Button>
			</div>
		</form>
	)
}


