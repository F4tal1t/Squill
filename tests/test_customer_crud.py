import pytest
import json
import sys
import os
from unittest.mock import patch, MagicMock

# Add parent directory to path to import handler
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Mock DynamoDB before importing handler
with patch('boto3.resource'):
    from handler import create_customer, get_customer, update_customer, get_customer_usage

class TestCustomerCRUD:
    
    @patch('handler.dynamodb')
    def test_create_customer_success(self, mock_dynamodb):
        """Test successful customer creation"""
        mock_table = MagicMock()
        mock_dynamodb.Table.return_value = mock_table
        mock_table.get_item.return_value = {}  # Customer doesn't exist
        mock_table.put_item.return_value = {}
        
        event = {
            'body': json.dumps({
                'customer_id': 'test-customer-123',
                'name': 'Test Company',
                'email': 'test@company.com',
                'pricing_tier': 'basic'
            })
        }
        
        response = create_customer(event, {})
        
        assert response['statusCode'] == 201
        response_body = json.loads(response['body'])
        assert response_body['customer_id'] == 'test-customer-123'
        assert response_body['name'] == 'Test Company'
        assert response_body['pricing_tier'] == 'basic'
    
    @patch('handler.dynamodb')
    def test_create_customer_missing_field(self, mock_dynamodb):
        """Test customer creation with missing required field"""
        event = {
            'body': json.dumps({
                'customer_id': 'test-customer-123',
                'name': 'Test Company'
                # Missing email
            })
        }
        
        response = create_customer(event, {})
        
        assert response['statusCode'] == 400
        response_body = json.loads(response['body'])
        assert 'Missing required field' in response_body['error']
    
    @patch('handler.dynamodb')
    def test_create_customer_already_exists(self, mock_dynamodb):
        """Test creating customer that already exists"""
        mock_table = MagicMock()
        mock_dynamodb.Table.return_value = mock_table
        mock_table.get_item.return_value = {'Item': {'customer_id': 'test-customer-123'}}
        
        event = {
            'body': json.dumps({
                'customer_id': 'test-customer-123',
                'name': 'Test Company',
                'email': 'test@company.com'
            })
        }
        
        response = create_customer(event, {})
        
        assert response['statusCode'] == 409
        response_body = json.loads(response['body'])
        assert 'Customer already exists' in response_body['error']
    
    @patch('handler.dynamodb')
    def test_get_customer_success(self, mock_dynamodb):
        """Test successful customer retrieval"""
        mock_table = MagicMock()
        mock_dynamodb.Table.return_value = mock_table
        mock_table.get_item.return_value = {
            'Item': {
                'customer_id': 'test-customer-123',
                'name': 'Test Company',
                'email': 'test@company.com',
                'pricing_tier': 'basic'
            }
        }
        
        event = {
            'pathParameters': {'customer_id': 'test-customer-123'}
        }
        
        response = get_customer(event, {})
        
        assert response['statusCode'] == 200
        response_body = json.loads(response['body'])
        assert response_body['customer_id'] == 'test-customer-123'
    
    @patch('handler.dynamodb')
    def test_get_customer_not_found(self, mock_dynamodb):
        """Test getting non-existent customer"""
        mock_table = MagicMock()
        mock_dynamodb.Table.return_value = mock_table
        mock_table.get_item.return_value = {}  # No Item key
        
        event = {
            'pathParameters': {'customer_id': 'non-existent'}
        }
        
        response = get_customer(event, {})
        
        assert response['statusCode'] == 404
        response_body = json.loads(response['body'])
        assert 'Customer not found' in response_body['error']
    
    @patch('handler.dynamodb')
    def test_update_customer_success(self, mock_dynamodb):
        """Test successful customer update"""
        mock_table = MagicMock()
        mock_dynamodb.Table.return_value = mock_table
        mock_table.update_item.return_value = {}
        
        event = {
            'pathParameters': {'customer_id': 'test-customer-123'},
            'body': json.dumps({
                'name': 'Updated Company Name',
                'pricing_tier': 'premium'
            })
        }
        
        response = update_customer(event, {})
        
        assert response['statusCode'] == 200
        response_body = json.loads(response['body'])
        assert 'Customer updated successfully' in response_body['message']
    
    @patch('handler.usage_table')
    def test_get_customer_usage_success(self, mock_usage_table):
        """Test successful usage aggregation"""
        mock_usage_table.query.return_value = {
            'Items': [
                {
                    'customer_id': 'test-customer-123',
                    'timestamp': '2024-01-15T10:30:00.000000',
                    'event_type': 'api_call',
                    'quantity': 100
                },
                {
                    'customer_id': 'test-customer-123',
                    'timestamp': '2024-01-15T11:30:00.000000',
                    'event_type': 'api_call',
                    'quantity': 50
                },
                {
                    'customer_id': 'test-customer-123',
                    'timestamp': '2024-01-15T12:30:00.000000',
                    'event_type': 'storage_gb',
                    'quantity': 2.5
                }
            ]
        }
        
        event = {
            'pathParameters': {'customer_id': 'test-customer-123'},
            'queryStringParameters': {
                'start_date': '2024-01-15T00:00:00.000000',
                'end_date': '2024-01-15T23:59:59.000000'
            }
        }
        
        response = get_customer_usage(event, {})
        
        assert response['statusCode'] == 200
        response_body = json.loads(response['body'])
        assert response_body['customer_id'] == 'test-customer-123'
        assert 'usage_summary' in response_body
        assert 'daily_breakdown' in response_body
        assert response_body['usage_summary']['api_call']['total_quantity'] == 150
        assert response_body['usage_summary']['storage_gb']['total_quantity'] == 2.5
        assert response_body['total_events'] == 3
    
    @patch('handler.usage_table')
    def test_get_customer_usage_no_params(self, mock_usage_table):
        """Test usage aggregation without query parameters"""
        mock_usage_table.query.return_value = {'Items': []}
        
        event = {
            'pathParameters': {'customer_id': 'test-customer-123'},
            'queryStringParameters': None
        }
        
        response = get_customer_usage(event, {})
        
        assert response['statusCode'] == 200
        response_body = json.loads(response['body'])
        assert response_body['total_events'] == 0