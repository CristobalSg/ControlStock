import React, { useState, useEffect } from 'react';

type Product = {
  id: string;
  producto: string;
  v_venta: number;
  cantidad: number;
};

const VentaProductoForm: React.FC = () => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [cantidadVendida, setCantidadVendida] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Obtener productos de inventario
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('/api/inventory');
        const data = await response.json();
        setProductos(data.values);
      } catch (error) {
        setMessage('Error al cargar productos');
      }
    };
    fetchProductos();
  }, []);

  // Manejar la venta de producto
  const handleSale = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const productoSeleccionado = productos.find(p => p.id === selectedProductId);
    if (!productoSeleccionado) {
      setMessage('Producto no encontrado');
      setLoading(false);
      return;
    }

    const ventaData = {
      producto: productoSeleccionado.producto,
      cantidadVendida,
      v_venta: productoSeleccionado.v_venta,
    };

    try {
      const response = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData),
      });

      if (response.ok) {
        setMessage('Venta registrada correctamente');
      } else {
        setMessage('Error al registrar la venta');
      }
    } catch (error) {
      setMessage('Error de red al registrar la venta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSale}>
      <div>
        <label htmlFor="productSelect">Producto:</label>
        <select
          id="productSelect"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          required
        >
          <option value="">Seleccione un producto</option>
          {productos.map(product => (
            <option key={product.id} value={product.id}>
              {product.producto} - Disponible: {product.cantidad}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cantidadVendida">Cantidad a vender:</label>
        <input
          id="cantidadVendida"
          type="number"
          min="1"
          value={cantidadVendida}
          onChange={(e) => setCantidadVendida(Number(e.target.value))}
          required
        />
      </div>

      <div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar Venta'}
        </button>
      </div>

      {message && <p>{message}</p>}
    </form>
  );
};

export default VentaProductoForm;
