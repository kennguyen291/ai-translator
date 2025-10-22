resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# TODO: Revisit to bring all the policy creation into one place
# And assign the mto lambdas as needed rather than assign everything to one role.
data "aws_iam_policy_document" "dynamodb_write_policy" {
  statement {
    sid    = "AllowDynamoDBWrites"
    effect = "Allow"

    actions = [
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:BatchWriteItem",
    ]

    resources = [
      # TODO: Revisit this to make it more modular.
      # For example, table access is restricted to need-to-have basis
      module.ai_translator_dynamodb_table_user.dynamodb_table_arn,
    ]
  }
}

resource "aws_iam_policy" "lambda_dynamodb_write" {
  name        = "LambdaDynamoDBWriteAccess-UserTable"
  description = "Allows Lambda to perform write operations on the specified DynamoDB table."
  policy      = data.aws_iam_policy_document.dynamodb_write_policy.json
}

# TODO:  Revisit to make this more moddular as well, so multiple policies can be attached as needed.
# the AWSLambdaBasicExecutionRole is always needed
resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "dynamodb_write_attachment" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_dynamodb_write.arn
}
