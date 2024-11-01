import React from 'react';
import client from '@/lib/mongodb';
import MainLayout from '@/components/MainLayout';
import type { InferGetServerSidePropsType, GetServerSideProps, NextPage } from 'next';

type ConnectionStatus = {
  isConnected: boolean;
};

export const getServerSideProps: GetServerSideProps<ConnectionStatus> = async () => {
  try {
    await client.connect();
    return {
      props: { isConnected: true },
    };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return {
      props: { isConnected: false },
    };
  }
};

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ isConnected }) => {
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold">Bienvenido a tu aplicación Next.js</h1>
      <p className="text-center mt-4">
        {isConnected ? (
          <span className="text-green-500">Conectado a MongoDB</span>
        ) : (
          <span className="text-red-500">No conectado a MongoDB</span>
        )}
      </p>
    </MainLayout>
  );
};

export default Home;
