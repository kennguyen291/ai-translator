import json
import boto3
import uuid
import os

DYNAMODB_TABLE_NAME = os.environ.get("USER_TABLE_NAME", "User")
REGION = 'ap-southeast-2' 

# Initialize the DynamoDB resource globally for better performance
try:
    dynamodb = boto3.resource('dynamodb', region_name=REGION)
    user_table = dynamodb.Table(DYNAMODB_TABLE_NAME)
except Exception as e:
    print(f"Error initializing DynamoDB resource: {e}")
    # Set user_table to None to handle initialization failure gracefully
    user_table = None

def lambda_handler(event, context):
    if user_table is None:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'DynamoDB client failed to initialize.'})
        }

    try:
        # 1. Parse the request body (assuming it comes from API Gateway)
        # API Gateway wraps the JSON payload in a 'body' string field.
        body = event.get('body')
        if not body:
             return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Request body is missing.'})
            }

        data = json.loads(body)

        username = data.get('username')
        password_hash = data.get('password_hash') # Now expecting the hash directly
        email = data.get('email')

        # 2. Input Validation
        if not username or not password_hash or not email:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'message': 'Missing required fields: username, password_hash, and email are mandatory.'
                })
            }

        # 3. Construct the item for DynamoDB
        user_item = {
            'id' : f"user-{uuid.uuid4()}",
            'username': username,
            'password_hash': password_hash, # Inserting the received hash directly
            'email': email
        }

        # 4. Insert the item into the DynamoDB table
        # DynamoDB uses put_item for both inserts and updates (upsert).
        # We assume 'username' is the primary key.
        user_table.put_item(Item=user_item)

        # 5. Return a successful response
        return {
            'statusCode': 201,
            'body': json.dumps({
                'message': f'User {username} successfully registered and inserted into {DYNAMODB_TABLE_NAME}.',
                'user_info': {
                    'username': username,
                    'email': email
                }
            })
        }

    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Invalid JSON format in request body.'})
        }
    except Exception as e:
        # Log the error for debugging
        print(f"DynamoDB Insertion Error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': f'Internal server error during user creation: {str(e)}'})
        }
