# 🚀 Squill - Serverless Billing Automation Platform

[![AWS](https://img.shields.io/badge/AWS-Serverless-orange)](https://aws.amazon.com/)
[![React](https://img.shields.io/badge/React-18.0-blue)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.12-green)](https://python.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](http://squill-frontend-bucket-1756485949914.s3-website-us-east-1.amazonaws.com)

**Modern serverless billing automation platform with React frontend and Python backend on AWS.**


## ✨ Features
- 📊 **Analytics Dashboard** - Real-time revenue & usage tracking
- 👥 **Customer Management** - Profile & billing cycle management  
- 🧾 **Invoice System** - Automated PDF generation & email delivery
- 📈 **Usage Tracking** - API calls, storage, bandwidth monitoring
- ⚙️ **Automation** - Scheduled billing & threshold alerts

## 🏗️ Tech Stack
- **Frontend**: React 18, responsive UI
- **Backend**: Python 3.12, AWS Lambda
- **Database**: DynamoDB
- **Storage**: S3 (hosting + files)
- **API**: API Gateway with CORS
- **Monitoring**: CloudWatch

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, Python 3.12+
- AWS CLI configured
- Serverless Framework

### Installation
```bash
# Clone and install
git clone <repo-url>
cd Squill
pip install -r requirements.txt
cd frontend && npm install
```

### Local Development
```bash
# Start backend
serverless offline --stage dev

# Start frontend (new terminal)
cd frontend && npm start
```

### Deploy to AWS
```bash
# Deploy backend
npm run deploy:prod

# Deploy frontend
npm run deploy:frontend

# Complete deployment
npm run complete:day7
```

## 📚 API Endpoints

```http
POST /usage          # Track usage events
GET  /analytics      # Get dashboard data
GET  /customers      # List customers
POST /customers      # Create customer
POST /invoice        # Generate invoice
```

## 📁 Project Structure
```
Squill/
├── frontend/           # React app
├── scripts/           # Deployment scripts
├── handler.py         # Lambda functions
├── serverless.yml     # AWS infrastructure
├── requirements.txt   # Python deps
└── package.json       # Node deps
```

## 🔧 Available Scripts
```bash
npm run deploy:prod        # Deploy backend
npm run deploy:frontend    # Deploy frontend  
npm run complete:day7      # Full deployment
npm run fix:s3            # Fix S3 access
npm run verify:deployment # Test deployment
npm run logs              # View logs
```

## ⚙️ Environment Setup
```bash
# .env file
AWS_REGION=us-east-1
STAGE=prod
CUSTOMERS_TABLE=Customers-prod
USAGE_EVENTS_TABLE=UsageEvents-prod
```

## 🚨 Troubleshooting

**Lambda Size Error**: Use `npm run complete:day7`  
**S3 Access Issues**: Run `npm run fix:s3`  
**API Errors**: Check `npm run logs`

## 📊 Production Status
- ✅ **Frontend**: Live on S3 static hosting
- ✅ **Backend**: Serverless API deployed  
- ✅ **Database**: DynamoDB tables created
- ✅ **Monitoring**: CloudWatch configured
- ✅ **Public Access**: Website accessible

## 🤝 Contributing
1. Fork repository
2. Create feature branch
3. Submit pull request

## 📄 License
MIT License - see [LICENSE](LICENSE) file.

---
**Built in 7 days | Production Ready | Serverless Architecture**