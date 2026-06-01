# Azure Deployment Checklist

Use this checklist to ensure all prerequisites are met before deploying to Azure Static Web Apps.

## Pre-Deployment Checklist

### Azure Setup

- [ ] Azure subscription is active and accessible
- [ ] Azure CLI installed locally (`az --version`)
- [ ] Logged into Azure (`az login`)
- [ ] Correct subscription selected (`az account show`)

### Service Principals

- [ ] Dev service principal created (no client secret)
- [ ] Dev service principal Client ID saved
- [ ] Dev Subscription ID saved
- [ ] Prod service principal created (no client secret)
- [ ] Prod service principal Client ID saved
- [ ] Prod Subscription ID saved
- [ ] Azure AD Tenant ID saved
- [ ] Contributor role assigned to dev SP on dev subscription
- [ ] Contributor role assigned to prod SP on prod subscription

### OIDC Federated Credentials

- [ ] Dev SP: federated credential for `ref:refs/heads/main` (push trigger)
- [ ] Dev SP: federated credential for `pull_request` (PR trigger)
- [ ] Prod SP: federated credential for `ref:refs/heads/main` (push trigger)

### OpenTofu State Backend

- [ ] Resource group created for OpenTofu state
- [ ] Storage account created (globally unique name)
- [ ] Blob container `tfstate-dev` created
- [ ] Blob container `tfstate-prod` created
- [ ] Storage account name saved
- [ ] Resource group name saved

### GitHub Repository Setup

- [ ] Repository settings accessible
- [ ] Admin permissions on repository
- [ ] Node.js and npm available
- [ ] Angular build working locally

### GitHub Repository Variables

Azure Identity (Settings → Secrets and variables → Actions → **Variables** tab):

- [ ] `AZURE_CLIENT_ID_DEV` configured
- [ ] `AZURE_CLIENT_ID_PROD` configured
- [ ] `AZURE_TENANT_ID` configured
- [ ] `AZURE_SUBSCRIPTION_ID_DEV` configured
- [ ] `AZURE_SUBSCRIPTION_ID_PROD` configured

OpenTofu Backend:

- [ ] `TF_BACKEND_RESOURCE_GROUP` configured
- [ ] `TF_BACKEND_STORAGE_ACCOUNT` configured
- [ ] `TF_BACKEND_CONTAINER_DEV` configured
- [ ] `TF_BACKEND_CONTAINER_PROD` configured
- [ ] `TF_BACKEND_KEY_DEV` configured
- [ ] `TF_BACKEND_KEY_PROD` configured

### GitHub Environments

Development:

- [ ] Environment named `dev` created
- [ ] Required reviewers configured
- [ ] Deployment branch set to `main` (optional)

Production:

- [ ] Environment named `prod` created
- [ ] Required reviewers configured (recommend 2+)
- [ ] Deployment branch set to `main` (optional)

### Local Development (Optional)

- [ ] OpenTofu installed (`tofu version`)
- [ ] OpenTofu version 1.6.0 or higher
- [ ] Node.js 20+ installed
- [ ] Git configured properly
- [ ] Angular CLI available

## First Deployment Checklist

### Dev Infrastructure Deployment

- [ ] Push code to `main` branch
- [ ] `deploy-infra-dev.yaml` workflow triggered
- [ ] OpenTofu validate job passed
- [ ] OpenTofu plan job passed
- [ ] `apply` job approved in `dev` environment
- [ ] `tofu apply` completed successfully
- [ ] Static Web App resource created in Azure

### Add Dev Deployment Token

- [ ] Token retrieved via `cd deploy/infra/dev && tofu output -raw api_key`
- [ ] Token added to Settings → Environments → `dev` → Secrets as `AZURE_STATIC_WEB_APPS_API_TOKEN`

### Dev App Deployment

- [ ] `deploy-app-dev.yaml` triggered on next push to main
- [ ] Application deployed to dev Static Web App
- [ ] Development URL accessible
- [ ] Application loads correctly (English and Spanish locales)

### Prod Infrastructure Deployment

- [ ] `deploy-infra-prod.yaml` triggered on push to main
- [ ] `apply` job approved in `prod` environment
- [ ] `tofu apply` completed successfully
- [ ] Prod Static Web App resource created in Azure

### Add Prod Deployment Token

- [ ] Token retrieved via `cd deploy/infra/prod && tofu output -raw api_key`
- [ ] Token added to Settings → Environments → `prod` → Secrets as `AZURE_STATIC_WEB_APPS_API_TOKEN`

### First Production Release

- [ ] Development environment tested and working
- [ ] Release version decided (e.g., v1.0.0)
- [ ] Git tag created and pushed
- [ ] GitHub release created
- [ ] Angular build completed successfully
- [ ] `apply` job approved by required reviewers in `prod` environment
- [ ] Application deployment completed
- [ ] Production URL accessible
- [ ] Application loads correctly
- [ ] DNS configured (if using custom domain)
- [ ] SSL certificate provisioned (automatic)

## Post-Deployment Checklist

### Verification

- [ ] Application loads on Static Web App URL
- [ ] SPA routing working (navigate to different routes)
- [ ] Deployment history visible in Azure Portal
- [ ] No errors in Application Insights
- [ ] Performance metrics acceptable
- [ ] Global CDN distribution confirmed

### Static Web App Configuration

- [ ] `staticwebapp.config.json` deployed correctly
- [ ] Navigation fallback configured for SPA routing
- [ ] Security headers applied (check via browser dev tools)
- [ ] MIME types configured correctly
- [ ] 404 handling working (returns index.html)

### Monitoring Setup

- [ ] Application Insights integration verified
- [ ] Cost alerts configured
- [ ] Availability tests configured (optional)
- [ ] Email notifications working
- [ ] Deployment notifications configured

### Documentation

- [ ] Deployment notes documented
- [ ] Static Web App URL documented
- [ ] Custom domain configuration documented (if applicable)
- [ ] Known issues documented
- [ ] Runbook updated

### Security

- [ ] HTTPS enforced (automatic)
- [ ] SSL certificate provisioned (automatic)
- [ ] Security headers configured in staticwebapp.config.json
- [ ] OIDC federated credentials verified in Azure Portal
- [ ] No client secrets stored anywhere
- [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN` confirmed as environment secret (not repository secret)
- [ ] Access reviews completed

## Ongoing Maintenance Checklist

### Monthly

- [ ] Review Azure costs (should be ~$9/month for both environments)
- [ ] Check Application Insights for errors
- [ ] Review deployment history
- [ ] Update npm dependencies if needed
- [ ] Check bandwidth usage

### Quarterly

- [ ] Review and update monitoring alerts
- [ ] Performance optimization review
- [ ] Security audit — review service principal RBAC permissions
- [ ] Review OIDC federated credential subjects (update if repo or org name changes)

### As Needed

- [ ] Test disaster recovery procedures
- [ ] Update OpenTofu to latest version
- [ ] Review Angular version and update if needed
- [ ] Review staticwebapp.config.json for optimizations

## Troubleshooting Checklist

### Deployment Fails

- [ ] Check GitHub Actions logs
- [ ] Verify all 11 repository variables are configured
- [ ] Verify OIDC federated credentials are correct on the service principal
- [ ] Check Azure service health
- [ ] Verify service principal has Contributor permissions
- [ ] Check OpenTofu state is not locked
- [ ] Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` environment secret is set

### Build Fails

- [ ] Check Node.js version (should be 20+)
- [ ] Verify npm dependencies install correctly
- [ ] Run tests locally
- [ ] Check for TypeScript errors
- [ ] Verify Angular build succeeds locally

### Application Not Loading

- [ ] Check Static Web App status in Azure Portal
- [ ] Review deployment history
- [ ] Verify deployment completed successfully
- [ ] Check for errors in browser console
- [ ] Verify staticwebapp.config.json is correct
- [ ] Check if CDN cached old version (may take a few minutes)

### Routing Issues

- [ ] Verify `staticwebapp.config.json` exists
- [ ] Check navigation fallback configuration
- [ ] Verify 404 override is configured
- [ ] Test direct navigation to routes
- [ ] Check browser console for errors

### Performance Issues

- [ ] Check Application Insights metrics
- [ ] Review CDN caching configuration
- [ ] Check asset compression (automatic)
- [ ] Review bundle size
- [ ] Consider lazy loading modules

### Custom Domain Issues

- [ ] Verify DNS CNAME record
- [ ] Check DNS propagation (`dig` or `nslookup`)
- [ ] Verify domain validation in Azure Portal
- [ ] Wait for SSL certificate provisioning (up to 10 minutes)
- [ ] Check custom domain status in Azure Portal

## Emergency Procedures Checklist

### Production Down

1. [ ] Check Azure service health status
2. [ ] Review Application Insights for errors
3. [ ] Check recent deployments in Azure Portal
4. [ ] Review GitHub Actions workflow logs
5. [ ] Consider redeploying previous release
6. [ ] Notify stakeholders
7. [ ] Document incident

### Failed Deployment

1. [ ] Check GitHub Actions logs for error details
2. [ ] Verify deployment token is valid
3. [ ] Check Azure Static Web App status
4. [ ] Review OpenTofu state
5. [ ] Retry deployment if transient error
6. [ ] Rollback to previous release if needed
7. [ ] Document issue and resolution

### Security Incident

1. [ ] Rotate deployment tokens immediately:
   - [ ] Run `tofu apply` to regenerate `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - [ ] Update environment secrets in GitHub
2. [ ] Review OIDC federated credentials in Azure Portal
3. [ ] Review access logs in Azure
4. [ ] Check for unauthorized changes
5. [ ] Review GitHub audit log
6. [ ] Notify security team
7. [ ] Document incident

### State File Corruption

1. [ ] Check OpenTofu state backups in Azure Storage (blob versioning)
2. [ ] Assess impact on infrastructure
3. [ ] Restore from previous state version if needed
4. [ ] Run `tofu refresh` to reconcile
5. [ ] Document incident and review backup procedures

## Cost Monitoring Checklist

### Monthly Cost Review

- [ ] Development environment: $0/month (Free tier)
- [ ] Production environment: ~$9/month (Standard tier)
- [ ] Total should be ~$9/month
- [ ] Check bandwidth usage (100 GB included, $0.15/GB overage)
- [ ] Review unexpected charges

### Cost Optimization

- [ ] Free tier for development (current configuration)
- [ ] Monitor production bandwidth usage
- [ ] Review Application Insights retention (90 days)
- [ ] Check for unused resources

## Notes

- Keep this checklist updated as your deployment evolves
- Document any deviations or custom configurations
- Static Web Apps deployment is simpler than App Services — no Docker management required
- Deployment tokens should be treated as sensitive credentials (environment secrets, not repo secrets)
- OIDC means no credential rotation is needed for service principal access
