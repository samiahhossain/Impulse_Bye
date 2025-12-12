import { useState } from 'react';
import { createItem } from '../api';

export default function AddItemForm({ userId, onAdd }) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [targetYears, setTargetYears] = useState('5');
  const [expectedReturn, setExpectedReturn] = useState('7');
  const [salesTaxRate, setSalesTaxRate] = useState('14');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();

    // Validation
    if (!url.trim()) {
      setError('Please enter a product URL');
      return;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      setError('Please enter a valid price');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const itemName = name.trim() || extractNameFromUrl(url);
      const tax = Number(salesTaxRate) / 100;
      const totalPrice = Number(price) * (1 + tax);

      const payload = {
        userId,
        name: itemName,
        url: url.trim(),
        price: totalPrice,
        salesTaxRate: Number(salesTaxRate),
        targetYears: Number(targetYears),
        expectedReturn: Number(expectedReturn) / 100,
      };

      const item = await createItem(payload);
      onAdd(item);

      // Reset form
      setUrl('');
      setName('');
      setPrice('');
      setTargetYears('5');
      setExpectedReturn('7');
      setSalesTaxRate('14');
    } catch (err) {
      setError('Failed to add item. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function extractNameFromUrl(urlString) {
    try {
      const path = new URL(urlString).pathname;
      const parts = path.split('/').filter(Boolean);
      const lastPart = parts[parts.length - 1] || 'Product';
      return lastPart
        .replace(/[-_]/g, ' ')
        .replace(/\.(html|htm|php|aspx?)$/i, '')
        .slice(0, 50);
    } catch {
      return 'Product';
    }
  }

  return (
    <form onSubmit={submit} className="add-item-form">
      <h2>➕ Add to Wishlist</h2>

      {error && <div className="form-error">{error}</div>}

      <div className="form-row">
        <div className="form-group flex-2">
          <label htmlFor="url">Product URL *</label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/product"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price ($) *</label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="99.99"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="salesTaxRate">Sales Tax (%)</label>
          <input
            id="salesTaxRate"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={salesTaxRate}
            onChange={(e) => setSalesTaxRate(e.target.value)}
            placeholder="14"
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group flex-2">
          <label htmlFor="name">Item Name (optional)</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Auto-extracted from URL if left blank"
            disabled={loading}
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="targetYears">Investment Period (years)</label>
          <input
            id="targetYears"
            type="number"
            min="1"
            max="50"
            value={targetYears}
            onChange={(e) => setTargetYears(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="expectedReturn">Expected Return (%)</label>
          <input
            id="expectedReturn"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Adding...' : '💾 Add Item'}
      </button>
    </form>
  );
}
