import React, { useEffect, useState } from 'react';
import { ROUTES } from '@/utils/routes';

// interface InventoryItem {
//   id: string;
//   producto: string;
//   cantidad: number;
//   // Añade otros campos según lo que necesites
// }

interface InventoryItem {
  id: string;
  producto: string;
  cantidad: number;
  v_costo: number;
  v_venta: number;
  datos: {
    ganancia: number;
    invertido: number;
  };
  fecha: Date;
};

const InventoryList: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(ROUTES.INVENTORY);
        if (!response.ok) {
          throw new Error('Error al cargar el inventario');
        }
        const data = await response.json();
        setInventory(data.values); // Accede a los valores del inventario en la respuesta
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Inventario</h1>
      <ul>
        {inventory.map(item => (
          <li key={item.id}>
            Producto: {item.producto}: {item.cantidad}: {item.v_venta}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryList;
