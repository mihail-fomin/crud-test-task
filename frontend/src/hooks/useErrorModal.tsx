import { useState } from 'react'
import { Modal } from 'antd'

interface ErrorModalConfig {
	title: string
	content: string
	okText: string
	type: 'error' | 'warning' | 'info' | 'success'
}

interface ErrorData {
	message: string
	status?: number
}

export function useErrorModal() {
	const [modalVisible, setModalVisible] = useState(false)
	const [modalConfig, setModalConfig] = useState<ErrorModalConfig | null>(null)

	const showErrorModal = (error: ErrorData, customConfig?: Partial<ErrorModalConfig>) => {
        console.log('error: ', error);
		const defaultConfig: ErrorModalConfig = {
			title: '🚨 Ошибка',
			content: error.message,
			okText: 'Понятно',
			type: 'error'
		}

		// Определяем тип модалки на основе статуса ошибки
		let modalType: 'error' | 'warning' | 'info' | 'success' = 'error'
		let title = '🚨 Ошибка'
		let okText = 'Понятно'

		if (error.status) {
			switch (error.status) {
				case 400:
					modalType = 'warning'
					title = '⚠️ Неверный запрос'
					okText = 'Исправить'
					break
				case 401:
					modalType = 'warning'
					title = '🔐 Не авторизован'
					okText = 'Войти'
					break
				case 403:
					modalType = 'warning'
					title = '🚫 Доступ запрещен'
					okText = 'Понятно'
					break
				case 404:
					modalType = 'info'
					title = '🔍 Не найдено'
					okText = 'Понятно'
					break
				case 413:
					modalType = 'error'
					title = '📁 Размер файла превышен'
					okText = 'Понятно'
					break
				case 415:
					modalType = 'error'
					title = '📄 Неподдерживаемый тип файла'
					okText = 'Понятно'
					break
				case 500:
					modalType = 'error'
					title = '💥 Внутренняя ошибка сервера'
					okText = 'Понятно'
					break
				case 0:
					modalType = 'error'
					title = '🌐 Сетевая ошибка'
					okText = 'Повторить'
					break
				default:
					if (error.status >= 200 && error.status < 300) {
						modalType = 'success'
						title = '✅ Успех'
						okText = 'Отлично!'
					} else if (error.status >= 400 && error.status < 500) {
						modalType = 'warning'
						title = '⚠️ Ошибка клиента'
						okText = 'Понятно'
					} else if (error.status >= 500) {
						modalType = 'error'
						title = '💥 Ошибка сервера'
						okText = 'Понятно'
					}
			}
		}

		const config: ErrorModalConfig = {
			...defaultConfig,
			...customConfig,
			title: customConfig?.title || title,
			content: customConfig?.content || error.message,
			okText: customConfig?.okText || okText,
			type: customConfig?.type || modalType
		}

		setModalConfig(config)
		setModalVisible(true)
	}

	const showCustomModal = (config: ErrorModalConfig) => {
		setModalConfig(config)
		setModalVisible(true)
	}

	const hideModal = () => {
		setModalVisible(false)
	}

	const ModalComponent = () => {
		if (!modalConfig) return null

		return (
			<Modal
				title={modalConfig.title}
				open={modalVisible}
				onOk={hideModal}
				onCancel={hideModal}
				okText={modalConfig.okText}
				width={500}
				centered
				style={{ top: 20 }}
			>
				<div style={{ fontSize: '16px', lineHeight: '1.6' }}>
					<p style={{ whiteSpace: 'pre-line' }}>{modalConfig.content}</p>
				</div>
			</Modal>
		)
	}

	return {
		showErrorModal,
		showCustomModal,
		hideModal,
		ModalComponent,
		isVisible: modalVisible
	}
}
