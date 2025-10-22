output "base_url" {
    description = "Indicates whether a user was created"
    value       = aws_apigatewayv2_stage.ai_translator_default.invoke_url
}

output "jwt_secret" {
    description = "The JWT secret stored in AWS Secrets Manager"
    value       = random_password.jwt_secret.result
    sensitive = true
}
