from decimal import Decimal
from datetime import datetime

# Squill's subscription tiers for client companies
SUBSCRIPTION_TIERS = {
    'basic': {
        'monthly_fee': Decimal('99.00'),
        'limits': {
            'customers': 1000,
            'api_calls': 10000,
            'storage_gb': 10
        },
        'overage_rates': {
            'customers': Decimal('0.10'),  # per customer over limit
            'api_calls': Decimal('0.001'),  # per API call over limit
            'storage_gb': Decimal('1.00')   # per GB over limit
        }
    },
    'pro': {
        'monthly_fee': Decimal('299.00'),
        'limits': {
            'customers': 10000,
            'api_calls': 100000,
            'storage_gb': 100
        },
        'overage_rates': {
            'customers': Decimal('0.08'),
            'api_calls': Decimal('0.0008'),
            'storage_gb': Decimal('0.80')
        }
    },
    'enterprise': {
        'monthly_fee': Decimal('999.00'),
        'limits': {
            'customers': float('inf'),
            'api_calls': float('inf'),
            'storage_gb': float('inf')
        },
        'overage_rates': {
            'customers': Decimal('0.00'),
            'api_calls': Decimal('0.00'),
            'storage_gb': Decimal('0.00')
        }
    }
}

# Default pricing rules for client companies to charge their customers
DEFAULT_CLIENT_PRICING = {
    'api_call': {
        'rate': Decimal('0.01'),
        'free_tier': 100
    },
    'storage_gb': {
        'rate': Decimal('5.00'),
        'free_tier': 1
    },
    'transaction': {
        'rate': Decimal('0.30'),
        'free_tier': 10
    }
}

def calculate_squill_billing(subscription_tier, usage_data):
    """Calculate what Squill charges a client company"""
    if subscription_tier not in SUBSCRIPTION_TIERS:
        raise ValueError(f"Invalid subscription tier: {subscription_tier}")
    
    tier_config = SUBSCRIPTION_TIERS[subscription_tier]
    monthly_fee = tier_config['monthly_fee']
    limits = tier_config['limits']
    overage_rates = tier_config['overage_rates']
    
    total_cost = monthly_fee
    overages = {}
    
    for metric, usage in usage_data.items():
        if metric in limits:
            limit = limits[metric]
            if usage > limit and limit != float('inf'):
                overage = usage - limit
                overage_cost = overage * overage_rates[metric]
                overages[metric] = {
                    'usage': usage,
                    'limit': limit,
                    'overage': overage,
                    'rate': overage_rates[metric],
                    'cost': overage_cost
                }
                total_cost += overage_cost
    
    return {
        'subscription_tier': subscription_tier,
        'monthly_fee': monthly_fee,
        'overages': overages,
        'total_cost': total_cost
    }

def calculate_client_billing(pricing_rules, usage_events):
    """Calculate what a client company charges their customers"""
    if not pricing_rules:
        pricing_rules = DEFAULT_CLIENT_PRICING
    
    billing_details = {}
    total_cost = Decimal('0.00')
    
    for event_type, events in usage_events.items():
        if event_type not in pricing_rules:
            continue
            
        rule = pricing_rules[event_type]
        rate = Decimal(str(rule['rate']))
        free_tier = rule.get('free_tier', 0)
        
        total_quantity = sum(events)
        billable_quantity = max(0, total_quantity - free_tier)
        event_cost = billable_quantity * rate
        
        billing_details[event_type] = {
            'total_quantity': total_quantity,
            'free_quantity': min(total_quantity, free_tier),
            'billable_quantity': billable_quantity,
            'rate': rate,
            'cost': event_cost
        }
        
        total_cost += event_cost
    
    return {
        'billing_details': billing_details,
        'total_cost': total_cost
    }

def validate_subscription_limits(subscription_tier, current_usage):
    """Check if usage is within subscription limits"""
    if subscription_tier not in SUBSCRIPTION_TIERS:
        return False, f"Invalid subscription tier: {subscription_tier}"
    
    limits = SUBSCRIPTION_TIERS[subscription_tier]['limits']
    violations = []
    
    for metric, usage in current_usage.items():
        if metric in limits:
            limit = limits[metric]
            if limit != float('inf') and usage > limit:
                violations.append({
                    'metric': metric,
                    'usage': usage,
                    'limit': limit,
                    'overage': usage - limit
                })
    
    return len(violations) == 0, violations

def get_pricing_tier_info(tier):
    """Get detailed information about a pricing tier"""
    if tier not in SUBSCRIPTION_TIERS:
        return None
    
    return SUBSCRIPTION_TIERS[tier]