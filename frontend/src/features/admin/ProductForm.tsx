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
  readOnly = false,
}: {
	defaultValues?: Partial<Product>
	onSubmit: (values: ProductFormValues) => void | Promise<void>
  submitting?: boolean
  readOnly?: boolean
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
		<div className="space-y-4">
			<div>
				<label className="block text-sm mb-1">Название</label>
				<Input {...register('name')} readOnly={readOnly} />
				{errors.name && <div className="text-red-500 text-xs mt-1">{errors.name.message}</div>}
			</div>
			<div>
				<label className="block text-sm mb-1">Описание</label>
				<Input.TextArea rows={3} {...register('description')} readOnly={readOnly} />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				<div>
					<label className="block text-sm mb-1">Цена</label>
					<Controller
						name="price"
						control={control}
						render={({ field }) => (
							<InputNumber className="w-full" min={0} step={0.01} {...field} readOnly={readOnly} />
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
							<InputNumber className="w-full" min={0} step={0.01} {...field} readOnly={readOnly} />
						)}
					/>
				</div>
				<div>
					<label className="block text-sm mb-1">Артикул</label>
					<Input {...register('sku')} readOnly={readOnly} />
					{errors.sku && <div className="text-red-500 text-xs mt-1">{errors.sku.message}</div>}
				</div>
			</div>
			{!readOnly && (
				<div className="flex justify-end gap-2">
					<Button htmlType="submit" type="primary" loading={submitting} onClick={handleSubmit(onSubmit)}>
						Сохранить
					</Button>
				</div>
			)}
		</div>
	)
}


