# Squill API Documentation

## Overview
Squill provides a RESTful API for usage-based billing automation. All endpoints return JSON responses and use standard HTTP status codes.

**Base URL:** `[YOUR-API-ENDPOINT]`

## Endpoints

### Usage Management

#### POST /usage
Ingest usage events for billing calculation.

**Request Body:**
```json
{
  "customer_id": "string (required)",
  "event_type": "string (required)", 
  "quantity": "number (required)",
  "metadata": "object (optional)"
}
```

**Example:**
```bash
curl -X POST [YOUR-API-ENDPOINT]/usage \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "customer-123",
    "event_type": "api_call",
    "quantity": 100,
    "metadata": {"endpoint": "/users"}
  }'
```

### Customer Management

#### POST /customers
Create a new customer.

**Request Body:**
```json
{
  "customer_id": "string (required)",
  "name": "string (required)",
  "email": "string (required)",
  "pricing_tier": "basic|premium|enterprise (optional, default: basic)"
}
```

#### GET /customers/{customer_id}
Retrieve customer information.

#### PUT /customers/{customer_id}
Update customer information.

### Billing

#### GET /customers/{customer_id}/bill
Calculate current bill for a customer.

**Query Parameters:**
- `period`: "current|previous" (default: current)

**Response (200):**
```json
{
  "customer_id": "customer-123",
  "billing_period": {
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-01-31T23:59:59Z",
    "period_name": "2024-01"
  },
  "customer_tier": "basic",
  "bill": {
    "total_amount": "13.50",
    "currency": "USD",
    "breakdown_by_service": {
      "api_call": {
        "total_quantity": 15000,
        "total_cost": "13.00"
      }
    }
  }
}
```

### Analytics

#### GET /analytics
Get platform analytics and metrics.

**Response:**
```json
{
  "total_revenue": 127850,
  "total_customers": 6,
  "total_invoices": 5,
  "monthly_revenue": [
    {"month": "JAN", "revenue": 85000},
    {"month": "FEB", "revenue": 92000}
  ]
}
```

## Authentication
Include your JWT token in the Authorization header:
```
Authorization: Bearer your-jwt-token
```

## Error Responses
All endpoints return consistent error responses:
```json
{
  "error": "Error message",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Pricing Tiers

### Basic Tier
- API Calls: First 1,000 free, then $0.001 per call
- Storage: First 5GB free, then $0.10 per GB

### Premium Tier  
- API Calls: First 5,000 free, then $0.0008 per call
- Storage: First 20GB free, then $0.08 per GB

### Enterprise Tier
- API Calls: First 20,000 free, then $0.0005 per call
- Storage: First 100GB free, then $0.05 per GB

---

## Setup Instructions
1. Deploy the serverless backend: `serverless deploy`
2. Replace `[YOUR-API-ENDPOINT]` with your actual API Gateway URL
3. Configure environment variables in your frontend application