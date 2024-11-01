import React from 'react';
import MainLayout from '@/components/MainLayout';
import VentasDelDia from '@/components/VentasDelDia';


const SalePage = () => {
  return (
    <MainLayout>
      <h1>Ventas del día</h1>
      <VentasDelDia/>
    </MainLayout>
  );
};

export default SalePage;
