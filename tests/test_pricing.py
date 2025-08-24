import pytest
from decimal import Decimal
from utils.pricing import (
    calculate_squill_billing,
    calculate_client_billing,
    validate_subscription_limits,
    get_pricing_tier_info,
    SUBSCRIPTION_TIERS
)

class TestPricingEngine:
    
    def test_basic_tier_within_limits(self):
        """Test basic tier billing within limits"""
        usage_data = {
            'customers': 500,
            'api_calls': 5000,
            'storage_gb': 5
        }
        
        result = calculate_squill_billing('basic', usage_data)
        
        assert result['subscription_tier'] == 'basic'
        assert result['monthly_fee'] == Decimal('99.00')
        assert result['total_cost'] == Decimal('99.00')
        assert len(result['overages']) == 0
    
    def test_basic_tier_with_overages(self):
        """Test basic tier billing with overages"""
        usage_data = {
            'customers': 1500,  # 500 over limit
            'api_calls': 15000,  # 5000 over limit
            'storage_gb': 15     # 5 over limit
        }
        
        result = calculate_squill_billing('basic', usage_data)
        
        assert result['subscription_tier'] == 'basic'
        assert result['monthly_fee'] == Decimal('99.00')
        
        # Check overages
        assert 'customers' in result['overages']
        assert result['overages']['customers']['overage'] == 500
        assert result['overages']['customers']['cost'] == Decimal('50.00')  # 500 * 0.10
        
        assert 'api_calls' in result['overages']
        assert result['overages']['api_calls']['overage'] == 5000
        assert result['overages']['api_calls']['cost'] == Decimal('5.00')  # 5000 * 0.001
        
        assert 'storage_gb' in result['overages']
        assert result['overages']['storage_gb']['overage'] == 5
        assert result['overages']['storage_gb']['cost'] == Decimal('5.00')  # 5 * 1.00
        
        expected_total = Decimal('99.00') + Decimal('50.00') + Decimal('5.00') + Decimal('5.00')
        assert result['total_cost'] == expected_total
    
    def test_enterprise_tier_no_overages(self):
        """Test enterprise tier has no overages"""
        usage_data = {
            'customers': 100000,
            'api_calls': 1000000,
            'storage_gb': 1000
        }
        
        result = calculate_squill_billing('enterprise', usage_data)
        
        assert result['subscription_tier'] == 'enterprise'
        assert result['monthly_fee'] == Decimal('999.00')
        assert result['total_cost'] == Decimal('999.00')
        assert len(result['overages']) == 0
    
    def test_client_billing_calculation(self):
        """Test client billing calculation"""
        pricing_rules = {
            'api_call': {'rate': Decimal('0.01'), 'free_tier': 100},
            'storage_gb': {'rate': Decimal('5.00'), 'free_tier': 1}
        }
        
        usage_events = {
            'api_call': [50, 75, 100],  # Total: 225
            'storage_gb': [2, 3]        # Total: 5
        }
        
        result = calculate_client_billing(pricing_rules, usage_events)
        
        # API calls: 225 total, 100 free, 125 billable * $0.01 = $1.25
        assert result['billing_details']['api_call']['total_quantity'] == 225
        assert result['billing_details']['api_call']['billable_quantity'] == 125
        assert result['billing_details']['api_call']['cost'] == Decimal('1.25')
        
        # Storage: 5 total, 1 free, 4 billable * $5.00 = $20.00
        assert result['billing_details']['storage_gb']['total_quantity'] == 5
        assert result['billing_details']['storage_gb']['billable_quantity'] == 4
        assert result['billing_details']['storage_gb']['cost'] == Decimal('20.00')
        
        assert result['total_cost'] == Decimal('21.25')
    
    def test_subscription_limits_validation(self):
        """Test subscription limits validation"""
        # Within limits
        usage_data = {'customers': 500, 'api_calls': 5000}
        within_limits, violations = validate_subscription_limits('basic', usage_data)
        
        assert within_limits is True
        assert len(violations) == 0
        
        # Over limits
        usage_data = {'customers': 1500, 'api_calls': 15000}
        within_limits, violations = validate_subscription_limits('basic', usage_data)
        
        assert within_limits is False
        assert len(violations) == 2
        
        customer_violation = next(v for v in violations if v['metric'] == 'customers')
        assert customer_violation['usage'] == 1500
        assert customer_violation['limit'] == 1000
        assert customer_violation['overage'] == 500
    
    def test_get_pricing_tier_info(self):
        """Test getting pricing tier information"""
        basic_info = get_pricing_tier_info('basic')
        
        assert basic_info is not None
        assert basic_info['monthly_fee'] == Decimal('99.00')
        assert basic_info['limits']['customers'] == 1000
        
        invalid_info = get_pricing_tier_info('invalid')
        assert invalid_info is None
    
    def test_invalid_subscription_tier(self):
        """Test invalid subscription tier handling"""
        with pytest.raises(ValueError, match="Invalid subscription tier"):
            calculate_squill_billing('invalid_tier', {})
    
    def test_default_client_pricing(self):
        """Test default client pricing when no rules provided"""
        usage_events = {
            'api_call': [150],  # 150 total, 100 free, 50 billable * $0.01 = $0.50
        }
        
        result = calculate_client_billing(None, usage_events)
        
        assert result['billing_details']['api_call']['cost'] == Decimal('0.50')
        assert result['total_cost'] == Decimal('0.50')

if __name__ == '__main__':
    pytest.main([__file__, '-v'])