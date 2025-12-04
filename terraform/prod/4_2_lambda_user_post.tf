# ================================================================
# ================ LAMBDA: POST /user ============================
# ================================================================

module "ai_translator_lambda_user_post" {
  application_name = local.application_name

  source      = "../module/api_lambda"
  source_file = "../../aws/lambda/user/post/root"

  function_name   = "user_post"
  endpoint_method = "POST"
  endpoint_path   = "/user"
  description     = "Create User lambda function"
  python_version  = local.python_version
  lambda_role     = aws_iam_role.lambda_exec.arn

  environment_variables = {
    "USER_TABLE_NAME" = module.ai_translator_dynamodb_table_user.dynamodb_table_id
  }

  api_gateway_id            = aws_apigatewayv2_api.ai_translator.id
  api_gateway_log_group_arn = aws_cloudwatch_log_group.ai_translator_log_group.arn

  layers = [local.external_lambda_layers.boto3]

  tags = local.common_tags
}
