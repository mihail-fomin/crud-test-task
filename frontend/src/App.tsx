import { Layout } from 'antd'
import MainPage from './pages/MainPage'

const { Header, Content, Footer } = Layout

export default function App() {
	return (
		<Layout className="min-h-screen">
			<Header className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600">
				<div className="text-white font-bold text-2xl">Products Store</div>
			</Header>
			<Content className="py-8">
				<div className="max-w-7xl mx-auto px-6">
					<MainPage />
				</div>
			</Content>
			<Footer className="text-center">Test Task</Footer>
		</Layout>
	)
}