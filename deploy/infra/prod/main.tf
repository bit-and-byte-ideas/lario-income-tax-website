module "static_webapp" {
  source                      = "github.com/bit-and-byte-ideas/azure-static-webapp-cicd-kit//modules/azure-static-webapp"
  resource_group_name         = "rg-${var.project_name}-${var.environment}"
  static_webapp_name          = "swa-${var.project_name}-${var.environment}"
  sku_tier                    = var.sku_tier
  enable_application_insights = var.application_insights
  custom_domain               = var.custom_domain != null ? "www.${var.custom_domain}" : null
  tags                        = var.tags
}
