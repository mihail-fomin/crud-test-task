# Мок данные для фронтенда

Этот файл содержит описание мок данных, созданных для демонстрации функциональности приложения без необходимости подключения к бэкенду.

## Структура файлов

### `mockData.ts`
Содержит:
- Массив `mockProducts` с 20 демонстрационными товарами
- Функцию `getMockProducts()` для пагинации и фильтрации
- Функцию `getMockProductById()` для получения товара по ID

### `mockApi.ts`
Содержит мок API функции:
- `mockFetchProducts()` - получение списка товаров с пагинацией
- `mockFetchProductById()` - получение товара по ID
- `mockCreateProduct()` - создание нового товара
- `mockUpdateProduct()` - обновление товара
- `mockDeleteProduct()` - удаление товара
- `mockUploadProductPhoto()` - загрузка фото товара
- `mockDeleteProductPhoto()` - удаление фото товара

### `hooks/useMockData.ts`
Содержит React Query хуки для работы с мок данными:
- `useMockCatalogQuery()` - обычный каталог
- `useMockInfiniteCatalogQuery()` - бесконечный скролл
- `useMockProductQuery()` - получение товара по ID
- `useMockCreateProduct()` - создание товара
- `useMockUpdateProduct()` - обновление товара
- `useMockDeleteProduct()` - удаление товара
- `useMockUploadProductPhoto()` - загрузка фото
- `useMockDeleteProductPhoto()` - удаление фото

### Компоненты
- `MockDataDemo.tsx` - главный компонент демонстрации
- `MockProductsTable.tsx` - таблица товаров с мок данными
- `MockInfiniteProductsTable.tsx` - таблица с бесконечным скроллом
- `MockDataPage.tsx` - страница для демонстрации

## Использование

### 1. Добавление на страницу
```tsx
import MockDataDemo from '../components/MockDataDemo'

function MyPage() {
  const handleEdit = (product) => {
    // Обработка редактирования
  }
  
  const handleView = (product) => {
    // Обработка просмотра
  }

  return (
    <MockDataDemo onEdit={handleEdit} onView={handleView} />
  )
}
```

### 2. Использование хуков
```tsx
import { useMockCatalogQuery } from '../hooks/useMockData'

function MyComponent() {
  const { data, isLoading, error } = useMockCatalogQuery()
  
  if (isLoading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error.message}</div>
  
  return (
    <div>
      {data?.data.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

### 3. Прямое использование мок данных
```tsx
import { mockProducts, getMockProducts } from '../mockData'

// Получить все товары
const allProducts = mockProducts

// Получить товары с пагинацией
const paginatedProducts = getMockProducts({
  page: 1,
  limit: 10,
  sort: 'name',
  order: 'ASC'
})
```

## Особенности

1. **Имитация задержки**: Все API функции имеют искусственную задержку для имитации реальных запросов
2. **Реалистичные данные**: Товары содержат разнообразную информацию (цены, описания, фото)
3. **Фильтрация и сортировка**: Поддерживаются все основные параметры фильтрации
4. **Пагинация**: Работает как обычная пагинация, так и бесконечный скролл
5. **CRUD операции**: Все основные операции с товарами (создание, чтение, обновление, удаление)

## Настройка

Для изменения количества товаров или их характеристик отредактируйте массив `mockProducts` в файле `mockData.ts`.

Для изменения задержки API отредактируйте функцию `delay()` в файле `mockApi.ts`.

## Интеграция с реальным API

Когда будет готов реальный бэкенд, просто замените импорты хуков:
```tsx
// Вместо
import { useMockCatalogQuery } from '../hooks/useMockData'

// Используйте
import { useCatalogQuery } from '../features/catalog/hooks'
```

Компоненты останутся без изменений, так как они используют одинаковые интерфейсы.
