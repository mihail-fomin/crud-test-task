import { Layout, Menu } from 'antd'
import { Link, RouteObject, useRoutes } from 'react-router-dom'
import CatalogPage from './features/catalog/CatalogPage'
import ProductPage from './features/products/pages/ProductPage'
import AdminPage from './features/admin/AdminPage'

const { Header, Content, Footer } = Layout

const routes: RouteObject[] = [
	{ path: '/', element: <CatalogPage /> },
	{ path: '/products/:id', element: <ProductPage /> },
	{ path: '/admin', element: <AdminPage /> },
]

export default function App() {
	const element = useRoutes(routes)

	return (
		<Layout className="min-h-screen">
			<Header className="flex items-center">
				<div className="text-white font-semibold mr-6">Products</div>
				<Menu theme="dark" mode="horizontal" selectable={false} items={[
					{ key: 'catalog', label: <Link to="/">Каталог</Link> },
					{ key: 'admin', label: <Link to="/admin">Управление</Link> },
				]} />
			</Header>
			<Content className="p-6">
				<div className="bg-white dark:bg-neutral-800 p-6 rounded-lg">
					{element}
				</div>
			</Content>
			<Footer className="text-center">Test Task</Footer>
		</Layout>
	)
}
