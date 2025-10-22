module "ai_translator_dynamodb_table_user" {
  source = "terraform-aws-modules/dynamodb-table/aws"
  version = "~> 5.1"

  name         = "User"
  hash_key     = "username"

  attributes = [
    {
      name = "username"
      type = "S"
    }
  ]

  tags = {
    Terraform = "true"
    Project     = "ai_translator"
  }
}
