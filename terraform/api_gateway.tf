# APIs group
resource "aws_apigatewayv2_api" "ai_translator" {
  name          = "ai_translator"
  protocol_type = "HTTP"

  tags = {
    Terraform = "true"
    Project   = "ai_translator"
  }
}

# api logging
resource "aws_cloudwatch_log_group" "ai_translator_log_group" {
  name              = "${local.ai_translator_application_name}/api_gw/${aws_apigatewayv2_api.ai_translator.name}"
  retention_in_days = 14
}

# Create default stage
resource "aws_apigatewayv2_stage" "ai_translator_default" {
  api_id      = aws_apigatewayv2_api.ai_translator.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.ai_translator_log_group.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}
