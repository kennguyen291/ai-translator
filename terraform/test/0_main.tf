# ================================================================
# =================TERRAFORM CONFIGURATIONS ======================
# ================================================================
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.9"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.7"
    }
  }

  backend "s3" {
    bucket       = "ai-translator-terraform-state-bucket"
    key          = "test/terraform.tfstate"
    region       = "ap-southeast-2"
    use_lockfile = true
    encrypt      = true
  }

  required_version = ">= 1.2"
}

# ================================================================
# ==================== TERRAFORM PROVIDERS =======================
# ================================================================
provider "aws" {
  region = local.region
}

provider "random" {}

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

# ================================================================
# ==================== TERRAFORM LOCALs ==========================
# ================================================================

locals {
  application_name = "ai_translator"
  region           = "ap-southeast-2"
  python_version   = "python3.12"
  environment      = "test"

  common_tags = {
    Project     = "ai_translator"
    Terraform   = "true"
    Environment = "test"
  }
}

# ================================================================
# ==================== TERRAFORM OUTPUTS =========================
# ================================================================

output "base_url" {
  description = "Indicates whether a user was created"
  value       = aws_apigatewayv2_stage.ai_translator_default.invoke_url
}

# ================================================================
# ================================================================
# ================================================================
