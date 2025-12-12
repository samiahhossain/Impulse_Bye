import { useState, useEffect } from 'react';
import AddItemForm from './components/AddItemForm';
import ItemCard from './components/ItemCard';
import { listItems, deleteItem, updateItem } from './api';
import './App.css';

function App() {
  const [userId] = useState('demo'); // In production, this would come from authentication
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadItems();
  }, [userId]);

  async function loadItems() {
    try {
      setLoading(true);
      setError(null);
      const data = await listItems(userId);
      setItems(data);
    } catch (err) {
      setError('Failed to load items. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleAddItem(newItem) {
    setItems((prev) => [newItem, ...prev]);
  }

  async function handleUpdateItem(itemId, updatedItem) {
    try {
      const result = await updateItem(userId, itemId, updatedItem);
      setItems((prev) =>
        prev.map((item) => (item.itemId === itemId ? result : item))
      );
    } catch (err) {
      setError('Failed to update item. Please try again.');
      console.error(err);
      throw err; // Re-throw so ItemCard can handle it
    }
  }

  async function handleDeleteItem(itemId) {
    try {
      await deleteItem(userId, itemId);
      setItems((prev) => prev.filter((item) => item.itemId !== itemId));
    } catch (err) {
      setError('Failed to delete item. Please try again.');
      console.error(err);
    }
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const totalFutureValue = items.reduce((sum, item) => sum + item.fv, 0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>💸 Impulse Bye</h1>
        <p className="tagline">Make purchasing decisions more intentional</p>
      </header>

      <div className="container">
        <section className="add-item-section">
          <AddItemForm userId={userId} onAdd={handleAddItem} />
        </section>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <section className="summary-section">
          <div className="summary-card">
            <h3>Total Wishlist Value</h3>
            <p className="amount">${totalPrice.toFixed(2)}</p>
          </div>
          <div className="summary-card highlight">
            <h3>If Invested Instead</h3>
            <p className="amount">${totalFutureValue.toFixed(2)}</p>
            <p className="gain">
              +${(totalFutureValue - totalPrice).toFixed(2)}
            </p>
          </div>
          <div className="summary-card">
            <h3>Items Tracked</h3>
            <p className="amount">{items.length}</p>
          </div>
        </section>

        {loading ? (
          <div className="loading">Loading your wishlist...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <h2>📋 Your wishlist is empty</h2>
            <p>
              Add items above to see how much they could be worth if invested!
            </p>
          </div>
        ) : (
          <section className="items-grid">
            {items.map((item) => (
              <ItemCard
                key={item.itemId}
                item={item}
                onDelete={handleDeleteItem}
                onUpdate={handleUpdateItem}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
