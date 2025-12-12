const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(bodyParser.json());

let store = {}; // in-memory: { userId: [items...] }

// Create item
app.post('/items', (req, res) => {
  try {
    const { userId, name, url, price, salesTaxRate = 14, targetYears = 5, expectedReturn = 0.07 } = req.body;
    
    if (!userId || !name || !url || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const item = {
      userId,
      itemId: uuidv4(),
      name,
      url,
      price: Number(price),
      salesTaxRate: Number(salesTaxRate),
      targetYears: Number(targetYears),
      expectedReturn: Number(expectedReturn),
      fv: Number(price) * Math.pow(1 + Number(expectedReturn), Number(targetYears)),
      createdAt: new Date().toISOString()
    };

    store[userId] = store[userId] || [];
    store[userId].push(item);
    
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List items
app.get('/items', (req, res) => {
  try {
    const userId = req.query.userId || 'demo';
    res.json(store[userId] || []);
  } catch (error) {
    console.error('Error listing items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update item
app.put('/items/:itemId', (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.query.userId || 'demo';
    const { name, url, price, targetYears, expectedReturn } = req.body;
    
    if (!store[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }

    const index = store[userId].findIndex(item => item.itemId === itemId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Update item with new values
    const updatedItem = {
      ...store[userId][index],
      name: name || store[userId][index].name,
      url: url || store[userId][index].url,
      price: price !== undefined ? Number(price) : store[userId][index].price,
      targetYears: targetYears !== undefined ? Number(targetYears) : store[userId][index].targetYears,
      expectedReturn: expectedReturn !== undefined ? Number(expectedReturn) : store[userId][index].expectedReturn,
    };

    // Recalculate future value
    updatedItem.fv = updatedItem.price * Math.pow(1 + updatedItem.expectedReturn, updatedItem.targetYears);

    store[userId][index] = updatedItem;
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete item
app.delete('/items/:itemId', (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.query.userId || 'demo';
    
    if (!store[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }

    const index = store[userId].findIndex(item => item.itemId === itemId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const deletedItem = store[userId].splice(index, 1)[0];
    res.json({ message: 'Item deleted', item: deletedItem });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock API server listening on http://localhost:${PORT}`);
  console.log(`📝 Endpoints:`);
  console.log(`   POST   /items          - Create item`);
  console.log(`   GET    /items?userId=X - List items`);
  console.log(`   PUT    /items/:id      - Update item`);
  console.log(`   DELETE /items/:id      - Delete item`);
  console.log(`   GET    /health         - Health check`);
});
