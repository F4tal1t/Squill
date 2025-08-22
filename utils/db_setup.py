import boto3
from botocore.exceptions import ClientError

def create_tables(endpoint_url=None):
    """Create DynamoDB tables for Squill application"""
    
    # Use LocalStack endpoint for local development
    if endpoint_url:
        dynamodb = boto3.resource('dynamodb', endpoint_url=endpoint_url)
    else:
        dynamodb = boto3.resource('dynamodb')
    
    try:
        # Create UsageEvents table
        usage_table = dynamodb.create_table(
            TableName='UsageEvents',
            KeySchema=[
                {'AttributeName': 'customer_id', 'KeyType': 'HASH'},
                {'AttributeName': 'timestamp', 'KeyType': 'RANGE'}
            ],
            AttributeDefinitions=[
                {'AttributeName': 'customer_id', 'AttributeType': 'S'},
                {'AttributeName': 'timestamp', 'AttributeType': 'S'}
            ],
            BillingMode='PAY_PER_REQUEST'
        )
        print("Creating UsageEvents table...")
        usage_table.wait_until_exists()
        print("UsageEvents table created successfully")
        
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print("UsageEvents table already exists")
        else:
            print(f"Error creating UsageEvents table: {e}")
    
    try:
        # Create Customers table
        customers_table = dynamodb.create_table(
            TableName='Customers',
            KeySchema=[
                {'AttributeName': 'customer_id', 'KeyType': 'HASH'}
            ],
            AttributeDefinitions=[
                {'AttributeName': 'customer_id', 'AttributeType': 'S'}
            ],
            BillingMode='PAY_PER_REQUEST'
        )
        print("Creating Customers table...")
        customers_table.wait_until_exists()
        print("Customers table created successfully")
        
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print("Customers table already exists")
        else:
            print(f"Error creating Customers table: {e}")

if __name__ == "__main__":
    # Create tables in LocalStack for local development
    print("Setting up DynamoDB tables...")
    create_tables(endpoint_url="http://localhost:4566")
    print("Database setup complete!")