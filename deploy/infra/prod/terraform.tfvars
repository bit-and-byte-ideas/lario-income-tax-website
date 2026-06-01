project_name         = "larios-income-tax"
environment          = "prod"
sku_tier             = "Standard"
application_insights = true
custom_domain        = "lariosincometax.com"

tags = {
  owner       = "bit-and-byte-ideas"
  environment = "prod"
  managed_by  = "opentofu"
  source      = "github.com/bit-and-byte-ideas/larios-income-tax-website"
}
