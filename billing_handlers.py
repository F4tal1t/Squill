import json
import boto3
import os
from datetime import datetime, timedelta
from decimal import Decimal
from utils.pricing import calculate_squill_billing, calculate_client_billing

# Initialize DynamoDB
region = os.environ.get('AWS_DEFAULT_REGION', 'us-east-1')
dynamodb = boto3.resource('dynamodb', region_name=region)
invoices_table = dynamodb.Table('Invoices')
customers_table = dynamodb.Table('Customers')
usage_table = dynamodb.Table('UsageEvents')
subscriptions_table = dynamodb.Table('Subscriptions')

def generate_invoice(event, context):
    """Generate invoice for a customer"""
    try:
        body = json.loads(event['body'])
        customer_id = body['customer_id']
        billing_period = body.get('billing_period', 'current_month')
        
        # Get customer
        customer_response = customers_table.get_item(Key={'customer_id': customer_id})
        if 'Item' not in customer_response:
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Customer not found'})
            }
        
        customer = customer_response['Item']
        
        # Calculate billing period dates
        now = datetime.utcnow()
        if billing_period == 'current_month':
            start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            if now.month == 12:
                end_date = now.replace(year=now.year+1, month=1, day=1) - timedelta(days=1)
            else:
                end_date = now.replace(month=now.month+1, day=1) - timedelta(days=1)
        else:  # previous_month
            if now.month == 1:
                start_date = now.replace(year=now.year-1, month=12, day=1)
                end_date = now.replace(day=1) - timedelta(days=1)
            else:
                start_date = now.replace(month=now.month-1, day=1)
                end_date = now.replace(day=1) - timedelta(days=1)
        
        # Get usage data for period
        from boto3.dynamodb.conditions import Key
        usage_response = usage_table.query(
            KeyConditionExpression=Key('customer_id').eq(customer_id) & 
            Key('timestamp').between(start_date.isoformat(), end_date.isoformat())
        )
        
        # Aggregate usage
        usage_summary = {}
        total_events = 0
        for item in usage_response['Items']:
            event_type = item['event_type']
            quantity = float(item['quantity'])
            total_events += 1
            
            if event_type not in usage_summary:
                usage_summary[event_type] = 0
            usage_summary[event_type] += quantity
        
        # Calculate billing using existing pricing engine
        pricing_rules = {
            'api_call': {'rate': Decimal('0.01'), 'free_tier': 100},
            'storage_gb': {'rate': Decimal('5.00'), 'free_tier': 1},
            'transaction': {'rate': Decimal('0.30'), 'free_tier': 10}
        }
        
        usage_events = {k: [v] for k, v in usage_summary.items()}
        billing_result = calculate_client_billing(pricing_rules, usage_events)
        
        # Generate invoice
        invoice_number = f"INV-{start_date.strftime('%Y%m')}-{customer_id}"
        due_date = (end_date + timedelta(days=30)).isoformat()
        
        invoice_data = {
            'invoice_id': invoice_number,
            'customer_id': customer_id,
            'customer_name': customer['name'],
            'customer_email': customer['email'],
            'billing_period_start': start_date.isoformat(),
            'billing_period_end': end_date.isoformat(),
            'due_date': due_date,
            'usage_summary': usage_summary,
            'billing_details': billing_result['billing_details'],
            'total_amount': float(billing_result['total_cost']),
            'status': 'generated',
            'created_at': datetime.utcnow().isoformat(),
            'total_events': total_events
        }
        
        # Store invoice
        invoices_table.put_item(Item=invoice_data)
        
        return {
            'statusCode': 201,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(invoice_data, default=str)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def get_invoices(event, context):
    """Get invoices for a customer"""
    try:
        customer_id = event['pathParameters']['customer_id']
        
        # Scan for invoices (in production, use GSI)
        response = invoices_table.scan(
            FilterExpression='customer_id = :customer_id',
            ExpressionAttributeValues={':customer_id': customer_id}
        )
        
        invoices = response['Items']
        invoices.sort(key=lambda x: x['created_at'], reverse=True)
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'customer_id': customer_id,
                'invoices': invoices,
                'total_invoices': len(invoices)
            }, default=str)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def get_analytics(event, context):
    """Get billing analytics"""
    try:
        # Get all invoices for analytics
        invoices_response = invoices_table.scan()
        invoices = invoices_response['Items']
        
        # Get all customers
        customers_response = customers_table.scan()
        customers = customers_response['Items']
        
        # Get recent usage events
        usage_response = usage_table.scan(Limit=100)
        recent_usage = usage_response['Items']
        recent_usage.sort(key=lambda x: x['timestamp'], reverse=True)
        
        # Calculate metrics
        total_revenue = sum(float(inv.get('total_amount', 0)) for inv in invoices)
        total_customers = len(customers)
        total_invoices = len(invoices)
        
        # Monthly revenue trend (last 6 months)
        monthly_revenue = {}
        for invoice in invoices:
            created_at = invoice['created_at'][:7]  # YYYY-MM
            if created_at not in monthly_revenue:
                monthly_revenue[created_at] = 0
            monthly_revenue[created_at] += float(invoice.get('total_amount', 0))
        
        # Usage by event type
        usage_by_type = {}
        for event in recent_usage:
            event_type = event['event_type']
            quantity = float(event['quantity'])
            if event_type not in usage_by_type:
                usage_by_type[event_type] = 0
            usage_by_type[event_type] += quantity
        
        # Recent activities
        recent_activities = []
        for i, event in enumerate(recent_usage[:10]):
            recent_activities.append({
                'id': i,
                'type': 'usage_event',
                'description': f"{event['event_type']} - {event['quantity']} units",
                'customer_id': event['customer_id'],
                'timestamp': event['timestamp'],
                'time_ago': get_time_ago(event['timestamp'])
            })
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'metrics': {
                    'total_revenue': total_revenue,
                    'total_customers': total_customers,
                    'total_invoices': total_invoices,
                    'avg_invoice_amount': total_revenue / max(total_invoices, 1)
                },
                'monthly_revenue': monthly_revenue,
                'usage_by_type': usage_by_type,
                'recent_activities': recent_activities,
                'customers': customers[:20],  # Latest 20 customers
                'invoices': invoices[:10]     # Latest 10 invoices
            }, default=str)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def get_time_ago(timestamp_str):
    """Calculate time ago from timestamp"""
    try:
        timestamp = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
        now = datetime.utcnow().replace(tzinfo=timestamp.tzinfo)
        diff = now - timestamp
        
        if diff.days > 0:
            return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours > 1 else ''} ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
        else:
            return "Just now"
    except:
        return "Unknown"