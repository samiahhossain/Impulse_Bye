const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function createItem(payload) {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to create item: ${res.statusText}`);
  }
  
  return res.json();
}

export async function listItems(userId) {
  const res = await fetch(`${API_BASE}/items?userId=${userId}`);
  
  if (!res.ok) {
    throw new Error(`Failed to list items: ${res.statusText}`);
  }
  
  return res.json();
}

export async function updateItem(userId, itemId, payload) {
  const res = await fetch(`${API_BASE}/items/${itemId}?userId=${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to update item: ${res.statusText}`);
  }
  
  return res.json();
}

export async function deleteItem(userId, itemId) {
  const res = await fetch(`${API_BASE}/items/${itemId}?userId=${userId}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to delete item: ${res.statusText}`);
  }
  
  return res.json();
}
