import SearchInput from './SearchInput'
import SortDropdown from './SortDropdown'
import styles from './SearchContainer.module.scss'

interface SearchContainerProps {
	searchTerm: string
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onSearchSubmit: (value: string) => void
	loading?: boolean
}

export default function SearchContainer({
	searchTerm,
	onSearchChange,
	onSearchSubmit,
	loading = false
}: SearchContainerProps) {
	return (
		<div className={styles.container}>
			<SortDropdown />
			<SearchInput
				searchTerm={searchTerm}
				onChange={onSearchChange}
				onSearch={onSearchSubmit}
				loading={loading}
			/>
		</div>
	)
}
