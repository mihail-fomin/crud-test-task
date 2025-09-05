import axios from 'axios'

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

api.interceptors.response.use(
	(resp) => resp,
	(error) => {
		return Promise.reject(error)
	},
)
