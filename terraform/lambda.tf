# ================================================================
# ================LAMBDA FUNCTION DEFINITIONS ====================
# This file declares and configures AWS Lambda functions
# via a custom Terraform module — the helm for serverless behavior
# across the infrastructure. Handle with respect and precision.
# ================================================================

# use this to test lambda module deployments
module "ai_translator_lambda_hello_world" {
  application_name = local.ai_translator_application_name

  source      = "./api_lambda"
  source_file = "./../aws/lambda/hello_world"

  function_name   = "hello_world"
  endpoint_method = "GET"
  endpoint_path   = "/hello"
  description     = "Hello World Lambda function deployed via Terraform"
  python_version  = local.python_version
  lambda_role     = aws_iam_role.lambda_exec.arn

  api_gateway_id            = aws_apigatewayv2_api.ai_translator.id
  api_gateway_log_group_arn = aws_cloudwatch_log_group.ai_translator_log_group.arn

  tags = {
    Terraform = "true"
    Project   = "ai_translator"
  }
}

module "ai_translator_lambda_create_user" {
  application_name = local.ai_translator_application_name

  source      = "./api_lambda"
  source_file = "./../aws/lambda/post_user_create"

  function_name   = "create_user"
  endpoint_method = "POST"
  endpoint_path   = "/user/create"
  description     = "Create User lambda function deployed via Terraform"
  python_version  = var.python_version
  lambda_role     = aws_iam_role.lambda_exec.arn

  api_gateway_id            = aws_apigatewayv2_api.ai_translator.id
  api_gateway_log_group_arn = aws_cloudwatch_log_group.ai_translator_log_group.arn

  tags = {
    Terraform = "true"
    Project   = "ai_translator"
  }
}
