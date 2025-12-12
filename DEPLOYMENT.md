# Deployment Guide - Impulse Bye

This guide provides step-by-step instructions for deploying Impulse Bye to AWS.

## Prerequisites

- AWS Account (AWS Academy Learner Lab access)
- AWS CLI installed and configured
- Node.js 18+ installed
- Git installed

## Quick Start (Local Development)

```bash
# 1. Clone and setup
git clone <your-repo-url>
cd Impulse_Bye

# 2. Start backend
cd backend/mock-server
npm install
node index.js

# 3. Start frontend (new terminal)
cd frontend
npm install
npm run dev

# 4. Open http://localhost:5173
```

---

## AWS Deployment Steps

### Phase 1: Database Setup

#### Create DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name ImpulseByeItems \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=itemId,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=itemId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

**Verify:**
```bash
aws dynamodb describe-table --table-name ImpulseByeItems
```

---

### Phase 2: Lambda Functions

#### Get LabRole ARN (AWS Academy)

```bash
aws iam get-role --role-name LabRole --query 'Role.Arn' --output text
```

Save this ARN - you'll need it for each Lambda function.

#### Deploy create-item Lambda

```bash
cd backend/create-item
npm install
zip -r function.zip .

aws lambda create-function \
  --function-name impulse-bye-create-item \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/LabRole \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --environment Variables={TABLE_NAME=ImpulseByeItems} \
  --timeout 10 \
  --memory-size 256 \
  --region us-east-1
```

#### Deploy list-items Lambda

```bash
cd ../list-items
npm install
zip -r function.zip .

aws lambda create-function \
  --function-name impulse-bye-list-items \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/LabRole \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --environment Variables={TABLE_NAME=ImpulseByeItems} \
  --timeout 10 \
  --memory-size 256 \
  --region us-east-1
```

#### Deploy delete-item Lambda

```bash
cd ../delete-item
npm install
zip -r function.zip .

aws lambda create-function \
  --function-name impulse-bye-delete-item \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/LabRole \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --environment Variables={TABLE_NAME=ImpulseByeItems} \
  --timeout 10 \
  --memory-size 256 \
  --region us-east-1
```

#### Deploy update-item Lambda

```bash
cd ../update-item
npm install
zip -r function.zip .

aws lambda create-function \
  --function-name impulse-bye-update-item \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/LabRole \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --environment Variables={TABLE_NAME=ImpulseByeItems} \
  --timeout 10 \
  --memory-size 256 \
  --region us-east-1
```

**Verify:**
```bash
aws lambda list-functions --query 'Functions[?starts_with(FunctionName, `impulse-bye`)].FunctionName'
```

---

### Phase 3: API Gateway Setup

**Option A: AWS Console (Recommended for beginners)**

1. Go to AWS Console → API Gateway
2. Click "Create API" → "REST API" → "Build"
3. Name: `ImpulseByeAPI`, click "Create"

**Create Resources:**

4. Click "Actions" → "Create Resource"
   - Resource Name: `items`
   - Resource Path: `/items`
   - Enable CORS: ✓
   - Click "Create Resource"

5. Click "Actions" → "Create Resource" (under /items)
   - Resource Name: `item`
   - Resource Path: `/{itemId}`
   - Enable CORS: ✓

**Create Methods:**

6. Select `/items` → "Actions" → "Create Method" → `POST`
   - Integration type: Lambda Function
   - Use Lambda Proxy integration: ✓
   - Lambda Function: `impulse-bye-create-item`
   - Click "Save"

7. Select `/items` → "Actions" → "Create Method" → `GET`
   - Integration type: Lambda Function
   - Use Lambda Proxy integration: ✓
   - Lambda Function: `impulse-bye-list-items`

8. Select `/items/{itemId}` → "Actions" → "Create Method" → `DELETE`
   - Integration type: Lambda Function
   - Use Lambda Proxy integration: ✓
   - Lambda Function: `impulse-bye-delete-item`

9. Select `/items/{itemId}` → "Actions" → "Create Method" → `PUT`
   - Integration type: Lambda Function
   - Use Lambda Proxy integration: ✓
   - Lambda Function: `impulse-bye-update-item`

**Enable CORS:**

10. Select each resource → "Actions" → "Enable CORS"
   - Accept defaults → "Enable CORS and replace existing CORS headers"

**Deploy API:**

11. "Actions" → "Deploy API"
    - Deployment stage: `[New Stage]`
    - Stage name: `prod`
    - Click "Deploy"

12. **Copy the Invoke URL** - you'll need this!
    - Example: `https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod`

---

### Phase 4: Frontend Deployment

#### Build Frontend

```bash
cd frontend

# Create .env file with your API URL
echo "VITE_API_BASE=https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod" > .env

# Build
npm run build
```

#### Create S3 Bucket

```bash
# Use a unique name
BUCKET_NAME="impulse-bye-frontend-$(date +%s)"

aws s3 mb s3://$BUCKET_NAME --region us-east-1

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME \
  --index-document index.html \
  --error-document index.html
```

#### Upload Files

```bash
aws s3 sync dist/ s3://$BUCKET_NAME --acl public-read
```

#### Set Bucket Policy

```bash
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
```

#### Get Website URL

```bash
echo "http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"
```

Visit this URL to see your app! 🎉

---

## Testing Your Deployment

### Test API Endpoints

**Create Item:**
```bash
curl -X POST https://YOUR_API_URL/prod/items \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "testuser",
    "name": "Test Product",
    "url": "https://example.com/product",
    "price": 99.99,
    "targetYears": 5,
    "expectedReturn": 0.07
  }'
```

**List Items:**
```bash
curl https://YOUR_API_URL/prod/items?userId=testuser
```

**Delete Item:**
```bash
curl -X DELETE https://YOUR_API_URL/prod/items/ITEM_ID?userId=testuser
```

### Test Frontend

1. Open your S3 website URL
2. Add a test item
3. Verify it appears in the list
4. Delete the item
5. Check browser console for errors

---

## Update Deployment

### Update Lambda Function

```bash
cd backend/create-item
zip -r function.zip .

aws lambda update-function-code \
  --function-name impulse-bye-create-item \
  --zip-file fileb://function.zip
```

### Update Frontend

```bash
cd frontend
npm run build
aws s3 sync dist/ s3://$BUCKET_NAME --acl public-read --delete
```

---

## Monitoring and Debugging

### View Lambda Logs

```bash
aws logs tail /aws/lambda/impulse-bye-create-item --follow
```

### View DynamoDB Items

```bash
aws dynamodb scan --table-name ImpulseByeItems --max-items 10
```

### API Gateway Logs

1. Console → API Gateway → Your API → Stages → prod
2. Enable CloudWatch Logs
3. View in CloudWatch Logs

---

## Cleanup (Delete Everything)

```bash
# Delete Lambda functions
aws lambda delete-function --function-name impulse-bye-create-item
aws lambda delete-function --function-name impulse-bye-list-items
aws lambda delete-function --function-name impulse-bye-delete-item

# Delete DynamoDB table
aws dynamodb delete-table --table-name ImpulseByeItems

# Delete S3 bucket
aws s3 rb s3://$BUCKET_NAME --force

# Delete API Gateway (via console or get API ID and delete via CLI)
aws apigateway get-rest-apis
aws apigateway delete-rest-api --rest-api-id YOUR_API_ID
```

---

## Troubleshooting

### CORS Errors
- Verify CORS is enabled on all API Gateway methods
- Check Lambda functions return CORS headers
- Clear browser cache

### 403 Forbidden on S3
- Check bucket policy is applied
- Verify files are public-read
- Check bucket name in URL matches

### Lambda Timeout
- Increase timeout in Lambda configuration
- Check DynamoDB table exists and is accessible

### Items Not Appearing
- Check API URL in frontend .env
- Verify userId is consistent
- Check browser Network tab for errors
- Review Lambda CloudWatch logs

---

## Cost Estimation

**Monthly costs for 1000 users, 10 requests/user/month:**

- DynamoDB: $0.25 (on-demand, 10k writes, 10k reads)
- Lambda: $0.20 (10k invocations)
- API Gateway: $0.035 (10k requests)
- S3 Hosting: $0.50 (storage + requests)
- **Total: ~$1/month**

Most services are within AWS free tier for first year!

---

## Next Steps

- [ ] Add user authentication with Cognito
- [ ] Set up CloudFront for HTTPS and CDN
- [ ] Implement CloudWatch alarms
- [ ] Add CI/CD with GitHub Actions
- [ ] Create CloudFormation template

---

**Need help?** Check AWS documentation or CloudWatch logs for detailed error messages.
