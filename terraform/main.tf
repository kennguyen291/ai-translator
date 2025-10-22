# Main infrastructure configuration for AWS using Terraform
provider "aws" {
  region = local.region
}

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}
