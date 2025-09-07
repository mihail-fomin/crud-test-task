/**
 * Утилиты для работы с изображениями
 */

/**
 * Получает правильный URL для изображения товара
 * @param photoUrl - URL изображения из API
 * @param isMockMode - используется ли мок режим
 * @returns правильный URL для отображения
 */
export function getProductImageUrl(photoUrl: string | null | undefined, isMockMode: boolean = false): string | null {
  if (!photoUrl) {
    return null
  }

  // В мок режиме используем placeholder изображения
  if (isMockMode) {
    return photoUrl
  }

  // Если это уже полный URL (начинается с http), возвращаем как есть
  if (photoUrl.startsWith('http')) {
    return photoUrl
  }

  // Если это относительный путь (начинается с /), возвращаем как есть
  // Vite прокси будет перенаправлять /uploads на бэкенд
  if (photoUrl.startsWith('/')) {
    return photoUrl
  }

  // В остальных случаях добавляем базовый URL бэкенда
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  return `${baseURL}${photoUrl.startsWith('/') ? '' : '/'}${photoUrl}`
}

/**
 * Проверяет, является ли URL изображением
 * @param url - URL для проверки
 * @returns true, если это изображение
 */
export function isImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  return imageExtensions.some(ext => url.toLowerCase().includes(ext))
}
