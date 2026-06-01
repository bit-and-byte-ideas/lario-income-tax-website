# Production Build

## Overview

This guide covers building and deploying the Larios Income Tax website for production environments.

## Build Commands

### Standard Production Build

```bash
ng build --configuration production
```

### Alternative Using NPM

```bash
npm run build
```

## Build Configuration

**Location:** `angular.json`

**Production Settings:**

```json
{
  "configurations": {
    "production": {
      "budgets": [...],
      "outputHashing": "all"
    }
  }
}
```

### Optimizations Enabled

1. **AOT Compilation** - Ahead-of-Time compilation
1. **Tree Shaking** - Removes unused code
1. **Minification** - Reduces file sizes
1. **Bundling** - Combines modules
1. **Output Hashing** - Cache busting

## Build Output

**Location:** `/dist/larios-income-tax/browser/`

**Contents:**

```text
dist/larios-income-tax/browser/
├── index.html              # Main HTML file
├── main-[hash].js          # Application bundle (~57.68 kB gzipped)
├── polyfills-[hash].js     # Polyfills bundle
├── styles-[hash].css       # Styles bundle
├── runtime-[hash].js       # Webpack runtime
└── assets/                 # Static assets
    └── favicon.ico
```

### Bundle Sizes

**Current Build:**

- **Raw Size:** 211.10 kB
- **Gzipped:** 57.68 kB
- **Build Time:** ~3.2 seconds

**Bundle Budgets:**

- Initial bundle: 500kB warning, 1MB error
- Component styles: 4kB warning, 8kB error

## Environment Configuration

### Development Environment

**File:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  // ... other dev settings
};
```

### Production Environment

**File:** `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.lariosincometax.com/api',
  // ... other prod settings
};
```

### Using Environment Variables

1. **Create `.env` file:**

   ```bash
   cp .env.example .env
   ```

1. **Edit with production values:**

   ```env
   GOOGLE_MAPS_API_KEY=your_key_here
   GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
   PROD_API_URL=https://api.lariosincometax.com/api
   ```

1. **Access in code:**

   ```typescript
   const apiKey = environment.googleMaps.apiKey;
   ```

## Build Verification

### Check Build Output

```bash
# List build files
ls -lh dist/larios-income-tax/browser/

# Check file sizes
du -sh dist/larios-income-tax/browser/*
```

### Test Locally

```bash
# Serve production build
npx http-server dist/larios-income-tax/browser -p 8080

# Open browser
open http://localhost:8080
```

### Verify Build Quality

```bash
# Check bundle sizes
ng build --configuration production --stats-json

# Analyze bundle
npx webpack-bundle-analyzer dist/larios-income-tax/browser/stats.json
```

## Deployment Methods

### 1. Azure Static Web Apps (Production)

> Recommended deployment method - Automated via GitHub Actions

The application is automatically deployed to Azure Static Web Apps when:

- **Development**: Push to `main` branch
- **Production**: Create a GitHub release

See [Azure Deployment Setup](azure-deployment-setup.md) for complete details.

**Manual deployment** (if needed):

```bash
# Build production bundle
npm run build

# Deploy using Azure CLI
az staticwebapp deploy \
  --app-id "your-static-web-app-id" \
  --resource-group rg-larios-income-tax-prod \
  --source dist/browser/
```

### 2. Local Testing

> Test production build locally

```bash
# Build production bundle
npm run build

# Serve locally with a static server
npx http-server dist/browser -p 8080

# Open http://localhost:8080
```

## Pre-deployment Checklist

- [ ] All tests passing (`ng test`)
- [ ] Production build successful
- [ ] Bundle sizes within limits
- [ ] Environment variables configured
- [ ] API endpoints updated
- [ ] Google Maps API key added
- [ ] Google Analytics configured
- [ ] No console errors in build output
- [ ] Assets loading correctly
- [ ] Routing working properly

## Performance Optimization

### Bundle Size Reduction

1. **Lazy Loading:**

   ```typescript
   const routes: Routes = [
     {
       path: 'services',
       loadChildren: () => import('./features/services/services.module').then(m => m.ServicesModule),
     },
   ];
   ```

1. **Tree Shaking:**
   - Remove unused imports
   - Use production build
   - Enable AOT compilation

1. **Code Splitting:**
   - Split large modules
   - Use dynamic imports
   - Implement lazy loading

### Runtime Performance

1. **OnPush Change Detection:**

   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

1. **Track By Functions:**

   ```typescript
   trackById(index: number, item: any): number {
     return item.id;
   }
   ```

1. **Async Pipe:**

   ```html
   {{ data$ | async }}
   ```

### Asset Optimization

1. **Image Optimization:**
   - Compress images
   - Use WebP format
   - Implement lazy loading

1. **Font Optimization:**
   - Subset fonts
   - Use font-display: swap
   - Preload critical fonts

## Security Hardening

### Content Security Policy

Add to `index.html`:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
/>
```

### HTTP Headers

Configure in Nginx:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

### Remove Debug Code

Ensure no debug statements in production:

```typescript
// Remove or guard these:
console.log();
console.debug();
debugger;
```

## Monitoring

### Application Monitoring

1. **Google Analytics:**
   - Configured in `environment.prod.ts`
   - Track page views and events

1. **Error Tracking:**
   - Implement error interceptor
   - Log to monitoring service (Sentry, etc.)

1. **Performance Monitoring:**
   - Use Chrome Lighthouse
   - Monitor Core Web Vitals
   - Track bundle sizes

### Deployment Monitoring

1. **Azure Static Web Apps:**

   ```bash
   # Check deployment status
   az staticwebapp show \
     --name swa-larios-income-tax-prod \
     --resource-group rg-larios-income-tax-prod
   ```

1. **Application Insights:**

   ```bash
   # Query recent requests
   az monitor app-insights query \
     --app appi-larios-income-tax-prod \
     --resource-group rg-larios-income-tax-prod \
     --analytics-query "requests | where timestamp > ago(1h)"
   ```

1. **GitHub Actions:**
   - Check workflow runs at: `https://github.com/your-org/repo/actions`
   - Review deployment logs for errors

## Rollback Strategy

### Production Rollback

To rollback a production deployment:

1. **Redeploy Previous Release:**

   ```bash
   # Checkout previous release tag
   git checkout v1.0.0

   # Create new release from that tag
   # GitHub Actions will automatically deploy
   ```

2. **Via GitHub Actions:**
   - Navigate to Actions → Deploy to Production
   - Re-run a previous successful workflow

### Development Rollback

```bash
# Revert to previous commit
git revert HEAD

# Push to main (triggers auto-deployment)
git push origin main
```

See [Azure Deployment Checklist](azure-deployment-checklist.md) for emergency procedures.

## CI/CD Pipeline

### Automated Deployment

The project uses GitHub Actions for automated deployments:

- **Development**: `.github/workflows/deploy-dev.yml`
  - Triggered on push to `main`
  - Deploys to Free tier Static Web App

- **Production**: `.github/workflows/deploy-prod.yml`
  - Triggered on GitHub release creation
  - Deploys to Standard tier Static Web App
  - Requires approval gate

**Pipeline Steps:**

1. Build and validate (tests, linters)
2. Terraform validate
3. Deploy infrastructure (Terraform)
4. Deploy application (Azure Static Web Apps)

See [CI/CD Pipeline](ci-cd.md) for complete documentation.

## Troubleshooting

### Build Fails

**Issue:** Production build fails

**Solutions:**

```bash
# Clear cache
rm -rf .angular dist node_modules
npm install
npm run build
```

### Bundle Too Large

**Issue:** Exceeds budget limits

**Solutions:**

1. Implement lazy loading
1. Remove unused dependencies
1. Optimize images and assets
1. Use dynamic imports

### Assets Not Loading

**Issue:** 404 errors for assets

**Solutions:**

1. Check `base href` in index.html
1. Verify Nginx configuration
1. Check asset paths in code
1. Ensure `outputPath` is correct

## Best Practices

1. **Always test production build locally first**
1. **Use environment-specific configurations**
1. **Enable all optimizations for production**
1. **Monitor bundle sizes**
1. **Implement proper error handling**
1. **Use CDN for static assets**
1. **Enable gzip/brotli compression**
1. **Set up proper caching headers**
1. **Monitor application performance**
1. **Have a rollback plan**

## Resources

- [Angular Production Guide](https://angular.dev/tools/cli/build)
- [Deployment Documentation](https://angular.dev/tools/cli/deployment)
- [Performance Optimization](https://web.dev/articles/vitals)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure Deployment Setup](azure-deployment-setup.md)
- [CI/CD Pipeline](ci-cd.md)
