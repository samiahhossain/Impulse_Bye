# Quick Start Guide - Impulse Bye 💸

## What is Impulse Bye?

Impulse Bye helps you make better purchasing decisions by showing you what your money could become if you invested it instead of making an impulse purchase.

**Example:** That $500 gadget could be worth $701 in 5 years if invested at 7% return!

---

## 🚀 Run Locally (Development)

### 1. Start Backend Server

Open a terminal and run:
```bash
cd backend/mock-server
npm install
node index.js
```

You should see:
```
🚀 Mock API server listening on http://localhost:4000
```

### 2. Start Frontend (New Terminal)

Open a **new terminal** and run:
```bash
cd frontend
npm install
npm run dev
```

You should see:
```
➜  Local:   http://localhost:5173/
```

### 3. Open in Browser

Navigate to: **http://localhost:5173**

---

## ✨ How to Use

### Adding an Item

1. **Product URL**: Paste the link to the product you're considering
   - Example: `https://amazon.com/product-name`

2. **Price**: Enter the price in dollars
   - Example: `299.99`

3. **Item Name** (Optional): Give it a custom name
   - Auto-extracted from URL if left blank

4. **Investment Period**: How many years to compare
   - Default: `5` years
   - Adjust to see different timeframes

5. **Expected Return**: Annual return rate percentage
   - Default: `7%` (historical stock market average)
   - Adjust based on your investment strategy

6. Click **💾 Add Item**

### Understanding the Results

Each item card shows:

- **Price now**: What you'd spend today
- **If invested**: What that money could become
- **Growth bar**: Visual representation of potential gain
- **Gain amount**: Dollar increase from investing
- **Gain percent**: Percentage growth

### Managing Items

- **Hover over card**: Shows delete button (🗑️)
- **Click link icon**: Opens product URL in new tab
- **Delete item**: Removes from wishlist

### Summary Dashboard

Top of page shows:
- **Total Wishlist Value**: Sum of all item prices
- **If Invested Instead**: Total future value if invested
- **Items Tracked**: Number of items in wishlist

---

## 🎯 Real-World Example

**Scenario:** You want to buy:
- New laptop: $1,200
- Smartwatch: $400
- Headphones: $300

**Total:** $1,900

**If invested for 5 years at 7% return:**
- Future Value: $2,664.16
- **Potential Gain: $764.16**

Now you can decide: Is this purchase worth giving up $764 of future wealth?

---

## ☁️ Deploy to AWS

For production deployment to AWS (Lambda, DynamoDB, S3), see:
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete AWS deployment guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design

---

## 🔧 Configuration

### Change API URL

Create `.env` file in `frontend/` folder:
```
VITE_API_BASE=http://localhost:4000
```

For AWS deployment, change to your API Gateway URL:
```
VITE_API_BASE=https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod
```

### Customize Investment Defaults

Edit `frontend/src/components/AddItemForm.jsx`:
```javascript
const [targetYears, setTargetYears] = useState('10');  // Change default years
const [expectedReturn, setExpectedReturn] = useState('8');  // Change default return %
```

---

## 📊 Investment Return Rates (Reference)

Common rates to use:

- **3-5%**: Conservative (bonds, savings)
- **7%**: Historical stock market average (S&P 500)
- **10%**: Aggressive growth stocks
- **12-15%**: Very aggressive (higher risk)

**Note:** Past performance doesn't guarantee future results!

---

## ❓ Troubleshooting

### Frontend won't connect to backend
- Make sure backend server is running on port 4000
- Check browser console for errors (F12)
- Verify `VITE_API_BASE` in .env file

### Items not showing up
- Check backend terminal for errors
- Open browser DevTools → Network tab
- Look for failed API requests

### Port already in use
```bash
# Find and kill process on port 4000 (Windows)
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Or change port in backend/mock-server/index.js
const PORT = process.env.PORT || 5000;  // Use different port
```

---

## 🎓 Project Requirements Met

This project fulfills CSCI3124 requirements:

### AWS Services Used:
- ✅ **Compute**: AWS Lambda (serverless functions)
- ✅ **Storage**: Amazon S3 (static website hosting)
- ✅ **Database**: Amazon DynamoDB (NoSQL storage)
- ✅ **Networking**: Amazon API Gateway (REST API)

### Architecture:
- 3-tier application (Client, API, Database)
- Serverless and scalable
- RESTful API design
- NoSQL data model

### Features:
- Real-world use case (financial decision-making)
- Meaningful business logic (compound interest calculation)
- CRUD operations (Create, Read, Delete)
- Professional UI/UX
- Error handling and validation

---

## 💡 Tips for Best Results

1. **Be Realistic**: Use conservative return rates (5-7%)
2. **Consider Time**: Longer investment periods show bigger differences
3. **Don't Forget Inflation**: A dollar today ≠ a dollar in 10 years
4. **This is a Tool**: Use it to inform decisions, not make them for you
5. **Save Wishlists**: Items can stay in your wishlist while you think it over

---

## 📝 Next Features to Build

Want to enhance the project? Try adding:

- [ ] User accounts with Amazon Cognito
- [ ] Price tracking / price drop alerts
- [ ] Category tags for items
- [ ] Export wishlist to PDF/CSV
- [ ] Share wishlists with friends
- [ ] Dark mode theme
- [ ] Mobile app version
- [ ] Browser extension

---

## 🎉 You're Ready!

Your full-stack cloud application is now running!

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:4000  
**Health Check:** http://localhost:4000/health

Start adding items and see your potential savings grow! 💰
