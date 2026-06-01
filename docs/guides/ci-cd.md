# CI/CD Pipeline

## Overview

This project uses GitHub Actions for continuous integration and deployment to Azure Static Web Apps.
Workflows are split by concern: CI checks run on every PR, infrastructure is managed independently of
application deploys, and an OPA policy gate prevents mixing dev and prod infra changes in one PR.

## Workflows

### 1. CI

**File:** `.github/workflows/ci.yaml`

**Trigger:** Pull requests to `main`

**Jobs:**

1. **Format** - Prettier formatting check
1. **Lint** - Markdown linting (`npm run lint:md`)
1. **Test** - Unit tests (`npm test`)
1. **Build** - Bilingual production build (`npm run build:i18n`), artifact uploaded

**Status:** All jobs must pass before merge

### 2. Policy Checks

**File:** `.github/workflows/policy-checks.yaml`

**Trigger:** Pull requests to `main`

**Jobs:**

1. **OPA policy tests** - Runs `opa test policy/ --verbose` to validate the Rego unit tests
1. **PR policy check** - Fetches changed files, evaluates `data.pr_checks.deny`:
   - Denies PRs that touch both `deploy/infra/dev/` and `deploy/infra/prod/` simultaneously

### 3. Deploy Infrastructure (dev)

**File:** `.github/workflows/deploy-infra-dev.yaml`

**Trigger:** Push to `main` and pull requests to `main`

**Jobs:** Delegates entirely to the reusable workflow at
`bit-and-byte-ideas/azure-static-webapp-cicd-kit/.github/workflows/opentofu.yml@main`

1. **Validate** - `tofu fmt -check`, `tofu init -backend=false`, `tofu validate`
1. **Plan** - OIDC login to Azure, `tofu init` with remote backend, `tofu plan -detailed-exitcode`
1. **Apply** - Downloads plan artifact, applies changes — **gated by `dev` environment approval**,
   **skipped on pull_request events**

**Working directory:** `deploy/infra/dev`

### 4. Deploy Infrastructure (prod)

**File:** `.github/workflows/deploy-infra-prod.yaml`

**Trigger:** Push to `main` only (no PR trigger)

**Jobs:** Same reusable workflow as dev, working directory `deploy/infra/prod`, environment `prod`

### 5. Deploy App (dev)

**File:** `.github/workflows/deploy-app-dev.yaml`

**Trigger:** Push to `main`

**Jobs:**

1. Build bilingual Angular app (`npm run build:i18n`)
1. Copy `staticwebapp.config.json` into `dist/larios-income-tax/browser/`
1. Deploy to Azure Static Web Apps (`Azure/static-web-apps-deploy@v1`)

**Environment:** `dev` — reads `AZURE_STATIC_WEB_APPS_API_TOKEN` from environment secret

### 6. Deploy App (prod)

**File:** `.github/workflows/deploy-app-prod.yaml`

**Trigger:** GitHub Release published

**Jobs:** Same as dev but targeting `prod` environment

### 7. TechDocs Validation

**File:** `.github/workflows/techdocs.yml`

**Trigger:**

- Pull requests affecting `docs/`, `mkdocs.yml`, `catalog-info.yaml`
- Push to main (docs changes)

**Jobs:**

1. Validate YAML syntax
1. Build documentation with MkDocs (`--strict`)
1. Check for broken links (Python resolver)
1. Lint markdown files
1. Upload site artifact

## Repository Variables and Secrets

Workflows authenticate to Azure via OIDC — no client secrets required.
Non-sensitive IDs are stored as **repository variables** (`vars.*`).
Sensitive tokens are stored as **environment secrets** (`secrets.*`).

### Repository Variables (Settings → Secrets and variables → Actions → Variables)

#### Azure Identity

| Variable                     | Description                             | Required By                                   |
| ---------------------------- | --------------------------------------- | --------------------------------------------- |
| `AZURE_CLIENT_ID_DEV`        | Client ID of the dev service principal  | deploy-infra-dev.yaml                         |
| `AZURE_CLIENT_ID_PROD`       | Client ID of the prod service principal | deploy-infra-prod.yaml                        |
| `AZURE_TENANT_ID`            | Azure Active Directory tenant ID        | deploy-infra-dev.yaml, deploy-infra-prod.yaml |
| `AZURE_SUBSCRIPTION_ID_DEV`  | Azure subscription ID for dev           | deploy-infra-dev.yaml                         |
| `AZURE_SUBSCRIPTION_ID_PROD` | Azure subscription ID for prod          | deploy-infra-prod.yaml                        |

#### OpenTofu Backend

| Variable                     | Description                                            | Required By                                   |
| ---------------------------- | ------------------------------------------------------ | --------------------------------------------- |
| `TF_BACKEND_RESOURCE_GROUP`  | Resource group of the state storage                    | deploy-infra-dev.yaml, deploy-infra-prod.yaml |
| `TF_BACKEND_STORAGE_ACCOUNT` | Storage account name                                   | deploy-infra-dev.yaml, deploy-infra-prod.yaml |
| `TF_BACKEND_CONTAINER_DEV`   | Blob container for dev state                           | deploy-infra-dev.yaml                         |
| `TF_BACKEND_CONTAINER_PROD`  | Blob container for prod state                          | deploy-infra-prod.yaml                        |
| `TF_BACKEND_KEY_DEV`         | State file key (e.g. `larios-income-tax-dev.tfstate`)  | deploy-infra-dev.yaml                         |
| `TF_BACKEND_KEY_PROD`        | State file key (e.g. `larios-income-tax-prod.tfstate`) | deploy-infra-prod.yaml                        |

### Environment Secrets (Settings → Environments → `dev` / `prod` → Secrets)

| Secret                            | Description              | Required By              |
| --------------------------------- | ------------------------ | ------------------------ |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | SWA deployment API token | deploy-app-dev/prod.yaml |

The token value comes from `tofu output -raw api_key` after the first infra deployment.
See [Azure Deployment Setup](azure-deployment.md) for the initial setup walkthrough.

## Workflow Details

### CI Workflow

```yaml
on:
  pull_request:
    branches: [main]

jobs:
  format: # npm run format:check
  lint: # npm run lint:md
  test: # npm test
  build: # npm run build:i18n
```

**Checks performed:**

- ✅ Code formatting (Prettier)
- ✅ Markdown linting
- ✅ Unit tests pass
- ✅ Bilingual production build succeeds (en-US + es-MX)

### Infrastructure Workflows

```yaml
# deploy-infra-dev.yaml
jobs:
  opentofu:
    uses: bit-and-byte-ideas/azure-static-webapp-cicd-kit/.github/workflows/opentofu.yml@main
    with:
      working_directory: deploy/infra/dev
      environment: dev
```

The reusable workflow runs three sequential jobs:

| Job      | Runs on   | Azure auth | Effect                                                         |
| -------- | --------- | ---------- | -------------------------------------------------------------- |
| validate | PR + push | No         | Format check, init (no backend), validate                      |
| plan     | PR + push | Yes (OIDC) | Init with backend, plan, upload plan artifact                  |
| apply    | Push only | Yes (OIDC) | Download artifact, apply — requires `dev` environment approval |

### App Deployment Workflows

```yaml
# deploy-app-dev.yaml
jobs:
  deploy:
    environment: dev
    steps:
      - npm run build:i18n
      - cp staticwebapp.config.json dist/larios-income-tax/browser/
      - Azure/static-web-apps-deploy@v1
        app_location: dist/larios-income-tax/browser
```

## Deployment Process

### Automatic Deployment to Development

**On merge to main:**

1. `ci.yaml` and `policy-checks.yaml` must have passed on the PR
1. Code merged to main
1. `deploy-infra-dev.yaml` runs validate → plan → apply (apply requires `dev` environment approval if
   changes detected)
1. `deploy-app-dev.yaml` runs in parallel: builds and deploys the Angular app
1. Automatic global CDN distribution

### Automatic Deployment to Production

**On GitHub Release:**

1. Create GitHub Release with version tag (e.g., `v1.0.0`)
1. `deploy-infra-prod.yaml` triggers: validate → plan → apply (requires `prod` environment approval)
1. `deploy-app-prod.yaml` triggers: build + deploy

### Creating Releases

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

Then create a GitHub Release from the tag — both prod workflows trigger automatically.

## Accessing Deployments

### Development Environment

**URL:** `https://swa-larios-income-tax-dev-*.azurestaticapps.net`

- Automatically deployed on push to main
- Free tier Static Web App
- Global CDN distribution

### Production Environment

**URL:** `https://swa-larios-income-tax-prod-*.azurestaticapps.net`

- Deployed via GitHub Releases
- Standard tier Static Web App with SLA
- Custom domain: `www.lariosincometax.com`
- Global CDN distribution

## Cache Management

Workflows use GitHub Actions cache for NPM dependencies (`cache: 'npm'`).
OpenTofu provider binaries are cached automatically by `opentofu/setup-opentofu@v1`.

If builds fail due to cache issues, navigate to **Actions → Caches** and delete the affected entry.

## Build Artifacts

| Workflow              | Artifact      | Retention |
| --------------------- | ------------- | --------- |
| `ci.yaml`             | dist          | 7 days    |
| `techdocs.yml`        | techdocs-site | 7 days    |
| `deploy-infra-*.yaml` | tfplan        | 1 day     |

## Troubleshooting

### CI Fails on PR

Run checks locally:

```bash
npm run format:check
npm run lint:md
npm test
npm run build:i18n
```

### OpenTofu Validation Fails

Validate locally:

```bash
cd deploy/infra/dev
tofu init -backend=false
tofu validate
tofu fmt -check
```

### Infrastructure Apply Fails

1. Check OIDC federated credentials are configured on the service principal
1. Verify repository variables (`AZURE_CLIENT_ID_DEV`, `AZURE_TENANT_ID`, etc.)
1. Review `plan` job logs for the error before the apply step
1. Check Azure RBAC permissions on the service principal

### Deployment to Azure Fails

1. Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` secret is set in the GitHub environment (`dev` or `prod`)
1. Confirm the Static Web App exists (infra must be deployed first)
1. Check build output path — should be `dist/larios-income-tax/browser`
1. Verify `staticwebapp.config.json` exists in the repo root

### OPA Policy Blocks PR

If `policy-checks.yaml` denies your PR, you are likely touching both `deploy/infra/dev/` and
`deploy/infra/prod/` in the same PR. Split the infra changes into two separate PRs — one per
environment.

### Tests Failing in CI

1. Check Node.js version (should be 20)
1. Verify all dependencies are in `package.json`
1. Run `npm test` locally with the same Node version
1. Review test logs in the workflow run

## Maintenance

### Regular Tasks

1. **Update dependencies** — Review Dependabot PRs, update Node.js and GitHub Actions versions
1. **Monitor Azure resources** — Review Static Web Apps usage, bandwidth, deployment history
1. **Review workflows** — Check execution times, optimize slow jobs
1. **Security** — Review service principal RBAC permissions periodically

## Deployment Architecture

See the `cicd-flow-diagram.drawio.xml` file in the project repository for the complete CI/CD flow
diagram.

### Azure Static Web Apps Resources

#### Development Environment

- Resource Group: `rg-larios-income-tax-dev`
- Static Web App: `swa-larios-income-tax-dev` (Free tier)
- Managed by: `deploy/infra/dev/`

#### Production Environment

- Resource Group: `rg-larios-income-tax-prod`
- Static Web App: `swa-larios-income-tax-prod` (Standard tier)
- Custom domain: `www.lariosincometax.com`
- Managed by: `deploy/infra/prod/`

### GitHub Environments

**Development (`dev`):**

- Required reviewers on the `apply` job
- Deployment branch: `main`

**Production (`prod`):**

- Required reviewers (recommend 2+ for production)
- Deployment branch: `main` (triggered by release publish)

### Rollback Strategy

1. **Redeploy a previous release** — Go to repository → Releases → find last working release →
   re-publish it (triggers `deploy-app-prod.yaml`)
1. **Via GitHub Actions** — Go to Actions → Deploy App (prod) → find last successful run →
   Re-run all jobs

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [OpenTofu Documentation](https://opentofu.org/docs/)
- [azure-static-webapp-cicd-kit](https://github.com/bit-and-byte-ideas/azure-static-webapp-cicd-kit)
- [Azure Infrastructure Architecture](azure-infrastructure.md)
- [Azure Deployment Setup Guide](azure-deployment.md)
- [Azure Deployment Checklist](azure-checklist.md)
- Workflow Files: See `.github/workflows/` directory in repository root
