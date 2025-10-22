variable "function_name" {
  description = "The name of the Lambda function."
  type        = string
}

variable "source_file" {
  description = "The source file path for the Lambda function."
  type        = string
}

variable "python_version" {
  description = "The runtime environment for the Lambda function."
  type        = string
}

variable "description" {
  description = "Description of the Lambda function."
  type        = string
  default     = ""
}

variable "endpoint_method" {
  description = "The HTTP method for the API Gateway endpoint."
  type        = string
}

variable "endpoint_path" {
  description = "The resource path for the API Gateway endpoint."
  type        = string
}

variable "lambda_role" {
  description = "The IAM role ARN for the Lambda function."
  type        = string
}

variable "application_name" {
  description = "The name of the application for tagging purposes."
  type        = string
}

variable "api_gateway_id" {
  description = "The ID of the API Gateway to associate with."
  type        = string
}

variable "api_gateway_log_group_arn" {
  description = "The name of the CloudWatch log group for API Gateway."
  type        = string
}

variable  "tags" {
  description = "A map of tags to assign to the resources."
  type        = map(string)
  default     = {}
}
