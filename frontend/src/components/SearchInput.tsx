import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import styles from './SearchInput.module.scss'

const { Search } = Input

interface SearchInputProps {
	searchTerm: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onSearch: (value: string) => void
	loading?: boolean
	placeholder?: string
	className?: string
}

export default function SearchInput({
	searchTerm,
	onChange,
	onSearch,
	loading = false,
	placeholder = 'Поиск товаров...',
	className
}: SearchInputProps) {
	return (
		<Search
			placeholder={placeholder}
			allowClear
			enterButton={<SearchOutlined />}
			size="large"
			value={searchTerm}
			onChange={onChange}
			onSearch={onSearch}
			className={className || styles.searchInput}
			loading={loading}
		/>
	)
}
