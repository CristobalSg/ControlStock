import React, { useState } from 'react';

interface ProductInput {
  producto: string;
  cantidad: number;
  v_costo: number;
  v_venta: number;
}

const ProductForm: React.FC = () => {
  const [product, setProduct] = useState<ProductInput>({
    producto: '',
    cantidad: 0,
    v_costo: 0,
    v_venta: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        alert('Producto agregado correctamente');
        setProduct({ producto: '', cantidad: 0, v_costo: 0, v_venta: 0 });
      } else {
        alert('Error al agregar el producto');
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>Nombre Producto:</p>
      <input name="producto" value={product.producto} onChange={handleChange} placeholder="Nombre del producto" />
      <p>Catidad:</p>
      <input name="cantidad" type="number" value={product.cantidad} onChange={handleChange} placeholder="Cantidad" />
      <p>Costo:</p>
      <input name="v_costo" type="number" value={product.v_costo} onChange={handleChange} placeholder="Costo" />
      <p>Valor venta:</p>
      <input name="v_venta" type="number" value={product.v_venta} onChange={handleChange} placeholder="Venta" />
      <button type="submit">Agregar Producto</button>
    </form>
  );
};

export default ProductForm;
