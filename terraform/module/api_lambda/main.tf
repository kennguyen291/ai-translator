#REGION API GATEWAY DECLARE
#==========================
data "aws_apigatewayv2_api" "api" {
  api_id = var.api_gateway_id
}
#ENDREGION

#REGION LAMBDA FUNCTION DEFINITION
# ================================================================
# package file into archive
data "archive_file" "function_archive" {
  type        = "zip"
  source_file = "${var.source_file}/index.py"
  output_path = "${path.module}/archives/${var.application_name}_${var.function_name}.zip"
}

# define lambda function
resource "aws_lambda_function" "function_lambda" {
  function_name = "${var.application_name}_${var.function_name}"

  filename    = data.archive_file.function_archive.output_path
  description = coalesce(var.description, "${var.function_name} Lambda function deployed via Terraform")

  layers = var.layers

  runtime = var.python_version
  handler = "index.lambda_handler"

  environment {
    variables = var.environment_variables
  }

  source_code_hash = data.archive_file.function_archive.output_base64sha256
  role             = var.lambda_role

  tags = merge((var.tags), local.terraform_tags)
}

# lambda fucntion logging
resource "aws_cloudwatch_log_group" "function_log_group" {
  name              = "${var.application_name}/lambda/${aws_lambda_function.function_lambda.function_name}"
  retention_in_days = 30
}

# There are two concepts for permissions related to lambda:
# - Lambda Role: What can the lambda do
# - Lambda Permission: Who can invoke the lambda
# This is the latter, this resource gives permission to API Gateway to invoke the lambda function.
resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.function_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${data.aws_apigatewayv2_api.api.execution_arn}/*/*"
}
#ENDREGION

#REGION API GATEWAY V2 DEFINITION
# ================================================================
# Add integration between API Gateway and Lambda aka make gateway trigger the lambda
resource "aws_apigatewayv2_integration" "function_api_gateway" {
  api_id             = data.aws_apigatewayv2_api.api.id
  integration_uri    = aws_lambda_function.function_lambda.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST" # api gateway invokes lambda via POST
}

# Create route for the Lambda function
resource "aws_apigatewayv2_route" "function_route" {
  api_id = data.aws_apigatewayv2_api.api.id

  route_key = "${var.endpoint_method} ${var.endpoint_path}"
  target    = "integrations/${aws_apigatewayv2_integration.function_api_gateway.id}"
}
