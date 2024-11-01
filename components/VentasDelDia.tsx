import React, { useEffect, useState } from 'react';

type Sale = {
  id: string;
  producto: string;
  cantidadVendida: number;
  totalVenta: number;
  fecha: string;
};

const VentasDelDia: React.FC = () => {
  const [ventas, setVentas] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener ventas del día
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await fetch('/api/ventas');
        if (!response.ok) {
          throw new Error('Error al obtener ventas');
        }
        const data = await response.json();
        setVentas(data.ventas);
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
        } finally {
            setLoading(false);
        }
    };
    fetchVentas();
  }, []);

  if (loading) return <p>Cargando ventas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Ventas del Día</h2>
      {ventas.length === 0 ? (
        <p>No hay ventas registradas para hoy.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad Vendida</th>
              <th>Total de Venta</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id}>
                <td>{venta.producto}</td>
                <td>{venta.cantidadVendida}</td>
                <td>{venta.totalVenta.toFixed(2)}</td>
                <td>{new Date(venta.fecha).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VentasDelDia;
