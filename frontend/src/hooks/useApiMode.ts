import { useApiMode } from '../contexts/ApiContext'

export function useIsMockMode() {
  const { isMockMode } = useApiMode()
  return isMockMode
}
