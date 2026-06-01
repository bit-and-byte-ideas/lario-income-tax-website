# Azure Infrastructure Architecture

## Overview

This document describes the complete infrastructure architecture for deploying the Larios Income Tax website to Azure
Static Web Apps using OpenTofu and GitHub Actions.

## Architecture Diagram

See the `azure-infrastructure-diagram.drawio.xml` file in the project repository for the visual
infrastructure diagram that can be imported into Draw.IO.

```text
┌─────────────────────────────────────────────────────────────────┐
│                         GitHub Repository                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐                      ┌──────────────┐        │
│  │ Push to Main │                      │Create Release│        │
│  └──────┬───────┘                      └──────┬───────┘        │
│         │                                     │                 │
│         v                                     v                 │
│  ┌──────────────────────┐          ┌──────────────────────┐   │
│  │ deploy-infra-dev.yaml│          │deploy-infra-prod.yaml│   │
│  └──────────────────────┘          └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
         │                                     │
         v                                     v
┌─────────────────────────────────────────────────────────────────┐
│                         OpenTofu                                 │
├─────────────────────────────────────────────────────────────────┤
│  Validate → Plan → Apply (with approval)                        │
│  Creates: Resource Groups, Static Web Apps, App Insights        │
└─────────────────────────────────────────────────────────────────┘
         │                                     │
         v                                     v
┌─────────────────────────────────────────────────────────────────┐
│              Azure Static Web Apps Deployment                    │
├─────────────────────────────────────────────────────────────────┤
│  Native deployment via Azure/static-web-apps-deploy action      │
│  Uploads: dist/browser/ → Global CDN                            │
└─────────────────────────────────────────────────────────────────┘
         │                                     │
         v                                     v
    ┌─────────┐                          ┌─────────┐
    │   Dev   │                          │  Prod   │
    └─────────┘                          └─────────┘
         │                                     │
         v                                     v
┌─────────────────────┐              ┌─────────────────────┐
│  Azure Dev Env      │              │  Azure Prod Env     │
├─────────────────────┤              ├─────────────────────┤
│ Resource Group      │              │ Resource Group      │
│ Static Web App      │              │ Static Web App      │
│ (Free SKU)          │              │ (Standard SKU)      │
│ App Insights        │              │ App Insights        │
│ Managed Identity    │              │ Managed Identity    │
│ Global CDN          │              │ Global CDN          │
└─────────────────────┘              └─────────────────────┘
```

## Components

### Source Control

- **GitHub Repository**: Version control and CI/CD orchestration
- **Branches**:
  - `main`: Development branch, triggers dev deployments
  - Feature branches: For development work
- **Tags**: Semantic versioning (v1.0.0) triggers production deployments

### CI/CD Pipeline

See [ci-cd.md](ci-cd.md) for detailed CI/CD pipeline documentation and the visual flow diagram.

#### Deployment Pipeline

**Development Trigger**: Push to main

**Production Trigger**: Release creation

**Deployment Steps**:

1. **Build and Validate**:
   - Install dependencies
   - Run linters (format check, markdown lint)
   - Run tests
   - Build Angular application
   - Upload build artifact

1. **OpenTofu Validate**:
   - Format check
   - Initialize (no backend)
   - Validate configuration

1. **Deploy Infrastructure** (OpenTofu):
   - Initialize with Azure backend
   - Plan infrastructure changes
   - Apply changes (creates/updates Static Web App, App Insights)
   - Extract deployment token

1. **Deploy Application** (Static Web Apps):
   - Download build artifact
   - Deploy to Azure Static Web Apps using native deployment
   - Upload dist/browser/ to global CDN
   - Automatic routing configuration

### Infrastructure as Code

#### OpenTofu Structure

```text
deploy/
└── infra/
    ├── dev/                 # Development environment
    │   ├── main.tf          # Module call
    │   ├── variables.tf     # Input variables
    │   ├── backend.tf       # Remote state config
    │   ├── outputs.tf       # site_url, api_key
    │   ├── terraform.tfvars # Environment values (committed)
    │   └── .terraform.lock.hcl  # Provider lock file (committed)
    └── prod/                # Production environment
        └── (same structure)
```

The reusable module is consumed from
[azure-static-webapp-cicd-kit](https://github.com/bit-and-byte-ideas/azure-static-webapp-cicd-kit)
via a GitHub source reference — no local `modules/` directory required.

#### State Management

- **Backend**: Azure Storage Account (azurerm backend)
- **State Files**:
  - Dev: `larios-income-tax-dev.tfstate`
  - Prod: `larios-income-tax-prod.tfstate`
- **State Locking**: Blob lease mechanism (automatic)
- **Encryption**: Server-side encryption (automatic)
- **Backend credentials**: passed via GitHub Actions workflow (OIDC — no static secrets)

### Azure Resources

#### Development Environment

**Resource Group**: `rg-larios-income-tax-dev`

**Static Web App**:

- Name: `swa-larios-income-tax-dev`
- SKU: Free
- Cost: $0/month
- Region: East US 2
- HTTPS Only: Yes (enforced)
- Global CDN: Built-in
- URL: `https://swa-larios-income-tax-dev-*.azurestaticapps.net`

**Features**:

- Automatic SSL certificates
- Global CDN distribution
- Native Angular SPA support
- CI/CD integration via GitHub Actions
- Deployment tokens managed by OpenTofu
- SPA routing with staticwebapp.config.json

**Application Insights**:

- Name: `appi-larios-income-tax-dev`
- Type: Web Application
- Retention: 90 days

**Managed Identity**:

- Type: System-assigned
- Used for secure Azure resource access

#### Production Environment

**Resource Group**: `rg-larios-income-tax-prod`

**Static Web App**:

- Name: `swa-larios-income-tax-prod`
- SKU: Standard
- Cost: ~$9/month
- Region: East US 2
- HTTPS Only: Yes (enforced)
- Global CDN: Built-in
- URL: `https://swa-larios-income-tax-prod-*.azurestaticapps.net`

**Features**:

- Automatic SSL certificates
- Global CDN distribution
- Custom domains with SSL
- SLA-backed uptime guarantee (99.95%)
- Native Angular SPA support
- Deployment tokens managed by OpenTofu
- SPA routing with staticwebapp.config.json

**Application Insights**:

- Name: `appi-larios-income-tax-prod`
- Type: Web Application
- Retention: 90 days

**Managed Identity**:

- Type: System-assigned
- Used for secure Azure resource access

### Deployment Mechanism

**Static Web Apps Native Deployment**:

- **Action**: `Azure/static-web-apps-deploy@v1`
- **Authentication**: Deployment tokens from Terraform output
- **Build**: Pre-built Angular application (dist/browser/)
- **Upload**: Automatic upload to global CDN
- **Configuration**: staticwebapp.config.json for routing and headers

**Configuration File** (`staticwebapp.config.json`):

- Navigation fallback for SPA routing
- 404 override to serve index.html
- Global security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- MIME type definitions
- Asset exclusions from SPA routing

### Security

#### Authentication & Authorization

**Service Principal (OIDC)**:

- Role: Contributor (scoped to subscription)
- Used by: GitHub Actions and OpenTofu via OIDC federated credentials
- No client secrets — GitHub Actions exchanges its OIDC token for short-lived Azure credentials

**Managed Identity**:

- Type: System-assigned
- Scope: Static Web App resources
- Purpose: Secure access to Azure services

#### Secrets Management

Workflows authenticate to Azure via OIDC — no client secrets are stored anywhere.
Non-sensitive IDs are stored as **repository variables** (`vars.*`); only the deployment token is a secret.

**Repository Variables** (Settings → Secrets and variables → Actions → Variables):

- `AZURE_CLIENT_ID_DEV` / `AZURE_CLIENT_ID_PROD` — service principal app IDs
- `AZURE_TENANT_ID` — Azure AD tenant ID
- `AZURE_SUBSCRIPTION_ID_DEV` / `AZURE_SUBSCRIPTION_ID_PROD` — subscription IDs
- `TF_BACKEND_RESOURCE_GROUP` — state storage resource group
- `TF_BACKEND_STORAGE_ACCOUNT` — state storage account name
- `TF_BACKEND_CONTAINER_DEV` / `TF_BACKEND_CONTAINER_PROD` — state blob containers
- `TF_BACKEND_KEY_DEV` / `TF_BACKEND_KEY_PROD` — state file keys

**Environment Secrets** (Settings → Environments → `dev` / `prod` → Secrets):

- `AZURE_STATIC_WEB_APPS_API_TOKEN` — SWA deployment token (obtained from `tofu output -raw api_key`)

**Static Web App Configuration** (via staticwebapp.config.json):

- Global security headers
- HTTPS enforcement (automatic)
- Security policies

#### Network Security

- **HTTPS enforcement**: Automatic (cannot be disabled)
- **TLS version**: 1.2+ (enforced)
- **SSL certificates**: Automatic and free
- **Global CDN**: Built-in protection
- **DDoS protection**: Included

### Monitoring & Logging

#### Application Insights

**Telemetry**:

- Request rates and response times
- Failed requests
- Exceptions and traces
- Dependencies (outgoing requests)
- Custom events and metrics
- Client-side performance
- User analytics

**Availability**:

- Health check monitoring
- Endpoint availability tests
- Alert on downtime
- Global test locations

#### Static Web App Logs

**Deployment Logs**:

- Build and deployment history
- Deployment status and errors
- Available in Azure Portal

**Application Logs**:

- Integrated with Application Insights
- Custom logging from application
- Real-time log streaming

### Deployment Strategy

#### Development Workflow

1. **Continuous Deployment**:
   - Triggered by push to main
   - Automatic with approval gate
   - Latest code and features
   - Free tier (no cost)

1. **Approval Required**:
   - Prevents accidental deployments
   - Single reviewer sufficient
   - Fast iteration cycle

1. **Deployment Steps**:
   - Build validation (tests, linters)
   - Terraform validation
   - Infrastructure deployment
   - Application deployment
   - Automatic CDN distribution

#### Production Workflow

1. **Release-Based Deployment**:
   - Triggered by GitHub release
   - Specific version tags (v1.0.0)
   - Controlled releases
   - Standard tier with SLA

1. **Approval Required**:
   - Multiple reviewers recommended
   - Change management process
   - Rollback capability

1. **Deployment Steps**:
   - Extract release version
   - Build validation (tests, linters)
   - Terraform validation
   - Infrastructure deployment
   - Application deployment
   - Deployment record creation
   - Summary with version and URL

### Disaster Recovery

#### Backup Strategy

**Terraform State**:

- Stored in Azure Storage
- Versioned (soft delete enabled recommended)
- Replicated (LRS minimum, GRS recommended)

**Application Data**:

- No persistent data in Static Web Apps
- Stateless application design
- CDN caching for performance

**Configuration**:

- Infrastructure as Code (OpenTofu)
- Version controlled in Git
- Can recreate from scratch
- staticwebapp.config.json in source control

#### Recovery Procedures

**State Corruption**:

1. Check state backup versions
1. Restore from previous version
1. Re-apply if needed

**Infrastructure Loss**:

1. Verify Terraform state intact
1. Run `tofu apply`
1. Resources recreated automatically
1. Redeploy application

**Application Issues**:

1. Rollback to previous GitHub release
1. Redeploy through CI/CD
1. Or deploy previous build artifact

### Scalability

#### Automatic Scaling

**Global CDN**:

- Automatic worldwide distribution
- No configuration required
- Scales to handle traffic spikes
- Edge caching for performance

**Static Web Apps**:

- Serverless architecture
- Automatic scaling built-in
- No instance management
- Pay only for usage (Standard tier)

**No Manual Scaling Required**:

- Unlike App Services, no SKU upgrades needed
- No instance count management
- Handles traffic automatically
- Global presence out of the box

#### Performance Optimization

**CDN Caching**:

- Static assets cached at edge
- Reduced latency globally
- Automatic cache invalidation on deployment

**Compression**:

- Automatic gzip/brotli compression
- Reduced bandwidth usage
- Faster page loads

### Cost Optimization

#### Development

**Current**: $0/month (Free tier)

**Features Included**:

- 100 GB bandwidth/month
- 0.5 GB storage
- Free SSL certificates
- Global CDN
- Custom domains (2 per app)
- No commitment required

**Cost Savings**:

- Previous (App Service B1): ~$13/month
- Current (Static Web Apps Free): $0/month
- **Savings**: 100% ($13/month)

#### Production

**Current**: ~$9/month (Standard tier)

**Features Included**:

- 100 GB bandwidth/month (additional $0.15/GB)
- 0.5 GB storage
- Free SSL certificates
- Global CDN
- Custom domains (unlimited)
- SLA: 99.95% uptime
- No commitment required

**Cost Savings**:

- Previous (App Service P1v2): ~$73/month
- Current (Static Web Apps Standard): ~$9/month
- **Savings**: 88% ($64/month)

#### Total Infrastructure Cost

**Previous (App Services)**:

- Dev: ~$13/month
- Prod: ~$73/month
- **Total**: ~$86/month

**Current (Static Web Apps)**:

- Dev: $0/month
- Prod: ~$9/month
- **Total**: ~$9/month

**Overall Savings**: 90% (~$77/month or ~$924/year)

### Future Enhancements

#### Immediate Capabilities (Already Supported)

- Custom domains and SSL certificates (built-in)
- Automatic SSL renewal
- Global CDN (built-in)
- HTTPS enforcement (automatic)

#### Short Term

- Custom domain configuration for lariosincometax.com
- Enhanced monitoring alerts
- A/B testing with staging environments
- API integration (Azure Functions)

#### Medium Term

- Authentication and authorization (built-in providers)
- Preview environments for pull requests
- Advanced routing rules
- Geographic routing

#### Long Term

- API backend with Azure Functions
- Database integration for dynamic content
- User authentication system
- Form submission handling

## References

- [Azure Deployment Setup Guide](azure-deployment.md): Complete setup instructions
- [Azure Deployment Checklist](azure-checklist.md): Pre and post-deployment checklists
- [CI/CD Pipeline](ci-cd.md): Pipeline documentation
- OpenTofu Code: See `deploy/infra/` directory in repository root for infrastructure code
- [azure-static-webapp-cicd-kit](https://github.com/bit-and-byte-ideas/azure-static-webapp-cicd-kit):
  Reusable module and workflows
- [OpenTofu Documentation](https://opentofu.org/docs/)
- [Azure Static Web Apps Docs](https://docs.microsoft.com/azure/static-web-apps/)
