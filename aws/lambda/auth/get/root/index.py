import json
import os
import time
from datetime import datetime, timedelta, timezone

# Libraries required:
# - PyJWT (pip install PyJWT)
import boto3
import jwt
from botocore.exceptions import ClientError

# --- Configuration (Replace these with your actual values) ---
# Environment variables should be used in a real Lambda setup.
USER_TABLE_NAME = os.environ.get("USER_TABLE_NAME", "User")

# The name of the environment variable that holds the JWT signing secret.
JWT_ENV_VAR_KEY = "jwt_secret"

# Global variables for caching clients and the JWT secret
dynamodb_client = boto3.client('dynamodb')
# Note: secretsmanager_client is no longer needed since the secret is now read from the environment.
JWT_SECRET = None

# --- Helper Functions ---

def get_jwt_secret():
    """
    Retrieves and caches the JWT secret from a Lambda environment variable.
    """
    global JWT_SECRET
    if JWT_SECRET:
        return JWT_SECRET

    # Retrieve secret directly from environment variables
    secret = os.environ.get(JWT_ENV_VAR_KEY)
    
    if not secret:
        # Raise a critical error if the required environment variable is missing
        # This will result in a 500 error in the handler, indicating a configuration issue.
        raise RuntimeError(f"Critical configuration error: Missing environment variable '{JWT_ENV_VAR_KEY}'. Please set the secret value securely as an environment variable.")

    JWT_SECRET = secret
    return JWT_SECRET

def verify_credentials(username, password_hash):
    """
    Queries DynamoDB for the user and verifies the provided password hash.
    Returns the user data if verification is successful, otherwise None.
    """
    try:
        response = dynamodb_client.get_item(
            TableName=USER_TABLE_NAME,
            Key={'username': {'S': username}}
        )
        
        item = response.get('Item')
        if not item:
            print(f"Login failed: User '{username}' not found.")
            return None

        # DynamoDB stores attributes as objects (e.g., {'S': 'value'})
        stored_hash = item.get('password_hash', {}).get('S')
        
        # --- SECURITY WARNING ---
        # In a real application, you MUST NOT store or send raw hashes like this.
        # You should store a SECURELY salted and hashed password (e.g., using bcrypt).
        # The comparison should be: bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
        # This example uses a simple string comparison based on your prompt input.
        if stored_hash and stored_hash == password_hash:
            print(f"User '{username}' credentials verified.")
            return {'username': username}
        else:
            print(f"Login failed: Invalid password hash for user '{username}'.")
            return None

    except ClientError as e:
        print(f"DynamoDB error during verification: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred during verification: {e}")
        return None

def generate_token(username, secret):
    """
    Generates a signed JWT for the authenticated user.
    """
    # Set token expiration to 60 minutes from now (UTC)
    utc_now = datetime.now(timezone.utc)
    expiration = utc_now + timedelta(minutes=60)
    
    payload = {
        'sub': username,                               # Subject (user identifier)
        'iat': int(utc_now.timestamp()),               # Issued At
        'exp': int(expiration.timestamp()),            # Expiration Time
        'iss': 'ai_translator',                        # Issuer
        'scope': 'user'                                # Custom claim
    }
    
    # Use HMAC SHA-256 algorithm for signing
    token = jwt.encode(payload, secret, algorithm='HS256')
    
    print(f"Generated JWT for user: {username}")
    return token

CORS_HEADERS_GET = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
}

# --- Main Lambda Handler ---

def lambda_handler(event, context):
    """
    Main entry point for the Lambda function. Handles the login attempt.
    """
    try:
        # 1. Parse Input
        # Assuming the input is a JSON body from API Gateway
        body = json.loads(event.get('body', '{}'))
        username = body.get('username')
        password_hash = body.get('password_hash')
        
        if not username or not password_hash:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Missing username or password_hash in request body.'}),
                'headers': CORS_HEADERS_GET
            }
        
        # 2. Verify Credentials
        user_data = verify_credentials(username, password_hash)
        
        if not user_data:
            # Return 401 for both 'user not found' and 'invalid password' for security
            return {
                'statusCode': 401,
                'body': json.dumps({'message': 'Invalid username or password.'}),
                'headers': CORS_HEADERS_GET
            }
            
        # 3. Retrieve JWT Secret from environment variable
        jwt_secret = get_jwt_secret()

        # 4. Generate JWT
        token = generate_token(username, jwt_secret)
        
        # 5. Success Response
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Login successful.',
                'token': token
            }),
            'headers': CORS_HEADERS_GET
        }

    except RuntimeError as e:
        # Catch errors from Secret retrieval failure
        # This occurs if the JWT_SIGNING_SECRET environment variable is not set.
        print(f"Configuration or critical runtime error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal configuration error. Cannot process login.'}),
            'headers': {'Content-Type': 'application/json'}
        }
    except Exception as e:
        print(f"Unhandled error in lambda_handler: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'An unexpected server error occurred.'}),
            'headers': CORS_HEADERS_GET
        }

if __name__ == "__main__":
    # For local testing purposes only
    test_event = {
        'body': json.dumps({
            'username': 'testuser',
            'password_hash': 'TestPassword123!'
        })
    }
    response = lambda_handler(test_event, None)
    print("Lambda Response:", response)
