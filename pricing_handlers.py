import json
import boto3
import os
from datetime import datetime
from utils.pricing import (
    calculate_squill_billing, 
    calculate_client_billing, 
    validate_subscription_limits,
    get_pricing_tier_info,
    SUBSCRIPTION_TIERS
)

# Initialize DynamoDB resource
region = os.environ.get('AWS_DEFAULT_REGION', 'us-east-1')
dynamodb = boto3.resource('dynamodb', region_name=region)
subscriptions_table = dynamodb.Table('Subscriptions')
pricing_rules_table = dynamodb.Table('PricingRules')


def create_subscription(event, context):
    """Create a new client subscription"""
    try:
        body = json.loads(event['body'])
        
        required_fields = ['client_id', 'company_name', 'email', 'subscription_tier']
        for field in required_fields:
            if field not in body:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': f'Missing required field: {field}'})
                }
        
        if body['subscription_tier'] not in SUBSCRIPTION_TIERS:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'error': 'Invalid subscription tier',
                    'valid_tiers': list(SUBSCRIPTION_TIERS.keys())
                })
            }
        
        subscription_data = {
            'client_id': body['client_id'],
            'company_name': body['company_name'],
            'email': body['email'],
            'subscription_tier': body['subscription_tier'],
            'status': 'active',
            'created_at': datetime.utcnow().isoformat(),
            'current_usage': {
                'customers': 0,
                'api_calls': 0,
                'storage_gb': 0
            }
        }
        
        subscriptions_table.put_item(Item=subscription_data)
        
        return {
            'statusCode': 201,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(subscription_data, default=str)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }


def get_subscription(event, context):
    """Get subscription details"""
    try:
        client_id = event['pathParameters']['client_id']
        
        response = subscriptions_table.get_item(Key={'client_id': client_id})
        
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Subscription not found'})
            }
        
        subscription = response['Item']
        tier_info = get_pricing_tier_info(subscription['subscription_tier'])
        subscription['tier_details'] = tier_info
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(subscription, default=str)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }


def calculate_pricing(event, context):
    """Calculate pricing for given usage"""
    try:
        body = json.loads(event['body'])
        
        if 'client_id' not in body or 'usage_data' not in body:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing client_id or usage_data'})
            }
        
        client_id = body['client_id']
        usage_data = body['usage_data']
        
        subscription_response = subscriptions_table.get_item(Key={'client_id': client_id})
        if 'Item' not in subscription_response:
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Subscription not found'})
            }
        
        subscription = subscription_response['Item']
        subscription_tier = subscription['subscription_tier']
        
        squill_billing = calculate_squill_billing(subscription_tier, usage_data)
        
        pricing_rules = None
        try:
            rules_response = pricing_rules_table.get_item(Key={'client_id': client_id})
            if 'Item' in rules_response:
                pricing_rules = rules_response['Item']['rules']
        except Exception:
            pass
        
        client_usage_events = body.get('client_usage_events', {})
        client_billing = calculate_client_billing(pricing_rules, client_usage_events)
        
        within_limits, violations = validate_subscription_limits(subscription_tier, usage_data)
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'client_id': client_id,
                'subscription_tier': subscription_tier,
                'squill_billing': squill_billing,
                'client_billing': client_billing,
                'within_limits': within_limits,
                'limit_violations': violations if not within_limits else []
            }, default=str)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }


def update_pricing_rules(event, context):
    """Update pricing rules for a client"""
    try:
        client_id = event['pathParameters']['client_id']
        body = json.loads(event['body'])
        
        if 'pricing_rules' not in body:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing pricing_rules'})
            }
        
        subscription_response = subscriptions_table.get_item(Key={'client_id': client_id})
        if 'Item' not in subscription_response:
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Client subscription not found'})
            }
        
        pricing_data = {
            'client_id': client_id,
            'rules': body['pricing_rules'],
            'updated_at': datetime.utcnow().isoformat()
        }
        
        pricing_rules_table.put_item(Item=pricing_data)
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Pricing rules updated successfully'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }