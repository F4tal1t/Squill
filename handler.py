import json
import boto3
import os
from datetime import datetime
from decimal import Decimal
from botocore.exceptions import ClientError

# Initialize DynamoDB resource
# Use environment variable or default region
import os
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