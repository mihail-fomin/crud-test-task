import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntdApp } from 'antd';
import { AppLayout } from './components/AppLayout';
import MainPage from './pages/MainPage';
import ProductPage from './pages/ProductPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppLayout>
        <MainPage />
      </AppLayout>
    ),
  },
  {
    path: '/product/:id',
    element: (
      <AppLayout>
        <ProductPage />
      </AppLayout>
    ),
  },
]);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <AntdApp>
          <RouterProvider router={router} />
        </AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
