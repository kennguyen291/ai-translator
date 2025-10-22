provider "random" {}

resource "random_password" "jwt_secret" {
  length           = 16
  special          = true
  upper            = true
  lower            = true
  numeric          = true
  override_special = "!@#$%&*"
}

resource "aws_secretsmanager_secret" "ai_translator" {
  name = "ai_translator_secret"

  tags = {
    Terraform = "true"
    Project   = "ai_translator"
  }
}

resource "aws_secretsmanager_secret_version" "ai_translator_version" {
  secret_id = aws_secretsmanager_secret.ai_translator.id
  secret_string = jsonencode({
    jwt_secret = "${random_password.jwt_secret.result}"
  })
}
