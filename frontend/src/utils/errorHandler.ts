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
export function handleApiError(error: unknown): ErrorDetails {
	// Type assertions for error properties
	const errorWithStatus = error as { status?: number };
	const errorWithMessage = error as { message?: string };

	// Сетевые ошибки
	if (error instanceof TypeError || errorWithStatus.status === 0) {
		return {
			title: 'Ошибка сети',
			description: 'Проверьте подключение к интернету и попробуйте снова',
			canRetry: true,
			status: 0
		}
	}

	// HTTP ошибки
	if (errorWithStatus.status) {
		switch (errorWithStatus.status) {
			case 400:
				return {
					title: 'Некорректный запрос',
					description: errorWithMessage.message || 'Проверьте правильность введенных данных',
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
					description: errorWithMessage.message || 'Проверьте правильность введенных данных',
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
					status: errorWithStatus.status
				}
			default:
				return {
					title: 'Ошибка сервера',
					description: errorWithMessage.message || `Ошибка ${errorWithStatus.status}: ${(error as { statusText?: string }).statusText || 'Неизвестная ошибка'}`,
					canRetry: errorWithStatus.status >= 500,
					status: errorWithStatus.status
				}
		}
	}

	// Ошибки валидации файлов
	if (errorWithMessage.message?.includes('размер') || errorWithMessage.message?.includes('size')) {
		return {
			title: 'Файл слишком большой',
			description: 'Размер файла не должен превышать 10MB',
			canRetry: false,
			status: 413
		}
	}

	if (errorWithMessage.message?.includes('тип') || errorWithMessage.message?.includes('type')) {
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
		description: errorWithMessage.message || 'Попробуйте снова позже',
		canRetry: true,
		status: undefined
	}
}

/**
 * Показывает уведомление об ошибке с возможностью повтора
 */
export function showErrorNotification(error: unknown, onRetry?: () => void) {
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

