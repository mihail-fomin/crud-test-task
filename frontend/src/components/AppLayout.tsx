import { Layout } from 'antd';
import { ReactNode } from 'react';

const { Content } = Layout;

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => (
  <Layout className="min-h-screen">
    <Content>{children}</Content>
  </Layout>
);
