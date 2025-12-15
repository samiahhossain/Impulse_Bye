# Impulse Bye - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vite)                        │  │
│  │  - AddItemForm.jsx   - ItemCard.jsx   - App.jsx          │  │
│  │  - Hosted on Amazon S3 (Static Website)                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │           Amazon API Gateway (REST API)                   │  │
│  │  - POST   /items          (Create)                        │  │
│  │  - GET    /items?userId=X (List)                          │  │
│  │  - DELETE /items/{id}     (Delete)                        │  │
│  │  - CORS enabled                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     COMPUTE TIER                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ AWS Lambda   │  │ AWS Lambda   │  │ AWS Lambda   │          │
│  │              │  │              │  │              │          │
│  │ create-item  │  │ list-items   │  │ delete-item  │          │
│  │              │  │              │  │              │          │
│  │ - Validation │  │ - Query DDB  │  │ - Delete     │          │
│  │ - Calculate  │  │ - Return []  │  │   from DDB   │          │
│  │   FV formula │  │              │  │              │          │
│  │ - Store DDB  │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │ IAM Role (LabRole)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE TIER                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │               Amazon DynamoDB                             │  │
│  │                                                           │  │
│  │  Table: ImpulseByeItems                                  │  │
│  │  Partition Key: userId (String)                          │  │
│  │  Sort Key: itemId (String)                               │  │
│  │                                                           │  │
│  │  Attributes:                                             │  │
│  │    - name, url, price, targetYears                       │  │
│  │    - expectedReturn, fv, createdAt                       │  │
│  │                                                           │  │
│  │  Billing: On-Demand (Pay per request)                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

## Data Flow

1. User adds item via React form
2. Frontend sends POST to API Gateway
3. API Gateway triggers create-item Lambda
4. Lambda calculates future value: FV = Price × (1 + r)^t
5. Lambda stores item in DynamoDB
6. Response returns to frontend
7. Frontend updates UI with new item card

## Investment Calculation Formula

Future Value (FV) = Present Value × (1 + Return Rate)^Years

Example:
  Price: $500
  Years: 5
  Return: 7% (0.07)
  FV = $500 × (1.07)^5 = $701.28
  Gain = $201.28 (40.3%)
```

## AWS Services Mapping to Requirements

### Required Services ✅

**Compute** (Pick at least one):

- ✅ AWS Lambda - Serverless functions for all API operations

**Storage** (Pick at least one):

- ✅ Amazon S3 - Static website hosting for React frontend

**Networking** (Pick at least one):

- ✅ Amazon API Gateway - REST API for frontend-backend communication

**Database** (Pick at least one):

- ✅ Amazon DynamoDB - NoSQL database for wishlist items

### Optional Services (Enhancement Opportunities)

**Security**:

- Amazon Cognito - User authentication
- AWS WAF - Web application firewall
- AWS Certificate Manager - SSL/TLS certificates

**Management**:

- Amazon CloudWatch - Logging and monitoring
- AWS CloudFormation - Infrastructure as Code
- AWS X-Ray - Distributed tracing

**Content Delivery**:

- Amazon CloudFront - CDN for S3 static site

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  HTTPS (TLS)                                                 │
│  ↓                                                           │
│  API Gateway                                                 │
│  ↓                                                           │
│  IAM Role (LabRole) - Lambda execution                      │
│  ↓                                                           │
│  DynamoDB - Encryption at rest (default)                    │
└─────────────────────────────────────────────────────────────┘
```

### Security Measures

1. **Transport Security**: HTTPS for all API calls
2. **Access Control**: IAM roles with least privilege
3. **Input Validation**: Client and server-side validation
4. **CORS**: Configured to allow only frontend domain
5. **Data Encryption**: DynamoDB encryption at rest

### Security Enhancements (Future)

- Add Cognito user pools for authentication
- Implement API keys in API Gateway
- Add request throttling and rate limiting
- Use AWS Secrets Manager for sensitive config
- Enable CloudTrail for audit logging

