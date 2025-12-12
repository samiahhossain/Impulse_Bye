# Deployment Checklist - Impulse Bye

Use this checklist when deploying to AWS for your CSCI3124 project.

## ✅ Pre-Deployment

- [ ] All code tested locally
- [ ] Backend server runs successfully
- [ ] Frontend connects to backend
- [ ] Can add, view, and delete items
- [ ] No console errors in browser
- [ ] All documentation reviewed

## ✅ AWS Account Setup

- [ ] AWS Academy Learner Lab accessed
- [ ] AWS CLI installed on local machine
- [ ] AWS credentials configured (`aws configure` or AWS Academy CLI commands)
- [ ] LabRole ARN copied (needed for Lambda)
- [ ] Chosen AWS region (recommend: us-east-1)

## ✅ Phase 1: Database (DynamoDB)

- [ ] Create DynamoDB table `ImpulseByeItems`
- [ ] Set partition key: `userId` (String)
- [ ] Set sort key: `itemId` (String)
- [ ] Choose on-demand billing
- [ ] Verify table created successfully
- [ ] Note table ARN

## ✅ Phase 2: Lambda Functions

### create-item Lambda
- [ ] Navigate to `backend/create-item`
- [ ] Run `npm install`
- [ ] Create `function.zip`
- [ ] Deploy to AWS Lambda
- [ ] Set runtime: Node.js 18.x
- [ ] Set role: LabRole
- [ ] Set environment variable: `TABLE_NAME=ImpulseByeItems`
- [ ] Set timeout: 10 seconds
- [ ] Set memory: 256 MB
- [ ] Test function with sample event

### list-items Lambda
- [ ] Navigate to `backend/list-items`
- [ ] Run `npm install`
- [ ] Create `function.zip`
- [ ] Deploy to AWS Lambda
- [ ] Set runtime: Node.js 18.x
- [ ] Set role: LabRole
- [ ] Set environment variable: `TABLE_NAME=ImpulseByeItems`
- [ ] Set timeout: 10 seconds
- [ ] Set memory: 256 MB
- [ ] Test function with sample event

### delete-item Lambda
- [ ] Navigate to `backend/delete-item`
- [ ] Run `npm install`
- [ ] Create `function.zip`
- [ ] Deploy to AWS Lambda
- [ ] Set runtime: Node.js 18.x
- [ ] Set role: LabRole
- [ ] Set environment variable: `TABLE_NAME=ImpulseByeItems`
- [ ] Set timeout: 10 seconds
- [ ] Set memory: 256 MB
- [ ] Test function with sample event

## ✅ Phase 3: API Gateway

### Create API
- [ ] Go to API Gateway console
- [ ] Create new REST API
- [ ] Name: `ImpulseByeAPI`
- [ ] Description added

### Create Resources
- [ ] Create resource `/items`
- [ ] Enable CORS on `/items`
- [ ] Create resource `/items/{itemId}`
- [ ] Enable CORS on `/items/{itemId}`

### Create Methods
- [ ] Create `POST /items` → `impulse-bye-create-item` Lambda
- [ ] Enable Lambda Proxy Integration
- [ ] Create `GET /items` → `impulse-bye-list-items` Lambda
- [ ] Enable Lambda Proxy Integration
- [ ] Create `DELETE /items/{itemId}` → `impulse-bye-delete-item` Lambda
- [ ] Enable Lambda Proxy Integration

### Enable CORS (All Methods)
- [ ] Enable CORS on POST /items
- [ ] Enable CORS on GET /items
- [ ] Enable CORS on DELETE /items/{itemId}
- [ ] Enable CORS on OPTIONS methods (auto-created)

### Deploy API
- [ ] Click "Deploy API"
- [ ] Create stage: `prod`
- [ ] Deploy to `prod` stage
- [ ] Copy Invoke URL
- [ ] Save Invoke URL for frontend configuration

## ✅ Phase 4: Test API

Using curl or Postman:

### Test Create Item
- [ ] POST to `/items` with valid payload
- [ ] Verify 201 response
- [ ] Check item created in DynamoDB

### Test List Items
- [ ] GET `/items?userId=testuser`
- [ ] Verify 200 response
- [ ] Check items returned

### Test Delete Item
- [ ] DELETE `/items/{itemId}?userId=testuser`
- [ ] Verify 200 response
- [ ] Check item removed from DynamoDB

### Check CORS
- [ ] Verify CORS headers in responses
- [ ] Test from browser console (fetch)

## ✅ Phase 5: Frontend Build

- [ ] Navigate to `frontend/` folder
- [ ] Create `.env` file
- [ ] Add `VITE_API_BASE=<your-api-gateway-url>`
- [ ] Run `npm install` (if not already done)
- [ ] Run `npm run build`
- [ ] Verify `dist/` folder created
- [ ] Check `dist/` contains index.html and assets

## ✅ Phase 6: S3 Static Hosting

### Create Bucket
- [ ] Create S3 bucket with unique name
- [ ] Region matches API Gateway region
- [ ] Unblock all public access (for static website)
- [ ] Note bucket name

### Configure Website Hosting
- [ ] Enable static website hosting
- [ ] Set index document: `index.html`
- [ ] Set error document: `index.html`
- [ ] Note website endpoint URL

### Upload Files
- [ ] Upload all files from `dist/` folder
- [ ] Set permissions to public-read
- [ ] Verify files uploaded successfully

### Set Bucket Policy
- [ ] Create bucket policy for public read access
- [ ] Apply policy to bucket
- [ ] Verify policy applied

## ✅ Phase 7: End-to-End Testing

- [ ] Open S3 website URL in browser
- [ ] Check browser console for errors
- [ ] Add a test item
- [ ] Verify item appears in list
- [ ] Check item in DynamoDB console
- [ ] Delete test item
- [ ] Verify item removed
- [ ] Test on mobile device/responsive mode
- [ ] Test all form validations
- [ ] Test error scenarios

## ✅ Phase 8: Documentation & Presentation

### Architecture Diagram
- [ ] Create diagram using diagrams.net
- [ ] Include all AWS services
- [ ] Show data flow
- [ ] Export as PNG/PDF

### Written Report
- [ ] Introduction - Project description
- [ ] AWS services - Selection and justification
- [ ] Architecture - Diagram and explanation
- [ ] Data model - Table structure
- [ ] Code - Languages and deployment
- [ ] Security - Measures and vulnerabilities
- [ ] Cost analysis - Calculations and alternatives
- [ ] Future enhancements - Next features

### Video Presentation (Max 15 min)
- [ ] Student ID visible at start
- [ ] Face visible throughout
- [ ] Slides prepared
- [ ] Live demo of working application
- [ ] Show AWS console (DynamoDB, Lambda, API Gateway, S3)
- [ ] Explain architecture
- [ ] Discuss security
- [ ] Present cost analysis
- [ ] Show future plans

## ✅ Final Checks

- [ ] All AWS resources created and configured
- [ ] Application works end-to-end
- [ ] No errors in browser console
- [ ] No errors in Lambda CloudWatch logs
- [ ] Written report complete
- [ ] Video recorded and uploaded
- [ ] All documentation in repository
- [ ] Repository clean (no sensitive data)

## ✅ Submission

- [ ] Written report (PDF) submitted
- [ ] Video presentation link/file submitted
- [ ] Repository URL submitted (if required)
- [ ] All deadlines met

## 🎉 Post-Submission

### Optional (Keep Running)
- [ ] Monitor CloudWatch logs
- [ ] Check costs in AWS Billing
- [ ] Share with friends/portfolio

### Cleanup (When Done)
- [ ] Delete Lambda functions
- [ ] Delete API Gateway API
- [ ] Delete DynamoDB table
- [ ] Empty and delete S3 bucket
- [ ] Verify no charges accumulating

---

## 📝 Notes

**Estimated Time:**
- Phase 1-2 (Database + Lambda): 30-45 min
- Phase 3 (API Gateway): 20-30 min
- Phase 4 (Testing): 15 min
- Phase 5-6 (Frontend + S3): 20 min
- Phase 7 (E2E Testing): 15 min
- Phase 8 (Documentation): 2-4 hours
- **Total: 4-6 hours**

**Common Issues:**
- Lambda timeout → Increase timeout setting
- CORS errors → Re-enable CORS on all methods
- 403 on S3 → Check bucket policy
- Items not showing → Check userId consistency
- Lambda errors → Check CloudWatch Logs

**Resources:**
- AWS Documentation: https://docs.aws.amazon.com
- Your DEPLOYMENT.md file
- Your ARCHITECTURE.md file
- CSCI3124 course materials

---

**Good luck with your deployment! 🚀**
