import { getBaseURL } from '../config/api'

// Типы для API ответов
export interface ApiResponse<T = any> {
	data: T
	status: number
	statusText: string
}

export interface ApiError {
	message: string
	status?: number
	statusText?: string
}

// Класс для работы с API
class ApiClient {
	private baseURL: string

	constructor() {
		this.baseURL = getBaseURL()
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<ApiResponse<T>> {
		const url = `${this.baseURL}${endpoint}`
		
		// Не добавляем Content-Type для GET запросов без тела
		const isGetRequest = options.method === 'GET' || !options.method
		const hasBody = options.body !== undefined
		
		const config: RequestInit = {
			...options,
			headers: {
				...(isGetRequest && !hasBody ? {} : { 'Content-Type': 'application/json' }),
				...options.headers,
			},
		}

		try {
			const response = await fetch(url, config)
			
			if (!response.ok) {
				const errorText = await response.text()
				let errorData
				try {
					errorData = JSON.parse(errorText)
				} catch {
					errorData = { message: errorText }
				}
				
				throw {
					message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
					status: response.status,
					statusText: response.statusText,
				} as ApiError
			}

			// Проверяем, есть ли контент для парсинга
			const contentType = response.headers.get('content-type')
			let data = null
			
			if (contentType && contentType.includes('application/json')) {
				const text = await response.text()
				if (text.trim()) {
					data = JSON.parse(text)
				}
			}
			
			return {
				data,
				status: response.status,
				statusText: response.statusText,
			}
		} catch (error) {
			if (error instanceof TypeError) {
				// Сетевая ошибка
				throw {
					message: 'Ошибка сети. Проверьте подключение к интернету.',
					status: 0,
				} as ApiError
			}
			throw error
		}
	}

	async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
		const url = new URL(`${this.baseURL}${endpoint}`)
		
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					url.searchParams.append(key, String(value))
				}
			})
		}

		return this.request<T>(url.pathname + url.search)
	}

	async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
		const isFormData = data instanceof FormData
		return this.request<T>(endpoint, {
			method: 'POST',
			body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
			headers: isFormData ? {} : { 'Content-Type': 'application/json' },
			...options,
		})
	}

	async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
		const isFormData = data instanceof FormData
		return this.request<T>(endpoint, {
			method: 'PUT',
			body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
			headers: isFormData ? {} : { 'Content-Type': 'application/json' },
			...options,
		})
	}

	async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			method: 'DELETE',
			...options,
		})
	}
}

export const api = new ApiClient()
