import pytest
import json
from unittest.mock import patch, MagicMock
from pricing_handlers import create_subscription, get_subscription, calculate_pricing, update_pricing_rules

class TestPricingHandlers:
    
    @patch('pricing_handlers.subscriptions_table')
    def test_create_subscription_success(self, mock_table):
        """Test successful subscription creation"""
        mock_table.put_item.return_value = None
        
        event = {
            'body': json.dumps({
                'client_id': 'client-123',
                'company_name': 'Test Company',
                'email': 'test@company.com',
                'subscription_tier': 'basic'
            })
        }
        
        response = create_subscription(event, {})
        
        assert response['statusCode'] == 201
        body = json.loads(response['body'])
        assert body['client_id'] == 'client-123'
        assert body['subscription_tier'] == 'basic'
        assert body['status'] == 'active'
        mock_table.put_item.assert_called_once()
    
    def test_create_subscription_missing_fields(self):
        """Test subscription creation with missing fields"""
        event = {
            'body': json.dumps({
                'client_id': 'client-123',
                'company_name': 'Test Company'
                # Missing email and subscription_tier
            })
        }
        
        response = create_subscription(event, {})
        
        assert response['statusCode'] == 400
        body = json.loads(response['body'])
        assert 'Missing required field' in body['error']
    
    def test_create_subscription_invalid_tier(self):
        """Test subscription creation with invalid tier"""
        event = {
            'body': json.dumps({
                'client_id': 'client-123',
                'company_name': 'Test Company',
                'email': 'test@company.com',
                'subscription_tier': 'invalid_tier'
            })
        }
        
        response = create_subscription(event, {})
        
        assert response['statusCode'] == 400
        body = json.loads(response['body'])
        assert 'Invalid subscription tier' in body['error']
        assert 'valid_tiers' in body
    
    @patch('pricing_handlers.subscriptions_table')
    def test_get_subscription_success(self, mock_table):
        """Test successful subscription retrieval"""
        mock_subscription = {
            'client_id': 'client-123',
            'company_name': 'Test Company',
            'subscription_tier': 'basic',
            'status': 'active'
        }
        
        mock_table.get_item.return_value = {'Item': mock_subscription}
        
        event = {
            'pathParameters': {'client_id': 'client-123'}
        }
        
        response = get_subscription(event, {})
        
        assert response['statusCode'] == 200
        body = json.loads(response['body'])
        assert body['client_id'] == 'client-123'
        assert 'tier_details' in body
    
    @patch('pricing_handlers.subscriptions_table')
    def test_get_subscription_not_found(self, mock_table):
        """Test subscription not found"""
        mock_table.get_item.return_value = {}
        
        event = {
            'pathParameters': {'client_id': 'non-existent'}
        }
        
        response = get_subscription(event, {})
        
        assert response['statusCode'] == 404
        body = json.loads(response['body'])
        assert 'Subscription not found' in body['error']
    
    @patch('pricing_handlers.pricing_rules_table')
    @patch('pricing_handlers.subscriptions_table')
    def test_calculate_pricing_success(self, mock_subscriptions, mock_rules):
        """Test successful pricing calculation"""
        mock_subscription = {
            'client_id': 'client-123',
            'subscription_tier': 'basic'
        }
        mock_subscriptions.get_item.return_value = {'Item': mock_subscription}
        mock_rules.get_item.return_value = {}  # No custom rules
        
        event = {
            'body': json.dumps({
                'client_id': 'client-123',
                'usage_data': {
                    'customers': 500,
                    'api_calls': 5000,
                    'storage_gb': 5
                },
                'client_usage_events': {
                    'api_call': [100, 50]
                }
            })
        }
        
        response = calculate_pricing(event, {})
        
        assert response['statusCode'] == 200
        body = json.loads(response['body'])
        assert body['client_id'] == 'client-123'
        assert body['subscription_tier'] == 'basic'
        assert 'squill_billing' in body
        assert 'client_billing' in body
        assert 'within_limits' in body
    
    @patch('pricing_handlers.subscriptions_table')
    def test_calculate_pricing_subscription_not_found(self, mock_table):
        """Test pricing calculation with non-existent subscription"""
        mock_table.get_item.return_value = {}
        
        event = {
            'body': json.dumps({
                'client_id': 'non-existent',
                'usage_data': {'customers': 100}
            })
        }
        
        response = calculate_pricing(event, {})
        
        assert response['statusCode'] == 404
        body = json.loads(response['body'])
        assert 'Subscription not found' in body['error']
    
    def test_calculate_pricing_missing_data(self):
        """Test pricing calculation with missing data"""
        event = {
            'body': json.dumps({
                'client_id': 'client-123'
                # Missing usage_data
            })
        }
        
        response = calculate_pricing(event, {})
        
        assert response['statusCode'] == 400
        body = json.loads(response['body'])
        assert 'Missing client_id or usage_data' in body['error']
    
    @patch('pricing_handlers.pricing_rules_table')
    @patch('pricing_handlers.subscriptions_table')
    def test_update_pricing_rules_success(self, mock_subscriptions, mock_rules):
        """Test successful pricing rules update"""
        mock_subscription = {'client_id': 'client-123'}
        mock_subscriptions.get_item.return_value = {'Item': mock_subscription}
        mock_rules.put_item.return_value = None
        
        event = {
            'pathParameters': {'client_id': 'client-123'},
            'body': json.dumps({
                'pricing_rules': {
                    'api_call': {'rate': 0.02, 'free_tier': 200}
                }
            })
        }
        
        response = update_pricing_rules(event, {})
        
        assert response['statusCode'] == 200
        body = json.loads(response['body'])
        assert 'successfully' in body['message']
        mock_rules.put_item.assert_called_once()
    
    @patch('pricing_handlers.subscriptions_table')
    def test_update_pricing_rules_client_not_found(self, mock_table):
        """Test pricing rules update with non-existent client"""
        mock_table.get_item.return_value = {}
        
        event = {
            'pathParameters': {'client_id': 'non-existent'},
            'body': json.dumps({
                'pricing_rules': {'api_call': {'rate': 0.02}}
            })
        }
        
        response = update_pricing_rules(event, {})
        
        assert response['statusCode'] == 404
        body = json.loads(response['body'])
        assert 'Client subscription not found' in body['error']
    
    def test_update_pricing_rules_missing_rules(self):
        """Test pricing rules update with missing rules"""
        event = {
            'pathParameters': {'client_id': 'client-123'},
            'body': json.dumps({})  # Missing pricing_rules
        }
        
        response = update_pricing_rules(event, {})
        
        assert response['statusCode'] == 400
        body = json.loads(response['body'])
        assert 'Missing pricing_rules' in body['error']

if __name__ == '__main__':
    pytest.main([__file__, '-v'])