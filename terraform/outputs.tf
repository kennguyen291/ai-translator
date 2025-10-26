output "base_url" {
    description = "Indicates whether a user was created"
    value       = aws_apigatewayv2_stage.ai_translator_default.invoke_url
}
