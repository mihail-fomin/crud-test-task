import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, App as AntdApp } from 'antd'
import { Layout } from 'antd'
import { ApiProvider } from './contexts/ApiContext'
import MainPage from './pages/MainPage'
import ProductPage from './pages/ProductPage'
import MockDataPage from './pages/MockDataPage'
import './index.css'

const { Content } = Layout

const AppLayout = ({ children }: { children: React.ReactNode }) => (
	<Layout className="min-h-screen">
		<Content className="py-8">
			<div className="px-6 mx-auto max-w-7xl">
				{children}
			</div>
		</Content>
	</Layout>
)

const router = createBrowserRouter([
	{ 
		path: '/', 
		element: (
			<AppLayout>
				<MainPage />
			</AppLayout>
		) 
	},
	{ 
		path: '/product/:id', 
		element: (
			<AppLayout>
				<ProductPage />
			</AppLayout>
		) 
	},
])

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ApiProvider>
			<QueryClientProvider client={queryClient}>
				<ConfigProvider>
					<AntdApp>
						<RouterProvider router={router} />
					</AntdApp>
				</ConfigProvider>
			</QueryClientProvider>
		</ApiProvider>
	</StrictMode>,
)
