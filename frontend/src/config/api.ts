// Конфигурация API
export const API_CONFIG = {
  // URL бэкенда
  BASE_URL: import.meta.env.VITE_API_URL || 'https://user20431889-env4iuub.tunnel.vk-apps.com/',
}

// Функция для получения базового URL
export const getBaseURL = () => API_CONFIG.BASE_URL
