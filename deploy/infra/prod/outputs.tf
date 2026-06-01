output "site_url" {
  description = "Public URL of the Azure Static Web App."
  value       = "https://${module.static_webapp.default_host_name}"
}

output "api_key" {
  description = "Deployment API key — store as AZURE_STATIC_WEB_APPS_API_TOKEN in the prod environment secrets."
  value       = module.static_webapp.api_key
  sensitive   = true
}
