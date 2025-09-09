// Конфигурация API
export const API_CONFIG = {
  // URL бэкенда
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
}

// Функция для получения базового URL
export const getBaseURL = () => API_CONFIG.BASE_URL
