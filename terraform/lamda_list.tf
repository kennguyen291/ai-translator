# ================================================================
# ================LAMBDA FUNCTION DEFINITIONS ====================
# This file declares and configures AWS Lambda functions
# via a custom Terraform module — the helm for serverless behavior
# across the infrastructure. Handle with respect and precision.
# ================================================================

# use this to test lambda module deployments
# module "ai_translator_lambda_hello_world" {
#   source      = "./api_lambda"

#   application_name = local.ai_translator_application_name
#   source_file = "./../aws/lambda/hello_world"

#   function_name   = "hello_world"
#   endpoint_method = "GET"
#   endpoint_path   = "/hello"
#   description     = "Hello World Lambda function deployed via Terraform"
#   python_version  = local.python_version
#   lambda_role     = aws_iam_role.lambda_exec.arn

#   api_gateway_id            = aws_apigatewayv2_api.ai_translator.id
#   api_gateway_log_group_arn = aws_cloudwatch_log_group.ai_translator_log_group.arn

#   layers = ["arn:aws:lambda:ap-southeast-2:770693421928:layer:Klayers-p312-boto3:23"]

#   tags = {
#     Project   = "ai_translator"
#   }
# }

module "ai_translator_lambda_user_post" {
  application_name = local.ai_translator_application_name

  source      = "./api_lambda"
  source_file = "./../aws/lambda/user/post/root"

  function_name   = "user_post"
  endpoint_method = "POST"
  endpoint_path   = "/user"
  description     = "Create User lambda function deployed via Terraform"
  python_version  = var.python_version
  lambda_role     = aws_iam_role.lambda_exec.arn

  api_gateway_id            = aws_apigatewayv2_api.ai_translator.id
  api_gateway_log_group_arn = aws_cloudwatch_log_group.ai_translator_log_group.arn

  layers = ["arn:aws:lambda:ap-southeast-2:770693421928:layer:Klayers-p312-boto3:23"]

  tags = {
    Project   = "ai_translator"
  }
}

resource "random_password" "jwt_secret" {
  length           = 16
  special          = true
  upper            = true
  lower            = true
  numeric          = true
  override_special = "!@#$%&*"
}

module "ai_translator_lambda_auth_get" {
  application_name = local.ai_translator_application_name

  source      = "./api_lambda"
  source_file = "./../aws/lambda/auth/get/root"

  function_name   = "auth_get"
  endpoint_method = "POST"
  endpoint_path   = "/auth"
  description     = "Authenticate User lambda function deployed via Terraform"
  python_version  = var.python_version
  lambda_role     = aws_iam_role.lambda_exec.arn

  api_gateway_id            = aws_apigatewayv2_api.ai_translator.id
  api_gateway_log_group_arn = aws_cloudwatch_log_group.ai_translator_log_group.arn

  environment_variables = {
    "jwt_secret" = random_password.jwt_secret.result
  }

  layers = [
    "arn:aws:lambda:ap-southeast-2:770693421928:layer:Klayers-p312-boto3:23", 
    "arn:aws:lambda:ap-southeast-2:770693421928:layer:Klayers-p312-PyJWT:1"
  ]

  tags = {
    Project   = "ai_translator"
  }
}
