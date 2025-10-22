import json

def lambda_handler(event, context):
    """
    The main handler for the AWS Lambda function.
    
    :param event: A dictionary containing input data to the Lambda function.
    :param context: An object providing runtime information about the invocation.
    :return: A dictionary structured for an API Gateway proxy integration.
    """
    
    # The message we want to return
    message = "Hello, this is an api endpoint using aws lambda as backend and deployed using terraform!"
    
    # AWS Lambda handlers often return data in a structure required by the 
    # service calling it (like API Gateway). This is the standard JSON response format.
    response = {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' # Required for web requests (CORS)
        },
        'body': json.dumps({
            'message': message
        })
    }
    
    return response
