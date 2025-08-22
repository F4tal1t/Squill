import pytest
import json
import sys
import os
from unittest.mock import patch, MagicMock

# Add parent directory to path to import handler
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Mock DynamoDB before importing handler
with patch('boto3.resource'):
    from handler import ingest_usage

class TestUsageIngestion:
    
    @patch('handler.usage_table')
    def test_ingest_usage_success(self, mock_table):
        """Test successful usage ingestion"""
        # Mock successful DynamoDB put_item
        mock_table.put_item.return_value = {}
        
        event = {
            'body': json.dumps({
                'customer_id': 'test-customer-123',
                'event_type': 'api_call',
                'quantity': 10,
                'metadata': {'endpoint': '/users', 'method': 'GET'}
            })
        }
        
        response = ingest_usage(event, {})
        
        assert response['statusCode'] == 200
        response_body = json.loads(response['body'])
        assert response_body['message'] == 'Usage recorded successfully'
        assert response_body['customer_id'] == 'test-customer-123'
    
    def test_ingest_usage_missing_field(self):
        """Test ingestion with missing required field"""
        event = {
            'body': json.dumps({
                'customer_id': 'test-customer-123',
                'event_type': 'api_call'
                # Missing 'quantity' field
            })
        }
        
        response = ingest_usage(event, {})
        
        assert response['statusCode'] == 400
        response_body = json.loads(response['body'])
        assert 'Missing required field' in response_body['error']
    
    def test_ingest_usage_invalid_quantity(self):
        """Test ingestion with invalid quantity"""
        event = {
            'body': json.dumps({
                'customer_id': 'test-customer-123',
                'event_type': 'api_call',
                'quantity': -5  # Negative quantity
            })
        }
        
        response = ingest_usage(event, {})
        
        assert response['statusCode'] == 400
        response_body = json.loads(response['body'])
        assert 'Quantity must be positive' in response_body['error']
    
    def test_ingest_usage_invalid_json(self):
        """Test ingestion with invalid JSON"""
        event = {
            'body': 'invalid json string'
        }
        
        response = ingest_usage(event, {})
        
        assert response['statusCode'] == 400
        response_body = json.loads(response['body'])
        assert 'Invalid JSON' in response_body['error']
    
    @patch('handler.usage_table')
    def test_ingest_usage_with_metadata(self, mock_table):
        """Test ingestion with optional metadata"""
        # Mock successful DynamoDB put_item
        mock_table.put_item.return_value = {}
        
        event = {
            'body': json.dumps({
                'customer_id': 'test-customer-456',
                'event_type': 'storage_gb',
                'quantity': 2.5,
                'metadata': {
                    'region': 'us-east-1',
                    'storage_class': 'standard'
                }
            })
        }
        
        response = ingest_usage(event, {})
        
        assert response['statusCode'] == 200
        response_body = json.loads(response['body'])
        assert response_body['customer_id'] == 'test-customer-456'