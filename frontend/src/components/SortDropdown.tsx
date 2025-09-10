import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { UpOutlined, CheckOutlined } from '@ant-design/icons'
import styles from './SortDropdown.module.scss'

interface SortOption {
  value: string
  label: string
  sort: string
  order: 'ASC' | 'DESC'
}

const sortOptions: SortOption[] = [
  { value: 'createdAt:DESC', label: 'Сначала старые', sort: 'createdAt', order: 'DESC' },
  { value: 'createdAt:ASC', label: 'Новинки', sort: 'createdAt', order: 'ASC' },
  { value: 'price:ASC', label: 'Дешевле', sort: 'price', order: 'ASC' },
  { value: 'price:DESC', label: 'Дороже', sort: 'price', order: 'DESC' },
  { value: 'discountedPrice:DESC', label: 'С большими скидками', sort: 'discountedPrice', order: 'DESC' },
  { value: 'name:ASC', label: 'По названию А-Я', sort: 'name', order: 'ASC' },
  { value: 'name:DESC', label: 'По названию Я-А', sort: 'name', order: 'DESC' },
]

export default function SortDropdown() {
  const [search, setSearch] = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentSort = search.get('sort') || 'createdAt'
  const currentOrder = (search.get('order') || 'DESC') as 'ASC' | 'DESC'
  const currentValue = `${currentSort}:${currentOrder}`
  
  const currentOption = sortOptions.find(option => option.value === currentValue) || sortOptions[0]

  const handleOptionClick = (option: SortOption) => {
    const next = new URLSearchParams(search)
    next.set('sort', option.sort)
    next.set('order', option.order)
    // Удаляем page из URL при изменении сортировки
    next.delete('page')
    setSearch(next, { replace: true })
    setIsOpen(false)
  }

  // Закрытие выпадающего списка при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className={styles.triggerText}>{currentOption.label}</span>
        <UpOutlined 
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} 
        />
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`${styles.option} ${option.value === currentValue ? styles.optionSelected : ''}`}
              onClick={() => handleOptionClick(option)}
              type="button"
            >
              <span className={styles.optionText}>{option.label}</span>
              {option.value === currentValue && (
                <CheckOutlined className={styles.checkIcon} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
