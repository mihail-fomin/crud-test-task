import { Switch, Card, Typography, Space, Tag, message } from 'antd'
import { useApiMode } from '../contexts/ApiContext'

const { Text, Title } = Typography

export default function ApiModeToggle() {
	const { isMockMode, toggleApiMode } = useApiMode()

	const handleToggle = (checked: boolean) => {
		toggleApiMode()
		
		// Показываем уведомление
		if (checked) {
			message.info('Переключено на мок данные')
		} else {
			message.success('Переключено на реальный API')
		}
	}

	return (
		<Card size="small" className="mb-4">
			<div className="flex justify-between items-center">
				<div>
					<Title level={5} className="mb-1">Режим API</Title>
					<Space>
						<Text type="secondary">Источник данных:</Text>
						<Tag color={isMockMode ? 'orange' : 'green'}>
							{isMockMode ? 'Мок данные' : 'Реальный API'}
						</Tag>
					</Space>
				</div>
				<Switch
					checked={isMockMode}
					onChange={handleToggle}
					checkedChildren="Мок"
					unCheckedChildren="API"
				/>
			</div>
			{isMockMode && (
				<Text type="secondary" className="block mt-2 text-xs">
					⚠️ В режиме мок данных все операции выполняются локально
				</Text>
			)}
		</Card>
	)
}
