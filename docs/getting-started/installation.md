# Setup Guide

## Quick Start

Follow these steps to get the Larios Income Tax website up and running:

### 1. Local Development

```bash
# Install dependencies (already done if you see node_modules)
npm install

# Start development server
ng serve

# Open browser to http://localhost:4200
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
# - Add Google Maps API key
# - Add Google Analytics ID
# - Configure API endpoints
```

## Verification Checklist

After setup, verify:

- [ ] Development server starts without errors (`ng serve`)
- [ ] Application loads at <http://localhost:4200>
- [ ] No console errors in browser
- [ ] Production build completes successfully (`npm run build`)
- [ ] All tests pass (`npm test`)

## Next Steps for Development

### 1. Create Feature Modules

Generate feature modules for each section:

```bash
# Home page
ng generate module features/home --routing

# Services page
ng generate module features/services --routing

# Contact page
ng generate module features/contact --routing

# About page
ng generate module features/about --routing
```

### 2. Create Components

Generate components within feature modules:

```bash
# Example: Home page component
ng generate component features/home/components/hero
ng generate component features/home/components/services-overview
```

### 3. Set Up Routing

Configure lazy loading in `src/app/app.routes.ts`:

```typescript
export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'services',
    loadChildren: () => import('./features/services/services.module').then(m => m.ServicesModule),
  },
  // ... more routes
];
```

### 4. Styling

Update `src/styles.css` with the warm, professional color scheme:

- Cream/off-white backgrounds
- Earth tone accents (tans, browns)
- Professional typography

### 5. Add Business Content

Use the information from [project-info.md](project-info.md):

- Business name: Larios Income Tax
- Address: 3317 El Cajon Blvd, San Diego, CA 92104
- Phone: +1 (619) 972-3350
- Services: Income Tax and Immigration

## Troubleshooting

### Port 4200 already in use

```bash
# Use a different port
ng serve --port 4300
```

### Module not found errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Commands](https://angular.dev/tools/cli)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [project-info.md](project-info.md) - Detailed migration notes
