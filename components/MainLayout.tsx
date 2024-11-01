import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Link from 'next/link';

const { Header, Content, Footer } = Layout;

type MainLayoutProps = {
  children: React.ReactNode;
};

const items = [
  { key: '0', label: <Link href="/">Home</Link> },
  { key: '1', label: <Link href="/products">Productos</Link> },
  { key: '2', label: <Link href="/inventory">Inventario</Link> },
  { key: '3', label: <Link href="/sales">Ventas del Día</Link> },
  { key: '4', label: <Link href="/sale-product">Venta de Producto</Link> },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['0']} // Cambia según el elemento predeterminado que quieras
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 48px', height: "100vh"}}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>xeed</Breadcrumb.Item> {/* BD */}
        </Breadcrumb>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Creado por Ant UED
      </Footer>
    </Layout>
  );
};

export default MainLayout;
