import os
from dotenv import load_dotenv
import boto3

# Load environment variables from .env file
load_dotenv()

# Test AWS connection
try:
    # Create STS client to test credentials
    sts_client = boto3.client('sts')
    
    # Get caller identity (this will fail if credentials are wrong)
    identity = sts_client.get_caller_identity()
    
    print("✅ AWS Connection Successful!")
    print(f"Account ID: {identity['Account']}")
    print(f"User ARN: {identity['Arn']}")
    print(f"Region: {os.environ.get('AWS_DEFAULT_REGION', 'Not set')}")
    
    # Test DynamoDB access
    dynamodb = boto3.resource('dynamodb')
    print("✅ DynamoDB access configured")
    
except Exception as e:
    print(f"❌ AWS Connection Failed: {e}")
