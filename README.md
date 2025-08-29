# 🚀 Squill - Serverless Billing Automation Platform

A modern, serverless billing-as-a-service platform built on AWS with a React frontend.

## 🎯 Overview

Squill provides automated billing solutions for SaaS companies through a clean, modern web interface with real-time analytics and PDF invoice generation.

## 🏗️ Architecture

- **Frontend**: React with Next.js, Tailwind CSS, shadcn/ui
- **Backend**: AWS Lambda, API Gateway, DynamoDB
- **Automation**: EventBridge, SES, S3
- **Monitoring**: CloudWatch, X-Ray

## 🚀 Quick Start

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Demo Credentials
- **Email**: admin@squill.com
- **Password**: demo123

## 📊 Features

- **Real-time Dashboard** with interactive charts
- **PDF Invoice Generation** with custom branding
- **Automated Billing Cycles** via EventBridge
- **Multi-tenant Architecture** for SaaS companies
- **Responsive Design** with purple theme
- **Authentication** with JWT tokens

## 🎨 Design System

- **Primary Color**: Purple (#8A2BE2)
- **Typography**: Departure Mono font
- **Theme**: Dark with gradient backgrounds
- **Components**: shadcn/ui with custom styling

## 📱 Pages

1. **Landing Page** - Marketing and sign-up
2. **Login Page** - Authentication
3. **Dashboard** - Analytics and invoice management

## 🔧 Tech Stack

### Frontend
- Next.js 14
- React 18
- Tailwind CSS
- shadcn/ui
- Recharts
- jsPDF

### Backend (AWS)
- Lambda Functions
- API Gateway
- DynamoDB
- EventBridge
- S3, SES, CloudWatch

## 📈 System Design

See `SYSTEM_DESIGN.md` for detailed architecture with 12 primary components.

## 🎯 Demo Features

- Interactive revenue and usage charts
- Customer and invoice management
- PDF invoice generation and download
- Real-time system status monitoring
- Responsive design across devices

## 🔐 Security

- JWT-based authentication
- IAM access controls
- Data encryption at rest and in transit
- Secure API endpoints

## 📊 Monitoring

- CloudWatch metrics and logs
- X-Ray distributed tracing
- Real-time system health dashboard
- Performance monitoring

## 🚀 Deployment

The application is designed for AWS deployment with:
- Frontend: S3 + CloudFront
- Backend: Serverless Framework
- Database: DynamoDB
- Monitoring: CloudWatch + X-Ray

---

**Built with ❤️ for modern SaaS billing automation**