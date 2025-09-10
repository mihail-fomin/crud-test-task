import { message } from 'antd'

export interface ApiError {
	message: string
	status?: number
	statusText?: string
}

export interface ErrorDetails {
	title: string
	description: string
	canRetry: boolean
	status?: number
}

/**
 * Обрабатывает API ошибки и возвращает детальную информацию для пользователя
 */
export function handleApiError(error: any): ErrorDetails {

	// Сетевые ошибки
	if (error instanceof TypeError || error.status === 0) {
		return {
			title: 'Ошибка сети',
			description: 'Проверьте подключение к интернету и попробуйте снова',
			canRetry: true,
			status: 0
		}
	}

	// HTTP ошибки
	if (error.status) {
		switch (error.status) {
			case 400:
				return {
					title: 'Некорректный запрос',
					description: error.message || 'Проверьте правильность введенных данных',
					canRetry: false,
					status: 400
				}
			case 401:
				return {
					title: 'Ошибка авторизации',
					description: 'Необходимо войти в систему',
					canRetry: false,
					status: 401
				}
			case 404:
				return {
					title: 'Не найдено',
					description: 'Запрашиваемый ресурс не найден',
					canRetry: false,
					status: 404
				}
			case 413:
				return {
					title: 'Файл слишком большой',
					description: 'Размер файла превышает максимально допустимый (10MB)',
					canRetry: false,
					status: 413
				}
			case 415:
				return {
					title: 'Неподдерживаемый тип файла',
					description: 'Пожалуйста, выберите изображение в формате JPG, PNG или GIF',
					canRetry: false,
					status: 415
				}
			case 422:
				return {
					title: 'Ошибка валидации',
					description: error.message || 'Проверьте правильность введенных данных',
					canRetry: false,
					status: 422
				}
			case 429:
				return {
					title: 'Слишком много запросов',
					description: 'Попробуйте снова через несколько секунд',
					canRetry: true,
					status: 429
				}
			case 500:
				return {
					title: 'Ошибка сервера',
					description: 'Временная проблема на сервере. Попробуйте позже',
					canRetry: true,
					status: 500
				}
			case 502:
			case 503:
			case 504:
				return {
					title: 'Сервер недоступен',
					description: 'Сервер временно недоступен. Попробуйте позже',
					canRetry: true,
					status: error.status
				}
			default:
				return {
					title: 'Ошибка сервера',
					description: error.message || `Ошибка ${error.status}: ${error.statusText || 'Неизвестная ошибка'}`,
					canRetry: error.status >= 500,
					status: error.status
				}
		}
	}

	// Ошибки валидации файлов
	if (error.message?.includes('размер') || error.message?.includes('size')) {
		return {
			title: 'Файл слишком большой',
			description: 'Размер файла не должен превышать 10MB',
			canRetry: false,
			status: 413
		}
	}

	if (error.message?.includes('тип') || error.message?.includes('type')) {
		return {
			title: 'Неподдерживаемый тип файла',
			description: 'Пожалуйста, выберите изображение',
			canRetry: false,
			status: 415
		}
	}

	// Общая ошибка
	return {
		title: 'Произошла ошибка',
		description: error.message || 'Попробуйте снова позже',
		canRetry: true,
		status: undefined
	}
}

/**
 * Показывает уведомление об ошибке с возможностью повтора
 */
export function showErrorNotification(error: any, onRetry?: () => void) {
	const errorDetails = handleApiError(error)
	
	// Для критических ошибок используем более заметные уведомления
	if (errorDetails.status === 413 || errorDetails.status === 415 || errorDetails.status === 422) {
		message.error({
			content: `🚨 ${errorDetails.title}: ${errorDetails.description}`,
			duration: 8,
			style: {
				marginTop: '20vh',
				fontSize: '16px',
				fontWeight: 'bold'
			}
		})
	} else if (errorDetails.canRetry && onRetry) {
		message.error({
			content: `⚠️ ${errorDetails.title}: ${errorDetails.description}`,
			duration: 6,
			onClick: onRetry,
			style: {
				marginTop: '20vh',
				fontSize: '16px',
				fontWeight: 'bold',
				cursor: 'pointer'
			}
		})
	} else {
		message.error({
			content: `${errorDetails.title}: ${errorDetails.description}`,
			duration: 4
		})
	}
}

/**
 * Показывает случайную модалку для тестирования
 */
export function showRandomModal() {
	console.log('showRandomModal called')
	
	const modalTypes = ['error', 'warning', 'info', 'success']
	const randomType = modalTypes[Math.floor(Math.random() * modalTypes.length)]
	console.log('Random type selected:', randomType)
	
	const baseContent = 'Это случайная модалка из errorHandler.\n\nВремя: ' + new Date().toLocaleTimeString() + '\nID: ' + Math.random().toString(36).substr(2, 9)
	
	// Временно используем message вместо Modal для тестирования
	console.log('Using message instead of Modal for testing')
	
	if (randomType === 'error') {
		message.error({
			content: `🚨 Случайная ошибка!\n\n${baseContent}`,
			duration: 8,
			style: { fontSize: '16px', fontWeight: 'bold' }
		})
	} else if (randomType === 'warning') {
		message.warning({
			content: `⚠️ Случайное предупреждение!\n\n${baseContent}`,
			duration: 8,
			style: { fontSize: '16px', fontWeight: 'bold' }
		})
	} else if (randomType === 'info') {
		message.info({
			content: `ℹ️ Случайная информация\n\n${baseContent}`,
			duration: 8,
			style: { fontSize: '16px', fontWeight: 'bold' }
		})
	} else if (randomType === 'success') {
		message.success({
			content: `✅ Случайный успех!\n\n${baseContent}`,
			duration: 8,
			style: { fontSize: '16px', fontWeight: 'bold' }
		})
	}
	
	console.log('Message shown successfully')
}
