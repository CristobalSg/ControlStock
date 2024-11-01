import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type InventoryItem = {
  id?: string;
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


// Función para manejar la solicitud GET
const handleGetInventory = async (res: NextApiResponse) => {
  const db = (await client.connect()).db();
  const collection = db.collection<InventoryItem>('inventory');
  const items = await collection.find().toArray();
  res.status(200).json({ values: items });
};

// Función para manejar la solicitud POST
const handlePostInventory = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = (await client.connect()).db();
  const collection = db.collection<InventoryItem>('inventory');
  
  const { producto, cantidad, v_costo, v_venta } = req.body;
  
  const newItem: InventoryItem = {
    id: new ObjectId().toString(),
    producto,
    cantidad,
    v_costo,
    v_venta,
    datos: {
      invertido: v_costo,
      ganancia: (v_venta * cantidad) - v_costo,
    },
    fecha: new Date(),
  };

  await collection.insertOne(newItem);
  res.status(201).json({ message: 'Item added successfully', item: newItem });
};

// Función para manejar la solicitud PUT (editar producto)
const handlePutInventory = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = (await client.connect()).db();
  const collection = db.collection<InventoryItem>('inventory');

  const { id, producto, cantidad, v_costo, v_venta } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'ID is required to update an item' });
  }

  const updatedItem = {
    producto,
    cantidad,
    v_costo,
    v_venta,
    datos: {
      invertido: v_costo,
      ganancia: (v_venta * cantidad) - v_costo,
    },
    fecha: new Date(),
  };

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedItem }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: 'Item not found' });
  }

  res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
};

// Controlador principal
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      await handleGetInventory(res);
    } else if (req.method === 'POST') {
      await handlePostInventory(req, res);
    } else if (req.method === 'PUT') {
      await handlePutInventory(req, res);
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Error connecting to database' });
  }
}