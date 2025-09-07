// Конфигурация API
export const API_CONFIG = {
  // Переключение между мок данными и реальным API
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true' || true, // По умолчанию true для демонстрации
  
  // URL бэкенда
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Настройки для мок данных
  MOCK_DELAY: 300, // Задержка в мс для симуляции сетевого запроса
}

// Функция для проверки, используется ли мок режим
export const isMockMode = () => API_CONFIG.USE_MOCK_DATA

// Функция для получения базового URL
export const getBaseURL = () => API_CONFIG.BASE_URL
