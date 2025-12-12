# API Testing Guide

Quick tests to verify your backend is working correctly.

## Test Local Mock Server

### 1. Health Check

```bash
curl http://localhost:4000/health
```

**Expected Response:**

```json
{ "status": "ok", "timestamp": "2024-12-11T..." }
```

### 2. Create Item

```bash
curl -X POST http://localhost:4000/items \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "testuser",
    "name": "Test Laptop",
    "url": "https://example.com/laptop",
    "price": 999.99,
    "targetYears": 5,
    "expectedReturn": 0.07
  }'
```

**Expected Response:**

```json
{
  "userId": "testuser",
  "itemId": "...",
  "name": "Test Laptop",
  "url": "https://example.com/laptop",
  "price": 999.99,
  "targetYears": 5,
  "expectedReturn": 0.07,
  "fv": 1402.55,
  "createdAt": "2024-12-11T..."
}
```

### 3. List Items

```bash
curl http://localhost:4000/items?userId=testuser
```

**Expected Response:**

```json
[
  {
    "userId": "testuser",
    "itemId": "...",
    "name": "Test Laptop",
    ...
  }
]
```

### 4. Delete Item

```bash
# Replace ITEM_ID with actual itemId from create response
curl -X DELETE "http://localhost:4000/items/ITEM_ID?userId=testuser"
```

**Expected Response:**

```json
{
  "message": "Item deleted",
  "item": {...}
}
```

---

## Test AWS Production API

Replace `YOUR_API_URL` with your API Gateway Invoke URL.

### 1. Create Item

```bash
curl -X POST https://YOUR_API_URL/prod/items \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "testuser",
    "name": "Production Test Item",
    "url": "https://example.com/item",
    "price": 199.99,
    "targetYears": 10,
    "expectedReturn": 0.08
  }'
```

### 2. List Items

```bash
curl https://YOUR_API_URL/prod/items?userId=testuser
```

### 3. Delete Item

```bash
curl -X DELETE "https://YOUR_API_URL/prod/items/ITEM_ID?userId=testuser"
```

---

## Test from Browser Console

Open your frontend in browser, press F12, go to Console tab:

### Create Item

```javascript
fetch('http://localhost:4000/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'testuser',
    name: 'Browser Test',
    url: 'https://example.com/test',
    price: 49.99,
    targetYears: 3,
    expectedReturn: 0.06,
  }),
})
  .then((r) => r.json())
  .then(console.log);
```

### List Items

```javascript
fetch('http://localhost:4000/items?userId=testuser')
  .then((r) => r.json())
  .then(console.log);
```

### Delete Item

```javascript
fetch('http://localhost:4000/items/ITEM_ID?userId=testuser', {
  method: 'DELETE',
})
  .then((r) => r.json())
  .then(console.log);
```

---

## Expected Behaviors

### Success Scenarios

- ✅ Creating item returns 201 status
- ✅ Future value (fv) is calculated correctly
- ✅ List returns array (empty [] if no items)
- ✅ Delete returns success message
- ✅ CORS headers present in all responses

### Error Scenarios

- ❌ Missing userId → 400 Bad Request
- ❌ Missing price → 400 Bad Request
- ❌ Invalid item ID → 404 Not Found
- ❌ Backend offline → Network error

---

## Calculation Verification

Verify future value calculation:

**Formula:** FV = Price × (1 + Return)^Years

**Example:**

- Price: $1000
- Years: 5
- Return: 7% (0.07)
- FV = 1000 × (1.07)^5 = 1000 × 1.40255 = **$1402.55**

**Test Cases:**

| Price | Years | Return | Expected FV |
| ----- | ----- | ------ | ----------- |
| $100  | 1     | 7%     | $107.00     |
| $500  | 5     | 7%     | $701.28     |
| $1000 | 10    | 8%     | $2158.92    |
| $250  | 3     | 6%     | $297.62     |

---

## PowerShell Testing (Windows)

### Create Item

```powershell
$body = @{
    userId = "testuser"
    name = "PowerShell Test"
    url = "https://example.com/ps-test"
    price = 299.99
    targetYears = 5
    expectedReturn = 0.07
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/items" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

### List Items

```powershell
Invoke-RestMethod -Uri "http://localhost:4000/items?userId=testuser"
```

### Delete Item

```powershell
Invoke-RestMethod -Uri "http://localhost:4000/items/ITEM_ID?userId=testuser" `
    -Method Delete
```

---

## Troubleshooting

### Backend Not Responding

```bash
# Check if server is running
netstat -ano | findstr :4000

# Start server
cd backend/mock-server
node index.js
```

### CORS Errors

- Check browser console for exact error
- Verify backend CORS middleware is working
- Ensure frontend and backend URLs match

### Wrong Calculations

- Verify expectedReturn is decimal (0.07, not 7)
- Check targetYears is integer
- Look at backend logs for calculation

### 404 Errors

- Verify endpoint URL is correct
- Check method type (GET, POST, DELETE)
- Ensure item ID exists for delete

---

## Sample Data for Testing

```json
{
  "userId": "demo",
  "name": "MacBook Pro",
  "url": "https://apple.com/macbook-pro",
  "price": 2499.99,
  "targetYears": 5,
  "expectedReturn": 0.07
}
```

```json
{
  "userId": "demo",
  "name": "iPhone 15",
  "url": "https://apple.com/iphone-15",
  "price": 999.0,
  "targetYears": 3,
  "expectedReturn": 0.08
}
```

```json
{
  "userId": "demo",
  "name": "Designer Shoes",
  "url": "https://example.com/shoes",
  "price": 450.0,
  "targetYears": 10,
  "expectedReturn": 0.06
}
```

---

## Automated Test Script (PowerShell)

Save as `test-api.ps1`:

```powershell
$baseUrl = "http://localhost:4000"

Write-Host "Testing Impulse Bye API..." -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health"
    Write-Host "✓ Health check passed" -ForegroundColor Green
    $health | ConvertTo-Json
} catch {
    Write-Host "✗ Health check failed" -ForegroundColor Red
}

# Test 2: Create Item
Write-Host "`n2. Creating item..." -ForegroundColor Yellow
$newItem = @{
    userId = "testuser"
    name = "Test Item"
    url = "https://example.com/test"
    price = 100
    targetYears = 5
    expectedReturn = 0.07
} | ConvertTo-Json

try {
    $created = Invoke-RestMethod -Uri "$baseUrl/items" `
        -Method Post -Body $newItem -ContentType "application/json"
    Write-Host "✓ Item created" -ForegroundColor Green
    $itemId = $created.itemId
    $created | ConvertTo-Json
} catch {
    Write-Host "✗ Failed to create item" -ForegroundColor Red
}

# Test 3: List Items
Write-Host "`n3. Listing items..." -ForegroundColor Yellow
try {
    $items = Invoke-RestMethod -Uri "$baseUrl/items?userId=testuser"
    Write-Host "✓ Found $($items.Count) item(s)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to list items" -ForegroundColor Red
}

# Test 4: Delete Item
if ($itemId) {
    Write-Host "`n4. Deleting item..." -ForegroundColor Yellow
    try {
        $deleted = Invoke-RestMethod -Uri "$baseUrl/items/$itemId?userId=testuser" `
            -Method Delete
        Write-Host "✓ Item deleted" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to delete item" -ForegroundColor Red
    }
}

Write-Host "`nAll tests complete!" -ForegroundColor Cyan
```

Run with:

```powershell
.\test-api.ps1
```

---

**Happy Testing! 🧪**
