import { useState } from 'react';

export default function ItemCard({ item, onDelete, onUpdate }) {
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: item.name,
    price: item.price,
    targetYears: item.targetYears,
    expectedReturn: item.expectedReturn * 100
  });

  const { itemId, name, url, price, targetYears, expectedReturn, fv, salesTaxRate } = item;
  const gain = fv - price;
  const gainPercent = ((gain / price) * 100).toFixed(1);

  async function handleDelete(e) {
    // Prevent card click from triggering when pressing delete
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to remove "${name}" from your wishlist?`)) {
      return;
    }
    setDeleting(true);
    try {
      await onDelete(itemId);
    } catch (err) {
      setDeleting(false);
    }
  }

  async function handleSaveEdit(e) {
    // Prevent card click from triggering when pressing save
    e.stopPropagation();
    try {
      const updatedItem = {
        name: editData.name,
        url: url,
        price: Number(editData.price),
        targetYears: Number(editData.targetYears),
        expectedReturn: Number(editData.expectedReturn) / 100
      };
      await onUpdate(itemId, updatedItem);
      setEditing(false);
    } catch (err) {
      // Error handled by parent
    }
  }

  function handleCancelEdit(e) {
    // Prevent card click from triggering when pressing cancel
    e.stopPropagation();
    setEditData({
      name: item.name,
      price: item.price,
      targetYears: item.targetYears,
      expectedReturn: item.expectedReturn * 100
    });
    setEditing(false);
  }

  function handleCardClick() {
    if (editing) return; // Don't navigate while editing
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  if (editing) {
    return (
      <div className="item-card editing" onClick={handleCardClick} role="button" tabIndex={0}>
        <div className="edit-form">
          <h3 className="edit-title">✏️ Edit Item</h3>
          
          <div className="edit-field">
            <label>Item Name</label>
            <input
              type="text"
              value={editData.name}
              onChange={e => setEditData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Item name"
            />
          </div>

          <div className="edit-field">
            <label>Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={editData.price}
              onChange={e => setEditData(prev => ({ ...prev, price: e.target.value }))}
            />
          </div>

          <div className="edit-field">
            <label>Investment Period (years)</label>
            <input
              type="number"
              min="1"
              max="50"
              value={editData.targetYears}
              onChange={e => setEditData(prev => ({ ...prev, targetYears: e.target.value }))}
            />
          </div>

          <div className="edit-field">
            <label>Expected Return (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={editData.expectedReturn}
              onChange={e => setEditData(prev => ({ ...prev, expectedReturn: e.target.value }))}
            />
          </div>

          <div className="edit-actions">
            <button className="save-btn" onClick={handleSaveEdit}>
              💾 Save
            </button>
            <button className="cancel-btn" onClick={handleCancelEdit}>
              ✕ Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="item-card" onClick={handleCardClick} role="button" tabIndex={0}>
      <div className="card-actions">
        <button 
          className="edit-btn"
          onClick={(e) => { e.stopPropagation(); setEditing(true); }}
          title="Edit item"
        >
          ✏️
        </button>
        <button 
          className="delete-btn"
          onClick={handleDelete}
          disabled={deleting}
          aria-label="Delete item"
          title="Delete item"
        >
          {deleting ? '...' : '🗑️'}
        </button>
      </div>

      <div className="item-header">
        <h3 className="item-name">{name}</h3>
        {url && (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="item-link"
            title="View product"
          >
            🔗
          </a>
        )}
      </div>

      <div className="item-price-section">
        <div className="price-row">
          <span className="label">Price now (incl. tax):</span>
          <span className="price">${price.toFixed(2)}</span>
        </div>
        {typeof salesTaxRate === 'number' && (
          <div className="price-row">
            <span className="label">Sales Tax:</span>
            <span className="price">{salesTaxRate.toFixed(1)}%</span>
          </div>
        )}
        <div className="price-row highlight-row">
          <span className="label">If invested ({targetYears}y @ {(expectedReturn * 100).toFixed(1)}%):</span>
          <span className="future-value">${fv.toFixed(2)}</span>
        </div>
      </div>

      <div className="gain-indicator">
        <div className="gain-bar">
          <div 
            className="gain-fill" 
            style={{ width: `${Math.min(gainPercent, 100)}%` }}
          />
        </div>
        <div className="gain-text">
          <span className="gain-amount">+${gain.toFixed(2)}</span>
          <span className="gain-percent">({gainPercent}% growth)</span>
        </div>
      </div>

      <div className="item-footer">
        <span className="item-meta">Added {new Date(item.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
