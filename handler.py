import json
import boto3
import os
from datetime import datetime
from decimal import Decimal
from botocore.exceptions import ClientError

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv not available, use system environment variables

# Initialize DynamoDB resource
region = os.environ.get('AWS_DEFAULT_REGION', 'us-east-1')
dynamodb = boto3.resource('dynamodb', region_name=region)
usage_table = dynamodb.Table('UsageEvents')


def ingest_usage(event, context):
    """
    Lambda function to ingest usage events
    Expects JSON body with: customer_id, event_type, quantity, metadata (optional)
    """
    try:
        # Parse request body
        body = json.loads(event['body'])
        
        # Validate required fields
        required_fields = ['customer_id', 'event_type', 'quantity']
        for field in required_fields:
            if field not in body:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    'body': json.dumps({
                        'error': f'Missing required field: {field}',
                        'required_fields': required_fields
                    })
                }
        
        # Validate data types
        try:
            quantity = Decimal(str(body['quantity']))
            if quantity <= 0:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    'body': json.dumps({'error': 'Quantity must be positive'})
                }
        except (ValueError, TypeError):
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Quantity must be a valid number'})
            }
        
        # Create usage event record
        usage_event = {
            'customer_id': body['customer_id'],
            'timestamp': datetime.utcnow().isoformat(),
            'event_type': body['event_type'],
            'quantity': quantity,
            'metadata': body.get('metadata', {})
        }
        
        # Store in DynamoDB
        usage_table.put_item(Item=usage_event)
        
        # Return success response
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Usage recorded successfully',
                'timestamp': usage_event['timestamp'],
                'customer_id': usage_event['customer_id']
            })
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Invalid JSON in request body'})
        }
        
    except ClientError as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'error': 'Database error',
                'details': str(e)
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'details': str(e)
            })
        }


def create_customer(event, context):
    """Create a new customer"""
    try:
        body = json.loads(event['body'])
        customers_table = dynamodb.Table('Customers')
        
        # Validate required fields
        required_fields = ['customer_id', 'name', 'email']
        for field in required_fields:
            if field not in body:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': f'Missing required field: {field}'})
                }
        
        # Check if customer already exists
        try:
            existing = customers_table.get_item(Key={'customer_id': body['customer_id']})
            if 'Item' in existing:
                return {
                    'statusCode': 409,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Customer already exists'})
                }
        except Exception:
            pass
        
        # Create customer record
        customer_data = {
            'customer_id': body['customer_id'],
            'name': body['name'],
            'email': body['email'],
            'pricing_tier': body.get('pricing_tier', 'basic'),
            'created_at': datetime.utcnow().isoformat()
        }
        
        customers_table.put_item(Item=customer_data)
        
        return {
            'statusCode': 201,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(customer_data, default=str)
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid JSON'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }


def get_customer(event, context):
    """Get customer by ID"""
    try:
        customer_id = event['pathParameters']['customer_id']
        customers_table = dynamodb.Table('Customers')
        
        response = customers_table.get_item(Key={'customer_id': customer_id})
        
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Customer not found'})
            }
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(response['Item'], default=str)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }


def update_customer(event, context):
    """Update customer information"""
    try:
        customer_id = event['pathParameters']['customer_id']
        body = json.loads(event['body'])
        customers_table = dynamodb.Table('Customers')
        
        # Build update expression with attribute names for reserved keywords
        update_expression = "SET "
        expression_values = {}
        expression_names = {}
        
        for key, value in body.items():
            if key != 'customer_id':  # Don't update the primary key
                if key in ['name', 'email']:  # Reserved keywords
                    attr_name = f"#{key}"
                    expression_names[attr_name] = key
                    update_expression += f"{attr_name} = :{key}, "
                else:
                    update_expression += f"{key} = :{key}, "
                expression_values[f":{key}"] = value
        
        update_expression = update_expression.rstrip(', ')
        
        update_params = {
            'Key': {'customer_id': customer_id},
            'UpdateExpression': update_expression,
            'ExpressionAttributeValues': expression_values
        }
        
        if expression_names:
            update_params['ExpressionAttributeNames'] = expression_names
        
        customers_table.update_item(**update_params)
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Customer updated successfully'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }


def get_customer_usage(event, context):
    """Get usage aggregation for a customer"""
    try:
        from boto3.dynamodb.conditions import Key
        
        customer_id = event['pathParameters']['customer_id']
        query_params = event.get('queryStringParameters') or {}
        start_date = query_params.get('start_date')
        end_date = query_params.get('end_date')
        
        # Build query
        key_condition = Key('customer_id').eq(customer_id)
        if start_date and end_date:
            key_condition = key_condition & Key('timestamp').between(start_date, end_date)
        
        response = usage_table.query(KeyConditionExpression=key_condition)
        
        # Aggregate usage by event type
        usage_summary = {}
        daily_breakdown = {}
        
        for item in response['Items']:
            event_type = item['event_type']
            quantity = float(item['quantity'])
            timestamp = item['timestamp']
            date_key = timestamp[:10]  # Extract YYYY-MM-DD
            
            # Total aggregation
            if event_type not in usage_summary:
                usage_summary[event_type] = {'total_quantity': 0, 'event_count': 0}
            
            usage_summary[event_type]['total_quantity'] += quantity
            usage_summary[event_type]['event_count'] += 1
            
            # Daily breakdown
            if date_key not in daily_breakdown:
                daily_breakdown[date_key] = {}
            
            if event_type not in daily_breakdown[date_key]:
                daily_breakdown[date_key][event_type] = 0
            
            daily_breakdown[date_key][event_type] += quantity
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'customer_id': customer_id,
                'period': {'start': start_date, 'end': end_date},
                'usage_summary': usage_summary,
                'daily_breakdown': daily_breakdown,
                'total_events': len(response['Items'])
            }, default=str)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }