import React from 'react';
import MainLayout from '@/components/MainLayout';
import VentaProductoForm from '@/components/VentaProductoForm';

const SaleProductsPage = () => {
  return (
    <MainLayout>
      <h1>Productos</h1>
      <VentaProductoForm/>
    </MainLayout>
  );
};

export default SaleProductsPage;
