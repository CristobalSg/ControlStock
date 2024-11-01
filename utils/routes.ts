const API_BASE = '/api';

export const ROUTES = {
  INVENTORY: `${API_BASE}/inventory`,
  INVENTORY_ITEM: (id: string) => `${API_BASE}/inventory/${id}`,
};