import React from 'react';
import ProductForm from '@/components/ProductForm';
import MainLayout from '@/components/MainLayout';

const ProductsPage = () => {
  return (
    <MainLayout>
      <h1>Productos</h1>
      <ProductForm />
    </MainLayout>
  );
};

export default ProductsPage;
