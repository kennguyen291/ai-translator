# ================================================================
# ======================DYNAMOBDB TABLES =========================
# ================================================================

module "ai_translator_dynamodb_table_user" {
  source = "terraform-aws-modules/dynamodb-table/aws"
  version = "~> 5.1"

  table_class = "STANDARD"

  name         = "${local.environment}_UserTable"
  hash_key     = "username"
  range_key    = "email"

  attributes = [
    {
      name = "username"
      type = "S"
    },
    {
      name = "email"
      type = "S"
    },

  ]

  tags = local.common_tags
}
