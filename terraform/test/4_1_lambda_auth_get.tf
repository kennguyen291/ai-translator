# ================================================================
# ================ LAMBDA: GET /auth =============================
# ================================================================

resource "random_password" "jwt_secret" {
  length           = 16
  special          = true
  upper            = true
  lower            = true
  numeric          = true
  override_special = "!@#$%&*"
}

module "ai_translator_lambda_auth_get" {
  application_name = local.application_name

  source      = "../module/api_lambda"
  source_file = "../../aws/lambda/auth/get/root"

  function_name   = "auth_get"
  endpoint_method = "GET"
  endpoint_path   = "/auth"
  description     = "Authenticate User lambda function"
  python_version  = local.python_version
  lambda_role     = aws_iam_role.lambda_exec.arn

  api_gateway_id            = aws_apigatewayv2_api.ai_translator.id
  api_gateway_log_group_arn = aws_cloudwatch_log_group.ai_translator_log_group.arn

  environment_variables = {
    "jwt_secret"      = random_password.jwt_secret.result
    "USER_TABLE_NAME" = module.ai_translator_dynamodb_table_user.dynamodb_table_id
  }

  layers = [
    local.external_lambda_layers.boto3,
    local.external_lambda_layers.PyJWT,
  ]

  tags = local.common_tags
}
