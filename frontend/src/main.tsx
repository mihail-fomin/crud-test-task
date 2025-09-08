import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, App as AntdApp } from 'antd'
import { Layout } from 'antd'
import MainPage from './pages/MainPage'
import ProductPage from './pages/ProductPage'
import './index.css'

const { Content } = Layout

const AppLayout = ({ children }: { children: React.ReactNode }) => (
	<Layout className="min-h-screen">
		<Content>
			{children}
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
		<QueryClientProvider client={queryClient}>
			<ConfigProvider>
				<AntdApp>
					<RouterProvider router={router} />
				</AntdApp>
			</ConfigProvider>
		</QueryClientProvider>
	</StrictMode>,
)
