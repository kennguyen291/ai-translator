variable "region" {
  description = "The AWS region to deploy resources into."
  type        = string
}

variable "python_version" {
  description = "The Python runtime version for the Lambda function."
  type        = string
}

variable "application_name" {
  description = "The name of the application."
  type        = string
}
