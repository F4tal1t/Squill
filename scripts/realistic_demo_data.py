import boto3
import json
from datetime import datetime, timedelta
from decimal import Decimal
import random

class SquillDemoDataGenerator:
    """Generate realistic demo data for Squill SaaS billing platform"""
    
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb')
        self.customers_table = self.dynamodb.Table('Customers')
        self.usage_table = self.dynamodb.Table('UsageEvents')
    
    def create_saas_client_companies(self):
        """Create realistic SaaS client companies using Squill"""
        companies = [
            {
                'customer_id': 'taskflow-saas',
                'name': 'TaskFlow SaaS',
                'email': 'billing@taskflow.io',
                'pricing_tier': 'pro',
                'industry': 'Project Management',
                'monthly_customers': 2500,
                'created_at': (datetime.utcnow() - timedelta(days=180)).isoformat()
            },
            {
                'customer_id': 'cloudstore-platform',
                'name': 'CloudStore Platform',
                'email': 'finance@cloudstore.com',
                'pricing_tier': 'enterprise',
                'industry': 'E-commerce',
                'monthly_customers': 15000,
                'created_at': (datetime.utcnow() - timedelta(days=365)).isoformat()
            },
            {
                'customer_id': 'fintech-startup',
                'name': 'PayEasy FinTech',
                'email': 'accounts@payeasy.co',
                'pricing_tier': 'basic',
                'industry': 'Financial Services',
                'monthly_customers': 800,
                'created_at': (datetime.utcnow() - timedelta(days=90)).isoformat()
            },
            {
                'customer_id': 'healthtech-app',
                'name': 'MediConnect Health',
                'email': 'billing@mediconnect.health',
                'pricing_tier': 'pro',
                'industry': 'Healthcare',
                'monthly_customers': 5000,
                'created_at': (datetime.utcnow() - timedelta(days=240)).isoformat()
            }
        ]
        
        for company in companies:
            self.customers_table.put_item(Item=company)
            print(f"Created SaaS client: {company['name']} ({company['pricing_tier']} tier)")
        
        return companies
    
    def generate_realistic_usage_patterns(self, companies, days_back=90):
        """Generate realistic usage patterns for SaaS companies"""
        
        # Define realistic usage patterns by industry
        usage_patterns = {
            'Project Management': {
                'api_calls_per_customer': 150,  # Task updates, notifications
                'storage_per_customer': 0.05,   # Documents, files
                'peak_hours': [9, 10, 14, 15, 16]  # Business hours
            },
            'E-commerce': {
                'api_calls_per_customer': 300,  # Orders, inventory, payments
                'storage_per_customer': 0.2,    # Product images, logs
                'peak_hours': [12, 13, 19, 20, 21]  # Lunch & evening shopping
            },
            'Financial Services': {
                'api_calls_per_customer': 80,   # Transactions, balance checks
                'storage_per_customer': 0.01,   # Transaction logs
                'peak_hours': [8, 9, 17, 18]    # Morning & evening banking
            },
            'Healthcare': {
                'api_calls_per_customer': 200,  # Appointments, records
                'storage_per_customer': 0.15,   # Medical records, images
                'peak_hours': [8, 9, 10, 14, 15, 16]  # Clinic hours
            }
        }
        
        base_date = datetime.utcnow() - timedelta(days=days_back)
        
        for company in companies:
            pattern = usage_patterns[company['industry']]
            customer_count = company['monthly_customers']
            
            print(f"Generating usage for {company['name']} ({customer_count:,} customers)")
            
            for day in range(days_back):
                current_date = base_date + timedelta(days=day)
                
                # Weekend reduction (20% less usage)
                weekend_factor = 0.2 if current_date.weekday() >= 5 else 1.0
                
                # Growth trend (companies grow over time)
                growth_factor = 1 + (day / days_back) * 0.4
                
                # Daily API calls based on customer count and pattern
                base_api_calls = customer_count * pattern['api_calls_per_customer']
                daily_api_calls = int(base_api_calls * growth_factor * weekend_factor * random.uniform(0.8, 1.2))
                
                # Storage usage (more stable)
                daily_storage = customer_count * pattern['storage_per_customer'] * growth_factor * random.uniform(0.95, 1.05)
                
                # Distribute API calls throughout the day with peak hours
                events_per_day = random.randint(8, 24)
                
                for event in range(events_per_day):
                    # Peak hour weighting
                    hour = random.choices(
                        range(24),
                        weights=[3 if h in pattern['peak_hours'] else 1 for h in range(24)]
                    )[0]
                    
                    event_time = current_date.replace(
                        hour=hour,
                        minute=random.randint(0, 59),
                        second=random.randint(0, 59)
                    )
                    
                    # API call event with realistic metadata
                    api_calls_this_event = daily_api_calls // events_per_day + random.randint(-50, 50)
                    
                    self.usage_table.put_item(Item={
                        'customer_id': company['customer_id'],
                        'timestamp': event_time.isoformat(),
                        'event_type': 'api_call',
                        'quantity': Decimal(str(max(1, api_calls_this_event))),
                        'metadata': {
                            'endpoint_category': random.choice(['auth', 'data', 'analytics', 'notifications']),
                            'region': random.choice(['us-east-1', 'eu-west-1', 'ap-southeast-1']),
                            'client_version': random.choice(['v1.2.3', 'v1.2.4', 'v1.3.0'])
                        }
                    })
                
                # Daily storage snapshot
                self.usage_table.put_item(Item={
                    'customer_id': company['customer_id'],
                    'timestamp': current_date.replace(hour=23, minute=59).isoformat(),
                    'event_type': 'storage_gb',
                    'quantity': Decimal(str(round(daily_storage, 3))),
                    'metadata': {
                        'measurement_type': 'daily_snapshot',
                        'data_types': ['user_data', 'system_logs', 'backups']
                    }
                })
        
        print(f"Generated {days_back} days of realistic SaaS usage data")
    
    def create_sample_invoices(self, companies):
        """Create sample invoice data for demonstration"""
        invoices = []
        
        for company in companies:
            # Generate last 3 months of invoices
            for month_offset in range(3):
                invoice_date = datetime.utcnow() - timedelta(days=30 * month_offset)
                
                # Calculate realistic billing amounts based on tier
                tier_multipliers = {'basic': 1, 'pro': 3.5, 'enterprise': 12}
                base_amount = 99 * tier_multipliers[company['pricing_tier']]
                
                # Add usage overages
                overage_amount = random.uniform(50, 500) if month_offset == 0 else random.uniform(20, 200)
                total_amount = base_amount + overage_amount
                
                invoice = {
                    'invoice_id': f"INV-{company['customer_id']}-{invoice_date.strftime('%Y%m')}",
                    'customer_id': company['customer_id'],
                    'period': invoice_date.strftime('%Y-%m'),
                    'amount': round(total_amount, 2),
                    'status': 'paid' if month_offset > 0 else 'current',
                    'generated_at': invoice_date.isoformat()
                }
                invoices.append(invoice)
        
        return invoices
    
    def run_full_demo_setup(self):
        """Run complete realistic demo data setup"""
        print("Setting up Squill SaaS Demo Environment...")
        print("=" * 50)
        
        # Create SaaS client companies
        companies = self.create_saas_client_companies()
        
        # Generate realistic usage patterns
        self.generate_realistic_usage_patterns(companies, days_back=90)
        
        # Create sample invoices
        invoices = self.create_sample_invoices(companies)
        
        print("\n📋 Demo Environment Summary:")
        print(f"• {len(companies)} SaaS client companies created")
        print(f"• 90 days of realistic usage data generated")
        print(f"• {len(invoices)} sample invoices created")
        print("\n🎯 Companies by tier:")
        
        for tier in ['basic', 'pro', 'enterprise']:
            tier_companies = [c for c in companies if c['pricing_tier'] == tier]
            print(f"  • {tier.title()}: {len(tier_companies)} companies")
        
        print("\n✅ Squill demo environment ready!")
        return companies, invoices

if __name__ == "__main__":
    generator = SquillDemoDataGenerator()
    generator.run_full_demo_setup()