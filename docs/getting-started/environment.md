# Environment Configuration

## Overview

Environment-specific settings allow different configurations for development, testing, and production
environments.

## Environment Files

### Development Environment

**File:** `src/environments/environment.ts`

**Purpose:** Local development settings

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  businessInfo: {
    name: 'Larios Income Tax',
    phone: '+1 (619) 972-3350',
    email: 'info@lariosincometax.com',
    address: {
      street: '3317 El Cajon Blvd',
      city: 'San Diego',
      state: 'CA',
      zip: '92104',
    },
  },
  googleMaps: {
    apiKey: '',
    defaultZoom: 15,
  },
  analytics: {
    enabled: false,
    trackingId: '',
  },
};
```

### Production Environment

**File:** `src/environments/environment.prod.ts`

**Purpose:** Production deployment settings

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.lariosincometax.com/api',
  businessInfo: {
    // Same as development
  },
  googleMaps: {
    apiKey: '', // Add from .env
    defaultZoom: 15,
  },
  analytics: {
    enabled: true,
    trackingId: '', // Add from .env
  },
};
```

## Environment Variables (.env)

### Setup

1. **Copy template:**

   ```bash
   cp .env.example .env
   ```

1. **Edit with your values:**

   ```env
   # API Configuration
   API_URL=http://localhost:3000/api
   PROD_API_URL=https://api.lariosincometax.com/api

   # Google Maps API Key
   GOOGLE_MAPS_API_KEY=your_api_key_here

   # Google Analytics
   GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X

   # Contact Email
   CONTACT_EMAIL=info@lariosincometax.com
   ```

1. **Never commit `.env` to version control**

   (Already in `.gitignore`)

### Template File

**File:** `.env.example`

Contains example values and documentation for all environment variables.

## Usage in Code

### Import Environment

```typescript
import { environment } from '../environments/environment';
```

### Access Configuration

```typescript
// In service
constructor(private http: HttpClient) {}

getData() {
  return this.http.get(`${environment.apiUrl}/data`);
}

// In component
ngOnInit() {
  console.log('Production:', environment.production);
  this.loadGoogleMaps(environment.googleMaps.apiKey);
}
```

### Business Information

```typescript
export class ContactComponent {
  businessInfo = environment.businessInfo;
}
```

Template:

```html
<p>{{ businessInfo.name }}</p>
<p>{{ businessInfo.phone }}</p>
<address>
  {{ businessInfo.address.street }}<br />
  {{ businessInfo.address.city }}, {{ businessInfo.address.state }} {{ businessInfo.address.zip }}
</address>
```

## Configuration Values

### API Endpoints

**Development:**

- Local backend: `http://localhost:3000/api`
- Mock API: `http://localhost:3001/api`

**Production:**

- Live API: `https://api.lariosincometax.com/api`

### Google Maps

**API Key Required For:**

- Location map on contact page
- Distance calculations
- Geocoding

**Get API Key:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
1. Create/select project
1. Enable Maps JavaScript API
1. Create credentials (API Key)
1. Restrict key to your domain

**Usage:**

```typescript
loadMap() {
  const { apiKey, defaultZoom } = environment.googleMaps;
  // Initialize map
}
```

### Google Analytics

**Setup:**

1. Create Google Analytics property
1. Get tracking ID (UA-XXXXXXXXX-X or G-XXXXXXXXXX)
1. Add to environment configuration

**Implementation:**

```typescript
if (environment.analytics.enabled) {
  initializeAnalytics(environment.analytics.trackingId);
}
```

### Business Contact Information

**Used For:**

- Contact page
- Footer
- Metadata
- Structured data (SEO)

**Centralized Configuration:**

All business info in one place for easy updates.

## Build-time vs Runtime

### Build-time Configuration

**Environment Files:**

- Bundled into application
- Cannot change after build
- Type-safe access
- Good for: API URLs, feature flags

**Usage:**

```bash
ng build --configuration production
```

### Runtime Configuration

**For values that change after deployment:**

1. **Config Service:**

   ```typescript
   @Injectable({ providedIn: 'root' })
   export class ConfigService {
     private config: Config;

     loadConfig() {
       return this.http.get<Config>('/assets/config.json').pipe(tap(config => (this.config = config)));
     }
   }
   ```

1. **APP_INITIALIZER:**

   ```typescript
   export function initConfig(configService: ConfigService) {
     return () => configService.loadConfig();
   }

   @NgModule({
     providers: [{
       provide: APP_INITIALIZER,
       useFactory: initConfig,
       deps: [ConfigService],
       multi: true
     }]
   })
   ```

## Multiple Environments

### Adding Staging Environment

1. **Create file:** `src/environments/environment.staging.ts`

   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'https://staging-api.lariosincometax.com/api',
     // ... other staging settings
   };
   ```

1. **Update `angular.json`:**

   ```json
   {
     "configurations": {
       "staging": {
         "fileReplacements": [
           {
             "replace": "src/environments/environment.ts",
             "with": "src/environments/environment.staging.ts"
           }
         ]
       }
     }
   }
   ```

1. **Build for staging:**

   ```bash
   ng build --configuration staging
   ```

## Security Best Practices

### Sensitive Data

**Never commit:**

- API keys
- Passwords
- Tokens
- Private keys

**Use `.env` files:**

- Keep in `.gitignore`
- Document in `.env.example`
- Load at build/runtime

### API Key Security

**Client-side Limitations:**

- Keys visible in browser
- Can be extracted from bundles
- Restrict by domain/referrer
- Use API gateway for sensitive operations

**Best Practices:**

1. Restrict API keys by domain
1. Set usage quotas
1. Monitor usage
1. Use backend proxy for sensitive APIs

## Configuration Checklist

### Development

- [ ] API URL points to local backend
- [ ] Google Maps key (optional for dev)
- [ ] Analytics disabled
- [ ] Debug mode enabled
- [ ] Mock data available

### Staging

- [ ] API URL points to staging backend
- [ ] Test Google Maps key
- [ ] Analytics enabled (test property)
- [ ] Similar to production
- [ ] Test data available

### Production

- [ ] API URL points to production backend
- [ ] Production Google Maps key
- [ ] Production Analytics ID
- [ ] Debug mode disabled
- [ ] Error tracking enabled
- [ ] Performance monitoring enabled
- [ ] CDN configured
- [ ] Cache headers set

## Environment-specific Features

### Feature Flags

```typescript
export const environment = {
  features: {
    enableNewContactForm: false,
    enableChatSupport: true,
    enableAdvancedSearch: false,
  },
};
```

**Usage:**

```typescript
if (environment.features.enableNewContactForm) {
  // Show new form
}
```

### Debug Settings

```typescript
export const environment = {
  production: false,
  debug: {
    logLevel: 'debug',
    showNetworkCalls: true,
    mockBackend: false,
  },
};
```

## Validation

### Type Safety

Create interface for environment:

```typescript
export interface Environment {
  production: boolean;
  apiUrl: string;
  businessInfo: {
    name: string;
    phone: string;
    // ...
  };
  // ...
}

export const environment: Environment = {
  // Type-checked configuration
};
```

### Runtime Validation

```typescript
export function validateEnvironment(env: Environment): void {
  if (!env.apiUrl) {
    throw new Error('API URL is required');
  }
  if (env.production && !env.analytics.trackingId) {
    console.warn('Analytics tracking ID missing in production');
  }
}
```

## Troubleshooting

### Wrong Environment Loaded

**Issue:** Development config in production build

**Solution:**

```bash
# Explicitly specify configuration
ng build --configuration production

# Verify environment
cat dist/larios-income-tax/browser/main-*.js | grep "production"
```

### Missing Environment Variable

**Issue:** Undefined configuration value

**Solutions:**

1. Check file exists: `src/environments/environment.ts`
1. Verify import path
1. Rebuild application
1. Check `.env` file exists and is loaded

### API Key Not Working

**Issue:** Google Maps/Analytics not loading

**Solutions:**

1. Verify key in `.env` file
1. Check key restrictions
1. Ensure domain is whitelisted
1. Monitor quota usage
1. Check browser console for errors

## Resources

- [Angular Environment Configuration](https://angular.dev/tools/cli/environments)
- [Google Maps API](https://developers.google.com/maps)
- [Google Analytics](https://analytics.google.com/)
- [.env File Best Practices](https://12factor.net/config)
