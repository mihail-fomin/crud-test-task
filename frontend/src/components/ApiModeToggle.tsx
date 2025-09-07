import { useState, useEffect } from 'react'
import { Switch, Card, Typography, Space, Tag } from 'antd'
import { isMockMode } from '../config/api'

const { Text, Title } = Typography

export default function ApiModeToggle() {
	const [isMock, setIsMock] = useState(isMockMode())

	useEffect(() => {
		// Обновляем состояние при изменении конфигурации
		setIsMock(isMockMode())
	}, [])

	const handleToggle = (checked: boolean) => {
		// В реальном приложении здесь можно было бы сохранить настройку в localStorage
		// или отправить на сервер для изменения конфигурации
		setIsMock(checked)
		
		// Показываем уведомление
		if (checked) {
			console.log('Переключено на мок данные')
		} else {
			console.log('Переключено на реальный API')
		}
	}

	return (
		<Card size="small" className="mb-4">
			<div className="flex justify-between items-center">
				<div>
					<Title level={5} className="mb-1">Режим API</Title>
					<Space>
						<Text type="secondary">Источник данных:</Text>
						<Tag color={isMock ? 'orange' : 'green'}>
							{isMock ? 'Мок данные' : 'Реальный API'}
						</Tag>
					</Space>
				</div>
				<Switch
					checked={isMock}
					onChange={handleToggle}
					checkedChildren="Мок"
					unCheckedChildren="API"
				/>
			</div>
			{isMock && (
				<Text type="secondary" className="text-xs block mt-2">
					⚠️ В режиме мок данных все операции выполняются локально
				</Text>
			)}
		</Card>
	)
}
