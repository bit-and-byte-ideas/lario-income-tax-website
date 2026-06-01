# Azure Deployment Setup Guide

This guide walks you through setting up the complete Azure infrastructure and CI/CD pipeline for the Larios Income
Tax website using Azure Static Web Apps.

## Prerequisites

- Azure subscription
- Azure CLI installed locally
- GitHub repository with admin access
- Terraform 1.6+ installed locally (optional for local testing)

## Step 1: Azure Service Principal

Create a service principal for Terraform and GitHub Actions:

```bash
# Login to Azure
az login

# Set your subscription
az account set --subscription "YOUR_SUBSCRIPTION_ID"

# Create service principal with Contributor role
az ad sp create-for-rbac \
  --name "larios-income-tax-terraform" \
  --role contributor \
  --scopes /subscriptions/YOUR_SUBSCRIPTION_ID \
  --sdk-auth
```

Save the JSON output - you'll need it for GitHub secrets.

## Step 2: Terraform State Storage

Create Azure Storage for Terraform state:

```bash
# Variables
RESOURCE_GROUP="rg-terraform-state"
STORAGE_ACCOUNT="sttfstate$(date +%s)"  # Creates unique name
CONTAINER="tfstate"
LOCATION="eastus"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create storage account
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS \
  --encryption-services blob

# Get storage account key
ACCOUNT_KEY=$(az storage account keys list \
  --resource-group $RESOURCE_GROUP \
  --account-name $STORAGE_ACCOUNT \
  --query '[0].value' -o tsv)

# Create blob container
az storage container create \
  --name $CONTAINER \
  --account-name $STORAGE_ACCOUNT \
  --account-key $ACCOUNT_KEY

echo "Storage Account: $STORAGE_ACCOUNT"
echo "Resource Group: $RESOURCE_GROUP"
echo "Container: $CONTAINER"
```

Save these values for GitHub secrets.

## Step 3: GitHub Secrets

Configure the following secrets in your GitHub repository (Settings → Secrets and variables → Actions):

### Azure Credentials

From the service principal JSON output:

- `AZURE_CLIENT_ID`: Value of `clientId`
- `AZURE_CLIENT_SECRET`: Value of `clientSecret`
- `AZURE_SUBSCRIPTION_ID`: Value of `subscriptionId`
- `AZURE_TENANT_ID`: Value of `tenantId`

### Terraform Backend

From Step 2:

- `TF_BACKEND_RESOURCE_GROUP`: Resource group name (e.g., "rg-terraform-state")
- `TF_BACKEND_STORAGE_ACCOUNT`: Storage account name (from `$STORAGE_ACCOUNT`)
- `TF_BACKEND_CONTAINER`: Container name (usually "tfstate")

### Static Web Apps Deployment Tokens

These will be added after initial Terraform deployment:

- `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV`: Dev environment deployment token
- `AZURE_STATIC_WEB_APPS_API_TOKEN_PROD`: Prod environment deployment token

**Note**: You'll obtain these tokens from Terraform output in Step 5.

## Step 4: GitHub Environments

Create protected environments for approval workflow:

### Development Environment

1. Go to repository Settings → Environments
2. Click "New environment"
3. Name: `dev`
4. Configure protection rules:
   - Check "Required reviewers"
   - Add yourself or team members as reviewers
   - Optional: Set deployment branch to `main`

### Production Environment

1. Click "New environment"
2. Name: `prod`
3. Configure protection rules:
   - Check "Required reviewers"
   - Add yourself or team members as reviewers (recommend 2+ for production)
   - Optional: Set deployment branch to `tags/*` (release tags only)

## Step 5: Initial Terraform Deployment

### Option A: Deploy via GitHub Actions (Recommended)

#### Initial Setup (Before First Deployment)

Since the deployment tokens don't exist yet, you'll need to do a two-step process:

1. **First Run** (Infrastructure Only):
   - Comment out the `deploy-app` job in `.github/workflows/deploy-dev.yml`
   - Push code to main branch
   - Approve the infrastructure deployment
   - Terraform will create the Static Web App

1. **Get Deployment Token**:

   ```bash
   # Set environment variables
   export ARM_CLIENT_ID="your-client-id"
   export ARM_CLIENT_SECRET="your-client-secret"
   export ARM_SUBSCRIPTION_ID="your-subscription-id"
   export ARM_TENANT_ID="your-tenant-id"

   # Navigate to dev environment
   cd deploy/environments/dev

   # Initialize Terraform
   terraform init \
     -backend-config="resource_group_name=rg-terraform-state" \
     -backend-config="storage_account_name=$STORAGE_ACCOUNT" \
     -backend-config="container_name=tfstate" \
     -backend-config="key=larios-income-tax-dev.tfstate"

   # Get deployment token
   terraform output -raw static_web_app_api_key
   ```

1. **Add Token to GitHub Secrets**:
   - Copy the output token
   - Go to GitHub repository Settings → Secrets → Actions
   - Add new secret: `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV`
   - Paste the token value

1. **Second Run** (Complete Deployment):
   - Uncomment the `deploy-app` job in the workflow
   - Push changes
   - The workflow will now complete including application deployment

### Option B: Deploy Locally (Testing)

```bash
cd deploy/environments/dev

# Set environment variables
export ARM_CLIENT_ID="your-client-id"
export ARM_CLIENT_SECRET="your-client-secret"
export ARM_SUBSCRIPTION_ID="your-subscription-id"
export ARM_TENANT_ID="your-tenant-id"

# Initialize Terraform
terraform init \
  -backend-config="resource_group_name=rg-terraform-state" \
  -backend-config="storage_account_name=$STORAGE_ACCOUNT" \
  -backend-config="container_name=tfstate" \
  -backend-config="key=larios-income-tax-dev.tfstate"

# Plan
terraform plan

# Apply
terraform apply

# Get Static Web App URL
terraform output static_web_app_url

# Get deployment token (save this)
terraform output -raw static_web_app_api_key
```

After Terraform completes, deploy the application using the deployment token:

```bash
# Build the application
cd ../../..
npm install
npm run build

# Deploy using Azure CLI
az staticwebapp deploy \
  --app-id "$(cd deploy/environments/dev && terraform output -raw static_web_app_name)" \
  --resource-group rg-larios-income-tax-dev \
  --source dist/browser/
```

## Step 6: Verify Deployment

After successful deployment:

1. Get the Static Web App URL from Terraform outputs:

   ```bash
   cd deploy/environments/dev
   terraform output static_web_app_url
   ```

1. Visit the URL in your browser (format: `https://swa-larios-income-tax-dev-*.azurestaticapps.net`)
1. Check Azure Portal:
   - Resource Groups → rg-larios-income-tax-dev
   - Verify all resources are created
   - Check Static Web App deployment history
   - Check Application Insights for telemetry

## Step 7: Production Deployment

### Setup Production Deployment Token

Before creating your first release:

1. Deploy production infrastructure:

```bash
cd deploy/environments/prod

# Set environment variables
export ARM_CLIENT_ID="your-client-id"
export ARM_CLIENT_SECRET="your-client-secret"
export ARM_SUBSCRIPTION_ID="your-subscription-id"
export ARM_TENANT_ID="your-tenant-id"

# Initialize Terraform
terraform init \
  -backend-config="resource_group_name=rg-terraform-state" \
  -backend-config="storage_account_name=$STORAGE_ACCOUNT" \
  -backend-config="container_name=tfstate" \
  -backend-config="key=larios-income-tax-prod.tfstate"

# Apply
terraform apply

# Get deployment token
terraform output -raw static_web_app_api_key
```

1. Add token to GitHub Secrets:
   - Secret name: `AZURE_STATIC_WEB_APPS_API_TOKEN_PROD`
   - Value: Output from above command

### Create First Release

1. Ensure dev is working properly
1. Create a git tag:

   ```bash
   git tag -a v1.0.0 -m "First production release"
   git push origin v1.0.0
   ```

1. Create GitHub Release:
   - Go to repository → Releases → "Create a new release"
   - Choose tag: v1.0.0
   - Title: "v1.0.0"
   - Description: Release notes
   - Click "Publish release"

1. Monitor workflow:
   - Go to Actions → "Deploy to Production"
   - Approve production deployment when prompted

## Step 8: Custom Domain (Optional)

### DNS Configuration

Add a CNAME record pointing to your Static Web App:

```text
Type: CNAME
Name: www (or @ for apex domain with ALIAS/ANAME support)
Value: swa-larios-income-tax-{env}-RANDOM.azurestaticapps.net
TTL: 3600
```

**Note**: Get the exact hostname from Azure Portal or Terraform output.

### Add Custom Domain via Azure Portal

1. Go to Azure Portal → Static Web App
2. Settings → Custom domains
3. Click "+ Add"
4. Enter your domain name (e.g., <www.lariosincometax.com>)
5. Select domain provider validation method:
   - **CNAME**: Use if you added CNAME record
   - **TXT**: Alternative validation method
6. Click "Add"
7. Wait for validation and SSL certificate provisioning (automatic and free)

### Add Custom Domain via Terraform

Update your Terraform configuration:

```hcl
# In deploy/environments/prod/terraform.tfvars
custom_domain = "www.lariosincometax.com"
```

Run `terraform apply` to add the custom domain.

### SSL Certificate

SSL certificates are:

- **Automatically provisioned** by Azure
- **Free** (no additional cost)
- **Auto-renewed** before expiration
- **Managed** by Azure (no manual intervention needed)

## Troubleshooting

### Terraform State Lock

If deployment fails with state lock error:

```bash
# List locks
az lock list --resource-group rg-terraform-state

# If no locks shown, check blob lease
az storage blob lease break \
  --container-name tfstate \
  --blob-name larios-income-tax-dev.tfstate \
  --account-name $STORAGE_ACCOUNT
```

### Static Web App Not Loading

Check deployment history:

```bash
# List deployments
az staticwebapp show \
  --name swa-larios-income-tax-dev \
  --resource-group rg-larios-income-tax-dev \
  --query '{name:name, defaultHostname:defaultHostname, repositoryUrl:repositoryUrl}'

# View in portal
# Azure Portal → Static Web App → Deployment history
```

### Application Routing Issues

Verify `staticwebapp.config.json` is in the repository root:

```bash
# Check file exists
cat staticwebapp.config.json

# Verify navigation fallback configuration
# Should route all non-asset requests to /index.html
```

### GitHub Actions Failures

1. Check Actions logs for specific error
2. Verify all secrets are configured:
   - Azure credentials (4 secrets)
   - Terraform backend (3 secrets)
   - Deployment tokens (2 secrets)
3. Ensure service principal has Contributor permissions
4. Verify deployment token is correct and not expired

### Custom Domain Not Working

1. Verify DNS propagation:

```bash
# Check CNAME record
dig www.lariosincometax.com

# Or use nslookup
nslookup www.lariosincometax.com
```

1. Check domain validation status in Azure Portal
1. Wait for SSL certificate provisioning (can take up to 10 minutes)

## Monitoring

### Application Insights

Access monitoring data:

```bash
# Get Application Insights details
az monitor app-insights component show \
  --app appi-larios-income-tax-dev \
  --resource-group rg-larios-income-tax-dev

# Query telemetry
az monitor app-insights query \
  --app appi-larios-income-tax-dev \
  --resource-group rg-larios-income-tax-dev \
  --analytics-query "requests | where timestamp > ago(1h) | summarize count() by bin(timestamp, 5m)"
```

### View Deployment Logs

```bash
# List recent deployments
az staticwebapp show \
  --name swa-larios-income-tax-dev \
  --resource-group rg-larios-income-tax-dev

# Deployment history is also available in GitHub Actions
```

## Cost Management

### Development Environment

**Estimated monthly cost**: $0 USD (Free tier)

**Features included**:

- 100 GB bandwidth/month
- 0.5 GB storage
- Free SSL certificates
- Global CDN

### Production Environment

**Estimated monthly cost**: $9 USD (Standard tier)

**Features included**:

- 100 GB bandwidth/month (additional: $0.15/GB)
- 0.5 GB storage
- Free SSL certificates
- Global CDN
- SLA: 99.95% uptime

### Cost Optimization

1. **Use Free tier for dev**: $0/month (current configuration)
2. **Monitor bandwidth usage**: Additional bandwidth is $0.15/GB
3. **Use Azure Cost Management**: Track spending
4. **CDN caching**: Reduces bandwidth usage automatically

### Cost Comparison

**Previous (App Services)**:

- Dev: ~$13/month
- Prod: ~$73/month
- Total: ~$86/month

**Current (Static Web Apps)**:

- Dev: $0/month
- Prod: ~$9/month
- Total: ~$9/month

**Savings**: 90% (~$77/month or ~$924/year)

## Security Checklist

- [ ] Service principal has minimum required permissions
- [ ] GitHub secrets are properly configured
- [ ] HTTPS only is enabled (automatic with Static Web Apps)
- [ ] SSL certificates are provisioned (automatic)
- [ ] Application Insights is enabled
- [ ] Managed identity is configured
- [ ] Production requires multiple approvers
- [ ] Custom domains have SSL certificates (automatic)
- [ ] Security headers configured in staticwebapp.config.json
- [ ] Deployment tokens are stored securely in GitHub Secrets

## Next Steps

1. Configure custom domain (<www.lariosincometax.com>)
2. Set up monitoring alerts in Application Insights
3. Configure staging environments for preview deployments
4. Set up Azure Functions API if backend functionality is needed
5. Implement authentication if user accounts are required
6. Configure backup and disaster recovery (Terraform state already backed up)

## Support

For issues:

- **Azure issues**: Check Azure Portal service health
- **Terraform issues**: Review state and plan outputs
- **GitHub Actions**: Check workflow logs
- **Application issues**: Check Application Insights
- **Static Web Apps**: Check deployment history in Azure Portal

## Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Static Web Apps Configuration](https://docs.microsoft.com/azure/static-web-apps/configuration)
- Migration Guide: See `deploy/MIGRATION.md` in repository root for App Services to Static Web Apps migration details
