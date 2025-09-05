import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Layout, Menu, theme } from 'antd'
import { Link, Outlet, RouteObject, useRoutes } from 'react-router-dom'

const { Header, Content, Footer } = Layout

function Catalog() {
	return <div>Каталог</div>
}

function Admin() {
	return <div>Управление товарами</div>
}

const routes: RouteObject[] = [
	{ path: '/', element: <Catalog /> },
	{ path: '/admin', element: <Admin /> },
]

export default function App() {
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken()

	const element = useRoutes(routes)

	return (
		<Layout style={{ minHeight: '100dvh' }}>
			<Header style={{ display: 'flex', alignItems: 'center' }}>
				<div style={{ color: 'white', fontWeight: 600, marginRight: 24 }}>Products</div>
				<Menu theme="dark" mode="horizontal" selectable={false} items={[
					{ key: 'catalog', label: <Link to="/">Каталог</Link> },
					{ key: 'admin', label: <Link to="/admin">Управление</Link> },
				]} />
			</Header>
			<Content style={{ padding: '24px' }}>
				<div
					style={{ background: colorBgContainer, padding: 24, borderRadius: borderRadiusLG }}
				>
					{element}
				</div>
			</Content>
			<Footer style={{ textAlign: 'center' }}>Test Task</Footer>
		</Layout>
	)
}
