# Azure Deployment Setup Guide

This guide walks you through setting up the complete Azure infrastructure and CI/CD pipeline for the
Larios Income Tax website using Azure Static Web Apps, OpenTofu, and OIDC authentication.

## Prerequisites

- Azure subscription
- Azure CLI installed locally
- GitHub repository with admin access
- OpenTofu 1.6+ installed locally (optional — for local testing only)

## Step 1: Create Service Principals

Create separate service principals for dev and prod. No client secrets are used — GitHub Actions
authenticates via OIDC federated credentials.

```bash
# Login to Azure
az login

# Set your dev subscription
az account set --subscription "YOUR_SUBSCRIPTION_ID_DEV"

# Create dev service principal (no client secret)
az ad sp create-for-rbac \
  --name "larios-income-tax-dev" \
  --skip-assignment

# Note the appId — this is AZURE_CLIENT_ID_DEV

# Assign Contributor role scoped to the dev subscription
az role assignment create \
  --assignee <DEV_APP_ID> \
  --role Contributor \
  --scope /subscriptions/YOUR_SUBSCRIPTION_ID_DEV

# Repeat for prod
az ad sp create-for-rbac \
  --name "larios-income-tax-prod" \
  --skip-assignment

az role assignment create \
  --assignee <PROD_APP_ID> \
  --role Contributor \
  --scope /subscriptions/YOUR_SUBSCRIPTION_ID_PROD
```

## Step 2: Configure OIDC Federated Credentials

For each service principal, add federated credentials so GitHub Actions can authenticate without
a client secret. Replace `bit-and-byte-ideas/larios-income-tax-website` with your org/repo.

```bash
# Dev SP: allow main branch pushes
az ad app federated-credential create \
  --id <AZURE_CLIENT_ID_DEV> \
  --parameters '{
    "name": "github-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:bit-and-byte-ideas/larios-income-tax-website:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'

# Dev SP: allow pull requests
az ad app federated-credential create \
  --id <AZURE_CLIENT_ID_DEV> \
  --parameters '{
    "name": "github-prs",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:bit-and-byte-ideas/larios-income-tax-website:pull_request",
    "audiences": ["api://AzureADTokenExchange"]
  }'

# Prod SP: allow main branch pushes
az ad app federated-credential create \
  --id <AZURE_CLIENT_ID_PROD> \
  --parameters '{
    "name": "github-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:bit-and-byte-ideas/larios-income-tax-website:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

## Step 3: OpenTofu State Storage

Create Azure Storage for OpenTofu remote state:

```bash
RESOURCE_GROUP="rg-terraform-state"
STORAGE_ACCOUNT="stlariostfstate"   # must be globally unique, lowercase, 3-24 chars
CONTAINER_DEV="tfstate-dev"
CONTAINER_PROD="tfstate-prod"
LOCATION="eastus"

az group create --name $RESOURCE_GROUP --location $LOCATION

az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS \
  --encryption-services blob

ACCOUNT_KEY=$(az storage account keys list \
  --resource-group $RESOURCE_GROUP \
  --account-name $STORAGE_ACCOUNT \
  --query '[0].value' -o tsv)

az storage container create \
  --name $CONTAINER_DEV \
  --account-name $STORAGE_ACCOUNT \
  --account-key $ACCOUNT_KEY

az storage container create \
  --name $CONTAINER_PROD \
  --account-name $STORAGE_ACCOUNT \
  --account-key $ACCOUNT_KEY

echo "Storage Account: $STORAGE_ACCOUNT"
echo "Resource Group:  $RESOURCE_GROUP"
```

## Step 4: GitHub Repository Variables

Configure the following as **repository variables** (Settings → Secrets and variables → Actions →
**Variables** tab). These are non-sensitive IDs — store them as variables, not secrets.

### Azure Identity

| Variable                     | Value                          |
| ---------------------------- | ------------------------------ |
| `AZURE_CLIENT_ID_DEV`        | Dev service principal `appId`  |
| `AZURE_CLIENT_ID_PROD`       | Prod service principal `appId` |
| `AZURE_TENANT_ID`            | Azure AD tenant ID             |
| `AZURE_SUBSCRIPTION_ID_DEV`  | Dev subscription ID            |
| `AZURE_SUBSCRIPTION_ID_PROD` | Prod subscription ID           |

### OpenTofu Backend

| Variable                     | Value                                 |
| ---------------------------- | ------------------------------------- |
| `TF_BACKEND_RESOURCE_GROUP`  | e.g. `rg-terraform-state`             |
| `TF_BACKEND_STORAGE_ACCOUNT` | Storage account name from Step 3      |
| `TF_BACKEND_CONTAINER_DEV`   | e.g. `tfstate-dev`                    |
| `TF_BACKEND_CONTAINER_PROD`  | e.g. `tfstate-prod`                   |
| `TF_BACKEND_KEY_DEV`         | e.g. `larios-income-tax-dev.tfstate`  |
| `TF_BACKEND_KEY_PROD`        | e.g. `larios-income-tax-prod.tfstate` |

## Step 5: GitHub Environments

Create protected environments for the approval gate on `apply` jobs.

### Development Environment

1. Go to repository Settings → Environments
2. Click "New environment" → Name: `dev`
3. Configure protection rules:
   - Check "Required reviewers" — add yourself or team members
   - Optional: restrict deployment branch to `main`

### Production Environment

1. Click "New environment" → Name: `prod`
2. Configure protection rules:
   - Check "Required reviewers" — recommend 2+ for production
   - Optional: restrict deployment branch to `main`

The `AZURE_STATIC_WEB_APPS_API_TOKEN` environment secret is added to each environment **after**
the first OpenTofu apply completes (see Step 6).

## Step 6: Initial OpenTofu Deployment (Dev)

Push code to main — `deploy-infra-dev.yaml` runs automatically. The workflow validates and plans
on both PRs and pushes; the `apply` job runs on push to main and requires `dev` environment
approval.

After the apply completes, retrieve the deployment token:

```bash
cd deploy/infra/dev

# For local testing, set OIDC-equivalent env vars
export ARM_CLIENT_ID="your-dev-client-id"
export ARM_TENANT_ID="your-tenant-id"
export ARM_SUBSCRIPTION_ID="your-dev-subscription-id"
export ARM_USE_OIDC="true"   # or use az login for interactive auth

tofu init \
  -backend-config="resource_group_name=rg-terraform-state" \
  -backend-config="storage_account_name=$STORAGE_ACCOUNT" \
  -backend-config="container_name=tfstate-dev" \
  -backend-config="key=larios-income-tax-dev.tfstate"

tofu output -raw api_key
```

Add the token as an **environment secret** in GitHub:

- Settings → Environments → `dev` → Secrets
- Secret name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
- Value: output from the command above

On the next push to main, `deploy-app-dev.yaml` will pick up the token and deploy the application.

## Step 7: Verify Deployment

1. Get the Static Web App URL from OpenTofu outputs:

   ```bash
   cd deploy/infra/dev
   tofu output site_url
   ```

1. Visit the URL (`https://swa-larios-income-tax-dev-*.azurestaticapps.net`)
1. Check Azure Portal:
   - Resource Groups → `rg-larios-income-tax-dev`
   - Verify all resources are created
   - Check Static Web App deployment history

## Step 8: Production Deployment

### Initial Prod Infrastructure

`deploy-infra-prod.yaml` runs on push to main (no PR trigger). Approve the apply in the `prod`
environment, then retrieve the deployment token:

```bash
cd deploy/infra/prod

tofu init \
  -backend-config="resource_group_name=rg-terraform-state" \
  -backend-config="storage_account_name=$STORAGE_ACCOUNT" \
  -backend-config="container_name=tfstate-prod" \
  -backend-config="key=larios-income-tax-prod.tfstate"

tofu output -raw api_key
```

Add it as an environment secret:

- Settings → Environments → `prod` → Secrets
- Secret name: `AZURE_STATIC_WEB_APPS_API_TOKEN`

### Create First Release

1. Ensure dev is working properly
1. Create a git tag:

   ```bash
   git tag -a v1.0.0 -m "First production release"
   git push origin v1.0.0
   ```

1. Create GitHub Release:
   - Repository → Releases → "Create a new release"
   - Choose tag: `v1.0.0` → Click "Publish release"

1. Monitor Actions → `deploy-app-prod.yaml` — approve the `prod` environment gate when prompted

## Step 9: Custom Domain (Optional)

### DNS Configuration

Add a CNAME record pointing to your Static Web App:

```text
Type:  CNAME
Name:  www
Value: swa-larios-income-tax-prod-RANDOM.azurestaticapps.net
TTL:   3600
```

Get the exact hostname from `tofu output site_url` or the Azure Portal.

### Custom Domain via Azure Portal

1. Azure Portal → Static Web App
2. Settings → Custom domains → "+ Add"
3. Enter `www.lariosincometax.com`
4. Select validation method (CNAME or TXT)
5. Click "Add" — SSL certificate is provisioned automatically at no extra cost

### Custom Domain via OpenTofu

`deploy/infra/prod/terraform.tfvars` already includes:

```hcl
custom_domain = "lariosincometax.com"
```

OpenTofu manages the custom domain as `www.lariosincometax.com` via the cicd-kit module.

## Troubleshooting

### OpenTofu State Lock

If deployment fails with a state lock error:

```bash
az storage blob lease break \
  --container-name tfstate-dev \
  --blob-name larios-income-tax-dev.tfstate \
  --account-name $STORAGE_ACCOUNT
```

### Static Web App Not Loading

```bash
az staticwebapp show \
  --name swa-larios-income-tax-dev \
  --resource-group rg-larios-income-tax-dev \
  --query '{name:name, defaultHostname:defaultHostname}'
```

### Application Routing Issues

Verify `staticwebapp.config.json` exists in the repository root and is copied into the build output
by the deploy workflow.

### GitHub Actions Failures

1. Check Actions logs for specific error
2. Verify all 11 repository variables are configured
3. Verify OIDC federated credentials are set on each service principal (main push + pull_request)
4. Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` environment secret is set under Settings → Environments

### Custom Domain Not Working

```bash
# Check DNS propagation
dig www.lariosincometax.com
```

Check domain validation and SSL certificate status in Azure Portal (can take up to 10 minutes).

## Monitoring

### Application Insights

```bash
az monitor app-insights component show \
  --app appi-larios-income-tax-dev \
  --resource-group rg-larios-income-tax-dev
```

### View Deployment Logs

```bash
az staticwebapp show \
  --name swa-larios-income-tax-dev \
  --resource-group rg-larios-income-tax-dev
```

Deployment history is also available in GitHub Actions.

## Cost Management

| Environment | Tier     | Cost      |
| ----------- | -------- | --------- |
| Dev         | Free     | $0/month  |
| Prod        | Standard | ~$9/month |

Additional bandwidth beyond 100 GB/month: $0.15/GB.

## Security Checklist

- [ ] Service principals have Contributor role scoped to their subscription only
- [ ] No client secrets — OIDC federated credentials used exclusively
- [ ] All 11 non-sensitive IDs stored as repository variables (not secrets)
- [ ] HTTPS enforced (automatic with Static Web Apps)
- [ ] SSL certificates provisioned (automatic)
- [ ] Production environment requires multiple approvers
- [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN` stored as environment secret under each environment
- [ ] Security headers configured in `staticwebapp.config.json`

## Next Steps

1. Configure custom domain (`www.lariosincometax.com`)
2. Set up monitoring alerts in Application Insights
3. Configure staging environments for preview deployments

## Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [OpenTofu Documentation](https://opentofu.org/docs/)
- [GitHub Actions OIDC with Azure](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-azure)
- [azure-static-webapp-cicd-kit](https://github.com/bit-and-byte-ideas/azure-static-webapp-cicd-kit)
- [CI/CD Pipeline](ci-cd.md)
- [Azure Infrastructure Architecture](azure-infrastructure.md)
- [Azure Deployment Checklist](azure-checklist.md)
