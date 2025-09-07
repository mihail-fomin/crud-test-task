import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ApiContextType {
  isMockMode: boolean
  toggleApiMode: () => void
  setApiMode: (isMock: boolean) => void
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

interface ApiProviderProps {
  children: ReactNode
}

export function ApiProvider({ children }: ApiProviderProps) {
  const [isMockMode, setIsMockMode] = useState(() => {
    // Проверяем localStorage для сохранения состояния
    const saved = localStorage.getItem('api-mode')
    return saved ? saved === 'mock' : false // По умолчанию реальный API
  })

  useEffect(() => {
    // Сохраняем состояние в localStorage
    localStorage.setItem('api-mode', isMockMode ? 'mock' : 'api')
  }, [isMockMode])

  const toggleApiMode = () => {
    setIsMockMode(prev => !prev)
  }

  const setApiMode = (isMock: boolean) => {
    setIsMockMode(isMock)
  }

  return (
    <ApiContext.Provider value={{ isMockMode, toggleApiMode, setApiMode }}>
      {children}
    </ApiContext.Provider>
  )
}

export function useApiMode() {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error('useApiMode must be used within an ApiProvider')
  }
  return context
}
