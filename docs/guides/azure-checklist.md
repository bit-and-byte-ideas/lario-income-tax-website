# Azure Deployment Checklist

Use this checklist to ensure all prerequisites are met before deploying to Azure Static Web Apps.

## Pre-Deployment Checklist

### Azure Setup

- [ ] Azure subscription is active and accessible
- [ ] Azure CLI installed locally (`az --version`)
- [ ] Logged into Azure (`az login`)
- [ ] Correct subscription selected (`az account show`)

### Service Principal

- [ ] Service principal created with Contributor role
- [ ] Client ID saved
- [ ] Client secret saved
- [ ] Subscription ID saved
- [ ] Tenant ID saved

### Terraform State Backend

- [ ] Resource group created for Terraform state
- [ ] Storage account created
- [ ] Storage account name is unique
- [ ] Blob container created named "tfstate"
- [ ] Storage account name saved
- [ ] Resource group name saved

### GitHub Repository Setup

- [ ] Repository settings accessible
- [ ] Admin permissions on repository
- [ ] Node.js and npm available
- [ ] Angular build working locally

### GitHub Secrets Configuration

Azure Credentials:

- [ ] `AZURE_CLIENT_ID` configured
- [ ] `AZURE_CLIENT_SECRET` configured
- [ ] `AZURE_SUBSCRIPTION_ID` configured
- [ ] `AZURE_TENANT_ID` configured

Terraform Backend:

- [ ] `TF_BACKEND_RESOURCE_GROUP` configured
- [ ] `TF_BACKEND_STORAGE_ACCOUNT` configured
- [ ] `TF_BACKEND_CONTAINER` configured

Static Web Apps Deployment Tokens (added after first Terraform deployment):

- [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV` configured
- [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN_PROD` configured

### GitHub Environments

Development:

- [ ] Environment named "dev" created
- [ ] Required reviewers configured
- [ ] Deployment branch set to "main" (optional)

Production:

- [ ] Environment named "prod" created
- [ ] Required reviewers configured (recommend 2+)
- [ ] Deployment branch set to tags (optional)

### Local Development (Optional)

- [ ] Terraform installed (`terraform version`)
- [ ] Terraform version 1.6.0 or higher
- [ ] Node.js 20+ installed
- [ ] Git configured properly
- [ ] Angular CLI available

## First Deployment Checklist

### Initial Infrastructure Deployment

**Note**: The first deployment requires a two-step process to obtain deployment tokens.

Step 1 - Infrastructure Only:

- [ ] `deploy-app` job commented out in `.github/workflows/deploy-dev.yml`
- [ ] Code pushed to main branch
- [ ] Build and validate workflow completed
- [ ] Terraform validation passed
- [ ] Deployment approval requested
- [ ] Deployment approved
- [ ] Terraform apply completed successfully
- [ ] Static Web App resource created in Azure

Step 2 - Get Deployment Tokens:

- [ ] Connected to Azure via `az login`
- [ ] Navigated to `deploy/environments/dev`
- [ ] Terraform initialized with backend
- [ ] Deployment token retrieved via `terraform output -raw static_web_app_api_key`
- [ ] Token added to GitHub Secrets as `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV`

Step 3 - Complete Deployment:

- [ ] `deploy-app` job uncommented in workflow
- [ ] Changes pushed to main
- [ ] Full deployment workflow completed
- [ ] Application deployed to Static Web App
- [ ] Development URL accessible
- [ ] Application loads correctly

### Production Deployment

- [ ] Development environment tested and working
- [ ] Production infrastructure deployed via Terraform
- [ ] Production deployment token retrieved
- [ ] Token added to GitHub Secrets as `AZURE_STATIC_WEB_APPS_API_TOKEN_PROD`
- [ ] Release version decided (e.g., v1.0.0)
- [ ] Git tag created and pushed
- [ ] GitHub release created
- [ ] Angular build completed successfully
- [ ] Terraform validation passed
- [ ] Deployment approval requested
- [ ] Deployment approved by required reviewers
- [ ] Terraform apply completed successfully
- [ ] Application deployment completed
- [ ] Production URL accessible
- [ ] Application loads correctly
- [ ] DNS configured (if using custom domain)
- [ ] SSL certificate provisioned (automatic)

## Post-Deployment Checklist

### Verification

- [ ] Application loads on Static Web App URL
- [ ] SPA routing working (navigate to different routes)
- [ ] Application Insights showing data
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
- [ ] Deployment token location documented
- [ ] Custom domain configuration documented (if applicable)
- [ ] Known issues documented
- [ ] Runbook updated

### Security

- [ ] HTTPS enforced (automatic)
- [ ] SSL certificate provisioned (automatic)
- [ ] Security headers configured in staticwebapp.config.json
- [ ] Deployment tokens stored securely in GitHub Secrets
- [ ] Access reviews completed
- [ ] Audit logs reviewed

## Ongoing Maintenance Checklist

### Monthly

- [ ] Review Azure costs (should be ~$9/month for both environments)
- [ ] Check Application Insights for errors
- [ ] Review deployment history
- [ ] Update npm dependencies if needed
- [ ] Check bandwidth usage

### Quarterly

- [ ] Rotate service principal credentials
- [ ] Review and update monitoring alerts
- [ ] Performance optimization review
- [ ] Security audit
- [ ] Review deployment token security

### As Needed

- [ ] Test disaster recovery procedures
- [ ] Update Terraform to latest version
- [ ] Review Angular version and update if needed
- [ ] Review staticwebapp.config.json for optimizations

## Troubleshooting Checklist

### Deployment Fails

- [ ] Check GitHub Actions logs
- [ ] Verify all secrets are configured (9 total)
- [ ] Check Azure service health
- [ ] Verify service principal permissions
- [ ] Check Terraform state is not locked
- [ ] Verify deployment token is correct and not expired

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
4. [ ] Review Terraform state
5. [ ] Retry deployment if transient error
6. [ ] Rollback to previous release if needed
7. [ ] Document issue and resolution

### Security Incident

1. [ ] Rotate all credentials immediately:
   - [ ] Service principal credentials
   - [ ] Deployment tokens
   - [ ] GitHub secrets
2. [ ] Review access logs in Azure
3. [ ] Check for unauthorized changes
4. [ ] Review GitHub audit log
5. [ ] Notify security team
6. [ ] Document incident
7. [ ] Update security procedures

### State File Corruption

1. [ ] Check Terraform state backups in Azure Storage
2. [ ] Review blob versioning
3. [ ] Assess impact on infrastructure
4. [ ] Restore from previous state version if needed
5. [ ] Run `terraform refresh` to reconcile
6. [ ] Document incident
7. [ ] Review state backup procedures

## Cost Monitoring Checklist

### Monthly Cost Review

- [ ] Development environment: $0/month (Free tier)
- [ ] Production environment: ~$9/month (Standard tier)
- [ ] Total should be ~$9/month
- [ ] Check bandwidth usage (100 GB included, $0.15/GB overage)
- [ ] Review unexpected charges
- [ ] Verify cost savings vs. previous architecture (90% reduction)

### Cost Optimization

- [ ] Free tier for development (current configuration)
- [ ] Monitor production bandwidth usage
- [ ] Review Application Insights retention (90 days)
- [ ] Check for unused resources
- [ ] Consider downgrade to Free tier for non-critical prod if traffic is low

## Migration Checklist (From App Services)

If migrating from Docker-based App Services:

- [ ] Review migration documentation (`deploy/MIGRATION.md` in repository root)
- [ ] Backup current App Service configuration
- [ ] Archive old Docker files (.old extension)
- [ ] Update GitHub workflows
- [ ] Test Static Web Apps deployment in dev first
- [ ] Verify all functionality works
- [ ] Update DNS if using custom domain
- [ ] Verify SSL certificates migrate correctly
- [ ] Decommission old App Services resources
- [ ] Update documentation references

## Notes

- Keep this checklist updated as your deployment evolves
- Document any deviations or custom configurations
- Share learnings with the team
- Regular reviews improve reliability
- Static Web Apps deployment is simpler than App Services - no Docker management required
- Deployment tokens should be treated as sensitive credentials
