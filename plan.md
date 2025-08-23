# Squill: Project Plan

## Project Overview
Squill is a serverless SaaS usage-based billing automation system built on AWS. It automates usage tracking, tiered pricing, invoice generation, and customer dashboards for SaaS companies. The system is designed to be built by a single developer in 7 days, focusing on core functionality with a simplified architecture for executability.

### Primary Objectives
- Build a production-ready MVP demonstrating cloud-native FinTech skills.
- Achieve 100% automation of billing cycles with 99.95% accuracy.
- Support scalability for 1M+ transactions/day via serverless design.

### Key Constraints
- Timeline: 7 days, 8 hours/day (4h morning, 4h afternoon).
- Developer: Solo, intermediate AWS/Python/React knowledge assumed.
- Budget: Minimize costs (use free tier, LocalStack for local dev).
- Scope: MVP only—defer payments, advanced analytics to future phases.

## Problem Statement
SaaS firms face billing issues: manual processes (70% prevalence), revenue leakage (15-20%), disputes (30% tickets). This system automates ingestion, calculation, invoicing, and visibility.

## Architecture Overview
Serverless, event-driven:
- **Ingestion**: Customer apps → API Gateway → Lambda → DynamoDB.
- **Billing**: EventBridge triggers → Lambda (pricing + automation) → S3/SES.
- **Dashboard**: React on S3/CloudFront → API Gateway for data.
- Principles: API-first, secure (IAM/Secrets), monitored (CloudWatch/X-Ray).
See simplified Mermaid diagram:
[Insert the Mermaid code from above here]

## Technology Stack
### Backend
- Language: Python 3.9+.
- Frameworks: Serverless Framework, pytest.
- Libraries: boto3, decimal (precision), reportlab (PDFs), python-dateutil.
### AWS Services
- Lambda, API Gateway, DynamoDB, S3, EventBridge, SES, CloudWatch, X-Ray, IAM, Secrets Manager.
### Frontend
- React 18, Recharts, Tailwind CSS, Axios.
- Hosting: S3 + CloudFront.
### Tools
- IDE: VS Code.
- Git/GitHub.
- LocalStack (emulation).
- Postman (API testing).
- Amazon Q (code gen with this plan as context).

## Project Structure
```
squill/
├── README.md
├── serverless.yml  # IaC config
├── requirements.txt
├── handler.py  # Main Lambda entry
├── utils/  # pricing.py, invoice.py, email.py
├── tests/  # test_*.py
├── dashboard/  # React app: src/, public/, package.json
└── docs/  # api.md, architecture.md, plan.md
```
## Detailed 7-Day Execution Plan
Each day has morning/afternoon sessions, deliverables, and proofs. Use Amazon Q for code gen by prompting: "Generate [component] code based on plan.md: [paste full plan.md]. Ensure [specifics]."

### Day 1: Foundation & Ingestion
**Morning (4h):**
- Repo setup, Git init, AWS IAM roles.
- Serverless Framework init, LocalStack setup.
- DynamoDB tables: UsageEvents (PK: customer_id, SK: timestamp), Customers (PK: customer_id).
**Afternoon (4h):**
- API Gateway setup (REST, CORS).
- Lambda for usage ingestion: Validate JSON, store in DynamoDB.
- Basic auth (API Key).
- Test with Postman/LocalStack.
**Deliverables:** Working ingestion API. **Proof:** Postman success response.

### Day 2: Customer Management & Aggregation
**Morning (4h):**
- Customer CRUD Lambdas/APIs (create, read, update, delete).
- Usage aggregation query in Lambda.
**Afternoon (4h):**
- Data validation, error handling.
- Basic pricing rules stub.
- Integration tests with pytest.
**Deliverables:** Customer APIs + usage history. **Proof:** End-to-end CRUD test.

### Day 3: Pricing Engine
**Morning (4h):**
- Tiered pricing Lambda: Support per-unit/tiered (e.g., first 1000 free, $0.01 after).
- Billing period logic.
**Afternoon (4h):**
- Calculation API.
- Monthly aggregation.
- Accuracy tests with decimal.
**Deliverables:** Pricing calculations. **Proof:** Test cases for tiers.

### Day 4: Billing Automation & Invoicing
**Morning (4h):**
- EventBridge scheduler for daily billing.
- Billing Lambda: Query, calculate, generate PDF (reportlab).
- S3 store invoices.
**Afternoon (4h):**
- SES email integration.
- Retry logic.
**Deliverables:** Automated invoicing/email. **Proof:** Simulated cycle.

### Day 5: Customer Dashboard
**Morning (4h):**
- React setup, dashboard skeleton.
- Usage charts (Recharts).
**Afternoon (4h):**
- API integration for data.
- Invoice download.
- Responsive design.
**Deliverables:** Functional dashboard. **Proof:** Local run showing data.

### Day 6: Integration & Testing
**Morning (4h):**
- End-to-end automation (EventBridge → full cycle).
- Error handling.
- Data seeding.
**Afternoon (4h):**
- Comprehensive tests (80% coverage).
- Load testing (synthetic data).
- X-Ray/CloudWatch setup.
**Deliverables:** Integrated system. **Proof:** Full cycle simulation.

### Day 7: Documentation & Deployment
**Morning (4h):**
- API docs (manual Markdown).
- README with setup.
- Architecture docs.
**Afternoon (4h):**
- Security review.
- Full AWS deploy (sls deploy).
- CloudWatch dashboard.
- Final tests.
**Deliverables:** Production-ready. **Proof:** Deployed URL + demo.

## Testing Strategy
- Unit: pytest for Lambdas (e.g., test_pricing.py).
- Integration: API workflows, DB verification.
- Performance: 1000 requests, <200ms response.
- Acceptance: Simulate billing cycle.

## Success Metrics
- Technical: 100% accuracy, 99.9% uptime.
- Coverage: 80% tests.
- Demo: Realistic data, end-to-end flow.

## Setup Instructions
- Install: AWS CLI, Node.js, Python, Serverless (npm i -g serverless), pip install -r requirements.txt.
- Config: aws configure; sls config credentials.
- Local: localstack start; test services.

## Risks & Mitigations
- Learning Curve: Use Amazon Q with this plan context.
- Scope Creep: Stick to MVP; nice-to-haves post-week.
- Bugs: Incremental testing daily.

