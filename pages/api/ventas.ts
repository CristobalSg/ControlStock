import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type Sale = {
  id?: string;
  producto: string;
  cantidadVendida: number;
  totalVenta: number;
  fecha: Date;
};

type InventoryItem = {
  id?: string;
  producto: string;
  cantidad: number;
  v_costo: number;
  v_venta: number;
};

// Función para registrar una venta y actualizar el inventario
const handlePostSale = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = (await client.connect()).db();
  const inventoryCollection = db.collection<InventoryItem>('inventory');
  const salesCollection = db.collection<Sale>('sales');

  const { producto, cantidadVendida, v_venta } = req.body;

  if (!producto || cantidadVendida <= 0 || !v_venta) {
    return res.status(400).json({ message: 'Product, quantity, and sale value are required' });
  }

  // Buscar el producto en el inventario
  const item = await inventoryCollection.findOne({ producto });
  if (!item) {
    return res.status(404).json({ message: 'Product not found in inventory' });
  }

  // Verificar que haya suficiente inventario para la venta
  if (item.cantidad < cantidadVendida) {
    return res.status(400).json({ message: 'Insufficient inventory for sale' });
  }

  // Calcular el total de la venta y actualizar el inventario
  const totalVenta = cantidadVendida * v_venta;
  const updatedQuantity = item.cantidad - cantidadVendida;

  const session = client.startSession();
  session.startTransaction();

  try {
    // Actualizar la cantidad en el inventario
    await inventoryCollection.updateOne(
      { _id: item._id },
      { $set: { cantidad: updatedQuantity } },
      { session }
    );

    // Registrar la venta en la colección de ventas
    const newSale: Sale = {
      id: new ObjectId().toString(),
      producto,
      cantidadVendida,
      totalVenta,
      fecha: new Date(), // Fecha de la venta
    };
    await salesCollection.insertOne(newSale, { session });

    // Confirmar la transacción
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Sale registered successfully and inventory updated', sale: newSale });
  } catch (error) {
    // Si hay un error, revertir la transacción
    await session.abortTransaction();
    session.endSession();
    console.error("Error:", error);
    res.status(500).json({ message: 'Error processing sale' });
  }
};

// Función para obtener las ventas del día
const handleGetTodaySales = async (res: NextApiResponse) => {
  const db = (await client.connect()).db();
  const salesCollection = db.collection<Sale>('sales');

  // Obtener la fecha de inicio y fin del día actual
  const start = new Date();
  start.setHours(0, 0, 0, 0); // Inicio del día
  const end = new Date();
  end.setHours(23, 59, 59, 999); // Fin del día

  // Buscar las ventas dentro del rango de fechas del día actual
  const todaySales = await salesCollection.find({ fecha: { $gte: start, $lte: end } }).toArray();
  res.status(200).json({ ventas: todaySales });
};

// Controlador principal para el manejo de ventas
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      await handlePostSale(req, res);
    } else if (req.method === 'GET') {
      await handleGetTodaySales(res);
    } else {
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Error connecting to database' });
  }
}
