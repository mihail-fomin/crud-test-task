import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, App as AntdApp } from 'antd'
import { Layout } from 'antd'
import MainPage from './pages/MainPage'
import ProductPage from './pages/ProductPage'
import MockDataPage from './pages/MockDataPage'
import './index.css'

const { Header, Content, Footer } = Layout

const AppLayout = ({ children }: { children: React.ReactNode }) => (
	<Layout className="min-h-screen">
		<Header className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600">
			<div className="text-white font-bold text-2xl">Products Store</div>
		</Header>
		<Content className="py-8">
			<div className="max-w-7xl mx-auto px-6">
				{children}
			</div>
		</Content>
		<Footer className="text-center">Test Task</Footer>
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
	{ 
		path: '/mock-data', 
		element: (
			<AppLayout>
				<MockDataPage />
			</AppLayout>
		) 
	},
])

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ConfigProvider>
				<AntdApp>
					<RouterProvider router={router} />
				</AntdApp>
			</ConfigProvider>
		</QueryClientProvider>
	</StrictMode>,
)
