import json
import boto3
from datetime import datetime
from decimal import Decimal
import os

# Get stage from environment
STAGE = os.environ.get('STAGE', 'prod')

# Stage-specific table names
USAGE_EVENTS_TABLE = f'UsageEvents-{STAGE}'

dynamodb = boto3.resource('dynamodb')

def ingest_usage(event, context):
    """Minimal usage ingestion for Day 7 demo"""
    try:
        body = json.loads(event['body'])
        usage_table = dynamodb.Table(USAGE_EVENTS_TABLE)
        
        usage_event = {
            'customer_id': body.get('customer_id', 'demo-customer'),
            'timestamp': datetime.utcnow().isoformat(),
            'event_type': body.get('event_type', 'api_call'),
            'quantity': Decimal(str(body.get('quantity', 1))),
            'metadata': body.get('metadata', {})
        }
        
        usage_table.put_item(Item=usage_event)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({
                'message': 'Usage recorded successfully',
                'timestamp': usage_event['timestamp']
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'error': str(e)})
        }

def get_analytics(event, context):
    """Minimal analytics for Day 7 demo"""
    try:
        # Demo analytics data for Day 7
        analytics_data = {
            'total_revenue': 127850,
            'total_customers': 6,
            'total_invoices': 5,
            'monthly_revenue': [
                {'month': 'JAN', 'revenue': 85000},
                {'month': 'FEB', 'revenue': 92000},
                {'month': 'MAR', 'revenue': 127850}
            ],
            'usage_breakdown': {
                'api_calls': 45000,
                'storage_gb': 120,
                'bandwidth_gb': 89
            },
            'growth_metrics': {
                'revenue_growth': 18.5,
                'customer_growth': 12.3,
                'usage_growth': 25.7
            },
            'status': 'Day 7 Production Deployment Complete! 🚀'
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(analytics_data, default=str)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'error': str(e)})
        }