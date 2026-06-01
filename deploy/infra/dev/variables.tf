variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment where resources will be deployed"
  type        = string
}

variable "sku_tier" {
  description = "SKU tier for the Static Web App. Use \"Free\" for dev or \"Standard\" for prod."
  type        = string
  default     = "Free"
}

variable "application_insights" {
  description = "Enable application insights for observability"
  type        = bool
  default     = false
}

variable "tags" {
  description = "Azure resource tags applied to all provisioned resources."
  type        = map(string)
  default     = {}
}
