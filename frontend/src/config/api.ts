// Конфигурация API
export const API_CONFIG = {
  // URL бэкенда
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Настройки для мок данных
  MOCK_DELAY: 300, // Задержка в мс для симуляции сетевого запроса
}

// Функция для получения базового URL
export const getBaseURL = () => API_CONFIG.BASE_URL

// Функция для проверки, используется ли мок режим (теперь управляется через контекст)
export const isMockMode = () => {
  // Проверяем localStorage для совместимости
  const saved = localStorage.getItem('api-mode')
  return saved ? saved === 'mock' : false
}
