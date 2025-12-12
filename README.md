# Impulse Bye 💸

**Make your purchasing decisions more intentional and thought out.**

Impulse Bye is a wishlist tracking application that helps you think twice before making impulse purchases. Add items to your wishlist and see how much that money could be worth if you invested it instead.

---

## 🎯 Features

- **Wishlist Management**: Track items you're thinking about buying with URLs and prices
- **Investment Comparison**: See what your money could become if invested instead (configurable return rate and time period)
- **Visual Analytics**: Beautiful cards showing price vs. future value with growth indicators
- **User-Friendly**: Simple, intuitive interface with real-time updates
- **Responsive Design**: Works seamlessly on desktop and mobile devices

---

## 🏗️ Architecture

This is a full-stack cloud application built for AWS:

### Frontend

- **Framework**: React 19 + Vite
- **Styling**: Custom CSS with gradients and responsive design
- **State Management**: React Hooks (useState, useEffect)
- **API Integration**: RESTful API calls

### Backend Options

#### Option 1: Mock Server (Development)

- **Runtime**: Node.js + Express
- **Storage**: In-memory (object store)
- **CORS**: Enabled for local development

#### Option 2: AWS Lambda + DynamoDB (Production)

- **Compute**: AWS Lambda (serverless functions)
- **Database**: Amazon DynamoDB (NoSQL)
- **API**: Amazon API Gateway (REST API)
- **Storage**: Amazon S3 (static site hosting)

### AWS Services Used (meets project requirements)

- ✅ **Compute**: AWS Lambda
- ✅ **Storage**: Amazon S3 (for frontend hosting)
- ✅ **Database**: Amazon DynamoDB
- ✅ **Networking**: Amazon API Gateway

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- AWS Account (for production deployment)
- AWS CLI configured (optional)

### Local Development

#### 1. Install Dependencies

**Frontend:**

```bash
cd frontend
npm install
```

**Backend (Mock Server):**

```bash
cd backend/mock-server
npm install
```

#### 2. Start Backend Server

```bash
cd backend/mock-server
node index.js
```

Server will run on `http://localhost:4000`

#### 3. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

#### 4. Open in Browser

Navigate to `http://localhost:5173` and start adding items!

---

## ☁️ AWS Deployment

### Step 1: Create DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name ImpulseByeItems \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=itemId,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=itemId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

### Step 2: Deploy Lambda Functions

**Create IAM Role** (use existing LabRole in AWS Academy):

- Attach policies: `AmazonDynamoDBFullAccess`, `CloudWatchLogsFullAccess`

**Package and deploy each Lambda:**

```bash
# Create Item Lambda
cd backend/create-item
zip -r create-item.zip .
aws lambda create-function \
  --function-name impulse-bye-create-item \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/LabRole \
  --handler index.handler \
  --zip-file fileb://create-item.zip \
  --environment Variables={TABLE_NAME=ImpulseByeItems}

# List Items Lambda
cd ../list-items
zip -r list-items.zip .
aws lambda create-function \
  --function-name impulse-bye-list-items \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/LabRole \
  --handler index.handler \
  --zip-file fileb://list-items.zip \
  --environment Variables={TABLE_NAME=ImpulseByeItems}

# Delete Item Lambda
cd ../delete-item
zip -r delete-item.zip .
aws lambda create-function \
  --function-name impulse-bye-delete-item \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/LabRole \
  --handler index.handler \
  --zip-file fileb://delete-item.zip \
  --environment Variables={TABLE_NAME=ImpulseByeItems}
```

### Step 3: Create API Gateway

1. Go to AWS Console → API Gateway
2. Create a new REST API named "ImpulseByeAPI"
3. Create resources and methods:
   - `POST /items` → `impulse-bye-create-item`
   - `GET /items` → `impulse-bye-list-items`
   - `DELETE /items/{itemId}` → `impulse-bye-delete-item`
4. Enable CORS on all methods
5. Deploy API to a stage (e.g., `prod`)
6. Note the Invoke URL

### Step 4: Deploy Frontend to S3

```bash
cd frontend

# Update API_BASE in src/api.js with your API Gateway URL
# Or set environment variable:
# VITE_API_BASE=https://YOUR_API_ID.execute-api.REGION.amazonaws.com/prod

# Build for production
npm run build

# Create S3 bucket
aws s3 mb s3://impulse-bye-frontend-YOUR_NAME

# Configure for static website hosting
aws s3 website s3://impulse-bye-frontend-YOUR_NAME \
  --index-document index.html

# Upload files
aws s3 sync dist/ s3://impulse-bye-frontend-YOUR_NAME --acl public-read

# Set bucket policy for public read
aws s3api put-bucket-policy --bucket impulse-bye-frontend-YOUR_NAME --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::impulse-bye-frontend-YOUR_NAME/*"
  }]
}'
```

Your app will be available at: `http://impulse-bye-frontend-YOUR_NAME.s3-website-REGION.amazonaws.com`

---

## 📁 Project Structure

```
Impulse_Bye/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddItemForm.jsx    # Form to add new wishlist items
│   │   │   └── ItemCard.jsx       # Card component displaying item details
│   │   ├── api.js                 # API integration layer
│   │   ├── App.jsx                # Main application component
│   │   ├── App.css                # Application styles
│   │   └── main.jsx               # React entry point
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── create-item/               # Lambda: Create wishlist item
│   │   ├── index.js
│   │   └── package.json
│   ├── list-items/                # Lambda: List user's items
│   │   ├── index.js
│   │   └── package.json
│   ├── delete-item/               # Lambda: Delete item
│   │   ├── index.js
│   │   └── package.json
│   └── mock-server/               # Local development server
│       ├── index.js
│       └── package.json
└── README.md
```

---

## 💡 How It Works

1. **Add an Item**: Paste a product URL and enter the price
2. **Configure Investment**: Set how many years and expected return rate (defaults: 5 years @ 7%)
3. **See the Comparison**: View current price vs. what that money could become if invested
4. **Make Better Decisions**: Use this information to decide if the purchase is worth it

### Example Calculation

If you skip buying a **$500 item** and invest it instead at **7% annual return** for **5 years**:

```
Future Value = $500 × (1.07)^5 = $701.28
Potential Gain = $201.28 (40% growth)
```

---

## 🔒 Security Considerations

- **CORS**: Properly configured to allow frontend-backend communication
- **Input Validation**: All inputs validated on both client and server
- **IAM Roles**: Lambda functions use least-privilege IAM roles (LabRole in AWS Academy)
- **HTTPS**: API Gateway provides HTTPS endpoints by default
- **DynamoDB**: Data encrypted at rest

### Production Enhancements (Future)

- Add Amazon Cognito for user authentication
- Implement API key/authorization in API Gateway
- Add AWS WAF for DDoS protection
- Use CloudFront CDN for S3 static hosting
- Implement CloudWatch monitoring and alarms

---

## 💰 Cost Analysis

### Development (Mock Server)

- **Cost**: $0 (runs locally)

### AWS Production (estimated monthly costs for low usage)

- **DynamoDB**: ~$0-$1 (on-demand pricing, first 25GB free)
- **Lambda**: ~$0 (1M requests free tier)
- **API Gateway**: ~$0-$1 (1M requests = ~$3.50, but low usage)
- **S3 Hosting**: ~$0.50 (storage + requests)
- **Total**: ~$1-$3/month for personal use

### Cost Optimization

- Use DynamoDB on-demand pricing for unpredictable traffic
- Lambda serverless = pay per request only
- S3 static hosting is cheaper than EC2
- No need for load balancers or NAT gateways

---

## 🎓 Learning Outcomes

This project demonstrates:

- Full-stack web development with React and Node.js
- RESTful API design and implementation
- Serverless architecture (AWS Lambda)
- NoSQL database design (DynamoDB)
- Cloud deployment and infrastructure
- CORS and API security
- Responsive web design

---

## 🔮 Future Enhancements

- [ ] User authentication with Amazon Cognito
- [ ] Share wishlists with friends/family
- [ ] Browser extension to add items from any website
- [ ] Email notifications for price drops
- [ ] Historical price tracking
- [ ] Category-based organization
- [ ] Export data to CSV
- [ ] Dark mode theme
- [ ] Mobile app (React Native)

---

## 📝 License

This project is for educational purposes as part of CSCI3124 Cloud Computing coursework.

---

## 👤 Author

Built with ❤️ for making better financial decisions!
