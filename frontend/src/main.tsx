import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, App as AntdApp } from 'antd'
import App from './App.tsx'
import './index.css'

const router = createBrowserRouter([
	{ path: '/', element: <App /> },
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
