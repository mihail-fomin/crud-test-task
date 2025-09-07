import axios from 'axios'
import { getBaseURL } from '../config/api'

export const api = axios.create({
	baseURL: getBaseURL(),
})

api.interceptors.response.use(
	(resp) => resp,
	(error) => {
		return Promise.reject(error)
	},
)
