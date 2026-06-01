# CI/CD Pipeline

## Overview

This project uses GitHub Actions for continuous integration and deployment to Azure Static Web Apps. Automated
workflows ensure code quality, run tests, build the Angular application, and deploy to Azure.

## Workflows

### 1. PR Validation

**File:** `.github/workflows/pr-validation.yml`

**Trigger:** Pull requests to `main` or `develop` branches

**Jobs:**

1. **Lint** - Code quality checks
   - Prettier formatting validation
   - Markdown linting

1. **Build** - Application build
   - Production bundle creation
   - Bundle size check
   - Artifact upload

1. **Test** - Unit tests
   - Vitest test execution
   - Coverage reporting

**Status:** All jobs must pass before merge

### 2. Deploy to Development

**File:** `.github/workflows/deploy-dev.yml`

**Trigger:** Push to `main` branch

**Jobs:**

1. **Build and Validate**
   - Install dependencies
   - Run linters (format check, markdown lint)
   - Run tests
   - Build Angular application
   - Upload build artifact

1. **Terraform Validate**
   - Format check
   - Initialize (no backend)
   - Validate configuration

1. **Check Infrastructure Changes** ⚡ _Smart Deployment_
   - Initialize Terraform with Azure backend
   - Run Terraform plan with change detection
   - Determine if infrastructure changes exist
   - Upload plan artifact if changes detected
   - Set output flag for conditional deployment

1. **Deploy Infrastructure** (Conditional)
   - **Only runs if infrastructure changes detected**
   - Download Terraform plan
   - Apply changes (requires approval only when changes exist)
   - Extract deployment token

1. **Deploy Application**
   - Download build artifact
   - Deploy to Azure Static Web Apps
   - Automatic CDN distribution
   - Deploy summary shows infrastructure status

**Environment:** `dev` (Free tier)

**Deployment URL:** `https://swa-larios-income-tax-dev-*.azurestaticapps.net`

### 3. Deploy to Production

**File:** `.github/workflows/deploy-prod.yml`

**Trigger:** GitHub Release published

**Jobs:**

1. **Build and Validate**
   - Extract release version
   - Install dependencies
   - Run linters
   - Run tests
   - Build Angular application
   - Upload build artifact (30-day retention)

1. **Terraform Validate**
   - Format check
   - Initialize (no backend)
   - Validate configuration

1. **Deploy Infrastructure**
   - Initialize Terraform with Azure backend
   - Plan infrastructure changes
   - Apply changes (requires approval)
   - Extract deployment token

1. **Deploy Application**
   - Download build artifact
   - Deploy to Azure Static Web Apps
   - Create deployment record
   - Display deployment summary

**Environment:** `prod` (Standard tier)

**Deployment URL:** `https://swa-larios-income-tax-prod-*.azurestaticapps.net`

### 4. TechDocs Validation

**File:** `.github/workflows/techdocs.yml`

**Trigger:**

- Pull requests affecting docs
- Push to main (docs changes)

**Jobs:**

1. **Validate TechDocs**
   - YAML configuration validation
   - MkDocs build test
   - Broken link detection
   - Markdown linting
   - Site artifact upload

## Required Secrets

Configure these as organization or repository secrets:

### Azure Credentials

| Secret                  | Description                     | Required By                     |
| ----------------------- | ------------------------------- | ------------------------------- |
| `AZURE_CLIENT_ID`       | Service Principal client ID     | deploy-dev.yml, deploy-prod.yml |
| `AZURE_CLIENT_SECRET`   | Service Principal client secret | deploy-dev.yml, deploy-prod.yml |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID           | deploy-dev.yml, deploy-prod.yml |
| `AZURE_TENANT_ID`       | Azure tenant ID                 | deploy-dev.yml, deploy-prod.yml |

### Terraform Backend

| Secret                       | Description                     | Required By                     |
| ---------------------------- | ------------------------------- | ------------------------------- |
| `TF_BACKEND_RESOURCE_GROUP`  | Terraform state resource group  | deploy-dev.yml, deploy-prod.yml |
| `TF_BACKEND_STORAGE_ACCOUNT` | Terraform state storage account | deploy-dev.yml, deploy-prod.yml |
| `TF_BACKEND_CONTAINER`       | Terraform state container       | deploy-dev.yml, deploy-prod.yml |

### Static Web Apps Deployment Tokens

| Secret                                 | Description           | Required By     |
| -------------------------------------- | --------------------- | --------------- |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV`  | Dev deployment token  | deploy-dev.yml  |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_PROD` | Prod deployment token | deploy-prod.yml |

### Setting Up Secrets

1. **Navigate to Repository Settings**
   - Go to Settings > Secrets and variables > Actions

1. **Add Azure Credentials** (from Service Principal creation)
   - `AZURE_CLIENT_ID`
   - `AZURE_CLIENT_SECRET`
   - `AZURE_SUBSCRIPTION_ID`
   - `AZURE_TENANT_ID`

1. **Add Terraform Backend Secrets**
   - `TF_BACKEND_RESOURCE_GROUP`
   - `TF_BACKEND_STORAGE_ACCOUNT`
   - `TF_BACKEND_CONTAINER`

1. **Add Deployment Tokens** (from Terraform output)
   - Run `terraform output -raw static_web_app_api_key`
   - Add as `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV`
   - Repeat for prod environment

See [Azure Deployment Setup](azure-deployment-setup.md) for complete setup instructions.

## Workflow Details

### PR Validation Workflow

```yaml
on:
  pull_request:
    branches:
      - main
      - develop

jobs:
  lint:
    # Code quality checks
  build:
    # Build application
  test:
    # Run unit tests
```

**Checks Performed:**

- ✅ Code formatting (Prettier)
- ✅ Markdown linting
- ✅ TypeScript compilation
- ✅ Production build succeeds
- ✅ Bundle size within limits
- ✅ Unit tests pass

### Development Deployment Workflow

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-and-validate:
    # Build Angular app and run tests
  terraform-validate:
    # Validate Terraform configuration
  check-infrastructure-changes:
    # Check if infrastructure has changes
  deploy-infrastructure:
    environment: dev
    if: infrastructure changes detected
    # Deploy infrastructure with Terraform
  deploy-app:
    environment: dev
    # Deploy to Azure Static Web Apps
```

**Deployment Process:**

1. Build Angular application
1. Run linters and tests
1. Validate Terraform configuration
1. **Check for infrastructure changes** ⚡ _New Smart Feature_
1. Deploy infrastructure (**only if changes detected**, requires approval)
1. Deploy application to Static Web App
1. Automatic global CDN distribution

**Smart Infrastructure Deployment:**

The workflow intelligently detects whether infrastructure changes are needed:

- **No Changes**: Infrastructure deployment is skipped, environment approval bypassed
- **Changes Detected**: Infrastructure deployment runs, requires environment approval
- Application deployment always runs regardless of infrastructure status

**Environment:** Free tier Static Web App

#### Smart Infrastructure Deployment (Development)

The development workflow includes intelligent infrastructure change detection to optimize deployments:

**How It Works:**

1. **Change Detection Phase** (`check-infrastructure-changes` job)
   - Runs `terraform plan -detailed-exitcode` against current state
   - Exit code 0 = No changes needed
   - Exit code 2 = Changes detected
   - Exit code 1 = Error (fails workflow)

2. **Conditional Deployment** (`deploy-infrastructure` job)
   - **Skipped** when no changes detected (exit code 0)
     - No environment approval required
     - Workflow continues to application deployment
   - **Runs** when changes detected (exit code 2)
     - Requires environment approval
     - Applies infrastructure changes
     - Updates Azure resources

3. **Application Deployment** (`deploy-app` job)
   - Always runs regardless of infrastructure status
   - Deploys latest application code
   - Updates Static Web App content

**Benefits:**

- ⚡ **Faster Deployments**: Skip unnecessary infrastructure steps
- 🔓 **No Approvals Needed**: When only app code changes
- 💰 **Cost Efficient**: Reduces Terraform API calls
- 🎯 **Clear Feedback**: Deployment summary shows what was deployed

**Deployment Scenarios:**

| Scenario                    | Infrastructure Job | Approval Required | Application Job |
| --------------------------- | ------------------ | ----------------- | --------------- |
| App code changes only       | ⏭️ Skipped         | ❌ No             | ✅ Runs         |
| Infrastructure changes only | ✅ Runs            | ✅ Yes            | ✅ Runs         |
| Both app and infrastructure | ✅ Runs            | ✅ Yes            | ✅ Runs         |

### Production Deployment Workflow

```yaml
on:
  release:
    types: [published]
  workflow_dispatch:

jobs:
  build-and-validate:
    # Build Angular app with version
  terraform-validate:
    # Validate Terraform configuration
  deploy-infrastructure:
    environment: prod
    # Deploy infrastructure with Terraform
  deploy-app:
    environment: prod
    # Deploy to Azure Static Web Apps
```

**Deployment Process:**

1. Extract release version
1. Build Angular application
1. Run linters and tests
1. Validate Terraform configuration
1. Deploy infrastructure (requires approval)
1. Deploy application to Static Web App
1. Create deployment record
1. Display deployment summary

**Environment:** Standard tier Static Web App with SLA

### TechDocs Workflow

**Validation Steps:**

1. Validate YAML syntax
1. Build documentation with MkDocs
1. Check for broken links
1. Lint markdown files
1. Upload build artifacts

## Workflow Status

### Viewing Workflow Runs

1. Navigate to repository
1. Click "Actions" tab
1. View workflow runs and results

### Status Badges

Add to README.md:

```markdown
![PR Validation](https://github.com/your-org/larios-income-tax-website/actions/workflows/pr-validation.yml/badge.svg)
![Deploy to Dev](https://github.com/your-org/larios-income-tax-website/actions/workflows/deploy-dev.yml/badge.svg)
![Deploy to Prod](https://github.com/your-org/larios-income-tax-website/actions/workflows/deploy-prod.yml/badge.svg)
```

## Deployment Process

### Automatic Deployment to Development

**On merge to main:**

1. PR validation runs (all checks must pass)
1. Code merged to main branch
1. Development deployment workflow triggers
1. Application built and tested
1. Terraform validates infrastructure
1. Infrastructure deployed to Azure (requires approval)
1. Application deployed to Azure Static Web Apps
1. Automatic global CDN distribution

### Automatic Deployment to Production

**On GitHub Release:**

1. Create GitHub Release with version tag (e.g., v1.0.0)
1. Production deployment workflow triggers
1. Application built with version metadata
1. Terraform validates infrastructure
1. Infrastructure deployed to Azure (requires approval)
1. Application deployed to Azure Static Web Apps
1. Deployment record created
1. Deployment summary displayed

### Manual Deployment

**Trigger workflow manually:**

1. Go to Actions tab
1. Select "Deploy to Development" or "Deploy to Production"
1. Click "Run workflow"
1. Select branch (main for dev, tag for prod)
1. Click "Run workflow"
1. Approve deployment when prompted

### Creating Releases

**Create a production release:**

1. Create and push a version tag:

   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

1. Create GitHub Release:
   - Go to repository → Releases → Create new release
   - Select tag v1.0.0
   - Add release notes
   - Publish release

1. Production deployment workflow automatically triggers

## Accessing Deployments

### Development Environment

**URL:** `https://swa-larios-income-tax-dev-*.azurestaticapps.net`

**Access:**

- Automatically deployed on push to main
- Free tier Static Web App
- Global CDN distribution

### Production Environment

**URL:** `https://swa-larios-income-tax-prod-*.azurestaticapps.net`

**Access:**

- Deployed via GitHub Releases
- Standard tier Static Web App with SLA
- Custom domain support
- Global CDN distribution

## Cache Management

### GitHub Actions Cache

Workflows use GitHub Actions cache for:

- NPM dependencies
- Build artifacts
- Terraform plugins

**Benefits:**

- Faster builds
- Reduced bandwidth
- Improved reliability

**Cache Keys:**

- NPM: `node-modules-${{ hashFiles('package-lock.json') }}`
- Terraform: `.terraform` directory

### Clearing Cache

If builds fail due to cache issues:

1. Navigate to Actions > Caches
1. Delete problematic cache
1. Re-run workflow

## Build Artifacts

### Available Artifacts

Workflows upload artifacts for debugging:

| Workflow      | Artifact        | Retention |
| ------------- | --------------- | --------- |
| PR Validation | build-artifacts | 7 days    |
| TechDocs      | techdocs-site   | 7 days    |

### Downloading Artifacts

1. Go to workflow run
1. Scroll to "Artifacts" section
1. Click to download

## Monitoring

### Workflow Notifications

Configure notifications:

1. Repository Settings > Notifications
1. Choose notification preferences
1. Enable email or Slack notifications

### Failure Alerts

When workflows fail:

1. Check workflow run logs
1. Review failed step
1. Fix issue
1. Re-run workflow or push fix

## Best Practices

### Pull Requests

1. **Create PR** with descriptive title
1. **Wait for checks** to complete
1. **Review results** in Actions tab
1. **Fix failures** before requesting review
1. **Merge only** when all checks pass

### Version Tagging

1. Use semantic versioning (v1.0.0)
1. Create annotated tags with messages
1. Push tags to trigger release builds
1. Document changes in release notes

### Deployments

1. Always approve deployments after reviewing changes
1. Test in development before production releases
1. Monitor deployment status in Actions tab
1. Verify deployment health after completion
1. Document deployment changes in release notes

## Troubleshooting

### Workflow Fails on PR

**Issue:** PR validation fails

**Solutions:**

1. Check workflow logs
1. Run checks locally:

   ```bash
   npm run format:check
   npm run lint:md
   npm run build
   npm test
   ```

1. Fix issues and push
1. Workflow re-runs automatically

### Terraform Validation Fails

**Issue:** Terraform validation fails in workflow

**Solutions:**

1. Check Terraform configuration syntax
1. Validate locally:

   ```bash
   cd deploy/environments/dev
   terraform init
   terraform validate
   terraform fmt -check
   ```

1. Fix configuration errors
1. Push changes

### Deployment to Azure Fails

**Issue:** Application deployment to Static Web Apps fails

**Solutions:**

1. Verify deployment token is correct
1. Check Static Web App exists in Azure
1. Review deployment logs in workflow
1. Ensure build output directory is correct (`dist/browser/`)
1. Verify staticwebapp.config.json syntax

### Terraform Apply Fails

**Issue:** Infrastructure deployment fails

**Solutions:**

1. Check Terraform plan output
1. Verify Azure credentials are valid
1. Check resource name conflicts
1. Review Azure service limits
1. Ensure service principal has proper permissions

### Tests Failing in CI

**Issue:** Tests pass locally but fail in CI

**Solutions:**

1. Check Node.js version match
1. Verify all dependencies in package.json
1. Check for environment-specific issues
1. Review test logs in workflow
1. Add debug output to tests

### Infrastructure Change Detection Issues

**Issue:** Infrastructure deployment skipped when it shouldn't be

**Solutions:**

1. Check Terraform state is up to date:

   ```bash
   cd deploy/environments/dev
   terraform init
   terraform plan
   ```

1. Verify Azure credentials in secrets
1. Check Terraform backend configuration
1. Review `check-infrastructure-changes` job logs
1. Manually trigger deployment if needed

**Issue:** Infrastructure deployment runs when no changes needed

**Solutions:**

1. Check for drift in Azure resources
1. Verify Terraform state file is current
1. Review recent manual changes in Azure Portal
1. Check if Terraform configuration was modified
1. Consider running `terraform refresh`

## Maintenance

### Regular Tasks

1. **Update dependencies**
   - Review Dependabot PRs
   - Update Node.js version
   - Update GitHub Actions versions

1. **Monitor Azure resources**
   - Review Static Web Apps usage
   - Monitor bandwidth and requests
   - Check deployment history

1. **Review workflows**
   - Check execution times
   - Optimize slow jobs
   - Update caching strategies

1. **Security updates**
   - Rotate deployment tokens periodically
   - Review service principal permissions
   - Update Terraform provider versions

## Deployment Architecture

See [cicd-flow-diagram.drawio.xml](cicd-flow-diagram.drawio.xml) for the complete CI/CD flow diagram.

### Azure Static Web Apps Resources

#### Development Environment

**Resources Created:**

- Resource Group: `rg-larios-income-tax-dev`
- Static Web App: `swa-larios-income-tax-dev` (Free tier)
- Automatic global CDN distribution

**Deployment URL:** `https://swa-larios-income-tax-dev-*.azurestaticapps.net`

#### Production Environment

**Resources Created:**

- Resource Group: `rg-larios-income-tax-prod`
- Static Web App: `swa-larios-income-tax-prod` (Standard tier)
- Custom domain support
- SLA-backed availability

**Deployment URL:** `https://swa-larios-income-tax-prod-*.azurestaticapps.net`

### GitHub Environments

Configure protected environments in repository settings:

**Development Environment (`dev`):**

- Name: `dev`
- Protection rules: Required reviewers
- Deployment branch: `main`

**Production Environment (`prod`):**

- Name: `prod`
- Protection rules: Required reviewers (recommend 2+ for production)
- Deployment branch: `tags/*` (release tags only)

### Monitoring Deployments

#### GitHub Actions

- **View workflows**: Repository → Actions tab
- **Check logs**: Click on workflow run → Select job
- **Download artifacts**: Available in workflow summary
- **Deployment status**: Check job completion status

#### Azure Portal

- **Static Web App overview**: View deployment history and status
- **Configuration**: Review app settings and environment variables
- **Custom domains**: Manage custom domain mappings
- **Monitoring**: View request metrics and bandwidth usage

### Rollback Strategy

If deployment fails or issues are found:

1. **Redeploy Previous Release:**

   ```bash
   # Find the previous working release tag
   git tag -l

   # Create a new release from the working tag
   # This triggers the production deployment workflow
   ```

1. **Via GitHub Releases:**
   - Go to repository → Releases
   - Find the last working release
   - Click "Edit release"
   - Re-publish the release (triggers redeployment)

1. **Via GitHub Actions:**
   - Go to Actions → Deploy to Production
   - Find the last successful run
   - Click "Re-run all jobs"

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Infrastructure Architecture](azure-infrastructure.md)
- [Azure Deployment Setup Guide](azure-deployment-setup.md)
- [Azure Deployment Checklist](azure-deployment-checklist.md)
- Workflow Files: See `.github/workflows/` directory in repository root
