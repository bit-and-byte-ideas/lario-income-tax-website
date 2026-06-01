# Architecture

## Overview

The Larios Income Tax website follows Angular best practices with a modular, scalable architecture
designed for maintainability and performance.

## Project Structure

```text
src/
├── app/
│   ├── core/           # Singleton services, guards, interceptors
│   ├── shared/         # Shared components, directives, pipes
│   ├── features/       # Feature modules (home, services, contact, about)
│   └── app.ts          # Root component
├── environments/       # Environment configurations
└── styles.css          # Global styles
```

## Module Organization

### Core Module

The Core Module contains singleton services that should be loaded only once in the application.

**Location:** `src/app/core/`

**Contents:**

- **services/** - Singleton services (authentication, API, logging)
- **guards/** - Route guards (auth guard, role guard)
- **interceptors/** - HTTP interceptors (token, error handling)

**Usage:** Import only once in the root AppModule. Never import in feature modules.

```typescript
import { CoreModule } from './core/core.module';

@NgModule({
  imports: [CoreModule, ...]
})
export class AppModule { }
```

### Shared Module

The Shared Module contains reusable components, directives, and pipes used across feature modules.

**Location:** `src/app/shared/`

**Contents:**

- **components/** - Reusable UI components (buttons, cards, modals)
- **directives/** - Custom directives (highlight, tooltip)
- **pipes/** - Custom pipes (date formatting, text transforms)

**Usage:** Import in any feature module that needs shared functionality.

```typescript
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SharedModule, ...]
})
export class FeatureModule { }
```

**Implemented Shared Components:**

- **Header** - Two-tier responsive header with navigation and dropdown menu
  - Top section: Logo and business title
  - Bottom section: Navigation with Contact dropdown (United States/Mexico), email, phone, social media icons
  - Sticky positioning for persistent access
- **Footer** - Two-tier footer with business locations and copyright
  - Top section: Dual location display (San Diego, CA and Tijuana, B.C.)
  - Bottom section: Dynamic copyright notice (automatically updates year)
- **SafePipe** - Custom pipe for sanitizing URLs (Google Maps iframes)
- **Social Media Constants** - Frozen constants for Facebook and Instagram URLs

### Feature Modules

Feature modules encapsulate distinct application features with lazy loading for optimal performance.

**Location:** `src/app/features/`

**Implemented Features:**

- **home/** - Landing page with parallax hero section, services overview, and contact form
  - Hero component with smooth scroll navigation
  - Services overview showcasing three main services
  - Contact section with dual location display and social media integration
- **services/** - Comprehensive service information and detail pages
  - Services listing page with all available services
  - Dynamic service detail pages for each service type (Tax Preparation, Immigration Services, Translations, ITINs, etc.)
  - Service-specific SEO metadata and structured data
- **book-online/** - _(Temporarily disabled - will be re-enabled in the future)_
  - Booking functionality temporarily disabled
  - Service detail pages moved to `/services/:id` route
- **contact/** - Bilingual contact pages with location-specific data
  - United States contact page (English)
  - Mexico contact page (Spanish)
  - Google Maps integration with location-specific coordinates
  - Reactive contact form with validation

**Structure Example:**

```text
features/
├── home/
│   ├── pages/home-page/
│   └── components/
│       ├── hero/
│       ├── services-overview/
│       └── contact-section/
├── services/
│   └── pages/
│       ├── services-page/
│       └── service-detail-page/
├── book-online/  (temporarily disabled)
│   └── pages/
│       └── book-online-page/
└── contact/
    └── pages/contact-page/
```

**Lazy Loading with Standalone Components:**

```typescript
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home-page/home-page').then(m => m.HomePage),
  },
  {
    path: 'services',
    loadComponent: () => import('./features/services/pages/services-page/services-page').then(m => m.ServicesPage),
  },
  {
    path: 'services/:id',
    loadComponent: () =>
      import('./features/services/pages/service-detail-page/service-detail-page').then(m => m.ServiceDetailPage),
  },
  // Temporarily disabled - booking functionality will be re-enabled in the future
  // {
  //   path: 'book-online',
  //   loadComponent: () =>
  //     import('./features/book-online/pages/book-online-page/book-online-page').then(m => m.BookOnlinePage),
  // },
  {
    path: 'contact',
    redirectTo: 'contact/united-states',
    pathMatch: 'full',
  },
  {
    path: 'contact/:location',
    loadComponent: () => import('./features/contact/pages/contact-page/contact-page').then(m => m.ContactPage),
  },
];
```

## Design Patterns

### Singleton Pattern

Used for core services (API, authentication, logging) to ensure single instance across app.

### Lazy Loading Pattern

Feature modules are lazy loaded using standalone components to reduce initial bundle size and improve load time.

### Standalone Components

The application uses Angular's standalone component pattern (no NgModules) for:

- Simpler component architecture
- Better tree-shaking
- Reduced boilerplate
- Direct imports in component metadata

### Module Pattern

Clear separation between core, shared, and feature modules for better organization.

### Component Communication

- **Input/Output** - Parent-child communication
- **Services** - Cross-component communication
- **RxJS Subjects** - Complex state management

### Internationalization (i18n)

Implemented through location-based routing and data structures:

- English content for United States location
- Spanish content for Mexico location
- Bilingual labels stored in component data structures
- Dynamic content switching based on route parameters

## Routing Strategy

- **Hash-based routing** not used (cleaner URLs)
- **Lazy loading** for all feature modules
- **Route guards** for protected routes
- **Preloading strategy** for improved UX

## State Management

Currently using Angular services for state management. Can be upgraded to NgRx if complexity grows.

## Build Configuration

### Development

- Source maps enabled
- No optimization
- Fast rebuilds

### Production

- AOT compilation
- Tree shaking
- Minification
- Bundle budgets enforced (500kB warning, 1MB error)

## Performance Optimizations

1. **Lazy Loading** - Feature modules loaded on demand
1. **OnPush Change Detection** - For performance-critical components
1. **TrackBy Functions** - In ngFor loops
1. **Async Pipe** - Automatic subscription management
1. **Production Build** - AOT, minification, tree shaking

## Security Considerations

- **XSS Protection** - Angular sanitizes templates by default
- **CSRF Protection** - Implement in API interceptor
- **Content Security Policy** - Configure in Nginx
- **Strict TypeScript** - Enabled for type safety

## Testing Strategy

- **Unit Tests** - Vitest for component and service testing
- **E2E Tests** - Framework TBD (Cypress or Playwright recommended)
- **Code Coverage** - Target 80%+ coverage

## Scalability

The architecture supports growth through:

- Modular feature organization
- Lazy loading for performance
- Clear separation of concerns
- Reusable shared components
- Service-based state management

## Guidelines

- **Core Module:** Import only once, contains singletons
- **Shared Module:** Import in features, contains reusables
- **Feature Modules:** Use lazy loading for optimal performance
- **Styling:** Follow warm, professional aesthetic
- **Responsive Design:** Mobile-first approach with accessibility
