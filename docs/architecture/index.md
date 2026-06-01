# Architecture

This section documents the project structure, design patterns, and technical architecture of the Larios Income Tax website.

## Overview

The Larios Income Tax website is an Angular 21 application built with a feature-based modular architecture.
It emphasizes clean separation of concerns, reusability, and maintainability.

## Key Principles

- **Feature-Based Organization** — Code organized by feature (home, services, contact) rather than type
- **Lazy Loading** — Feature modules loaded on-demand to reduce initial bundle size
- **Single Responsibility** — Each module, component, and service has one clear purpose
- **Reusable Shared Code** — Common components, pipes, and utilities in a `shared` folder
- **Type Safety** — Full TypeScript with strict mode for compile-time error detection
- **Internationalization** — Full bilingual support (en-US and es-MX) built in from the start

## Directory Structure

```text
src/
├── app/
│   ├── features/              # Feature modules (lazy-loaded)
│   │   ├── home/              # Home page
│   │   │   ├── components/    # Hero, ServicesOverview, ContactSection
│   │   │   ├── pages/         # HomePage
│   │   │   ├── services/      # Feature services (if needed)
│   │   │   └── home-routing.module.ts
│   │   ├── services/          # Services listing and details
│   │   │   ├── components/    # ServiceCard, ServiceDetails
│   │   │   ├── pages/         # ServicesPage, ServiceDetailPage
│   │   │   └── services-routing.module.ts
│   │   ├── contact/           # Contact pages (bilingual)
│   │   │   ├── components/    # ContactForm
│   │   │   ├── pages/         # ContactPage
│   │   │   └── contact-routing.module.ts
│   │   └── ...
│   │
│   ├── shared/                # Shared across all features
│   │   ├── components/        # Header, Footer, Layout
│   │   ├── pipes/             # Custom pipes (SafePipe)
│   │   ├── services/          # Shared services (SeoService, etc.)
│   │   ├── constants/         # Services catalog, social media links
│   │   ├── models/            # TypeScript interfaces
│   │   └── index.ts           # Barrel export
│   │
│   ├── core/                  # (Optional) Core services, guards
│   │   └── ...
│   │
│   ├── app.ts                 # Root component
│   ├── app-routing.module.ts  # Main routing configuration
│   └── app.config.ts          # Application configuration
│
├── locale/                    # Translation files (i18n)
│   ├── messages.xlf           # English source strings (auto-generated)
│   └── messages.es-MX.xlf     # Spanish translations (manual)
│
├── environments/              # Environment-specific configs
│   ├── environment.ts         # Development
│   └── environment.prod.ts    # Production
│
├── styles.css                 # Global styles with CSS variables
└── main.ts                    # Application entry point
```

## Module Architecture

### Feature Modules

Each feature is a self-contained module with:

- **Components** — UI components specific to the feature
- **Pages** — Full page components
- **Services** — Feature-specific business logic
- **Routing** — Feature routes (lazy-loaded by parent router)

**Example Structure:**

```text
features/services/
├── components/
│   ├── service-card/
│   │   ├── service-card.component.ts
│   │   ├── service-card.component.html
│   │   ├── service-card.component.scss
│   │   └── service-card.component.spec.ts
│   └── ...
├── pages/
│   ├── services-page/
│   │   ├── services-page.component.ts
│   │   ├── services-page.component.html
│   │   ├── services-page.component.scss
│   │   └── services-page.component.spec.ts
│   └── service-detail-page/
│       ├── service-detail-page.component.ts
│       ├── service-detail-page.component.html
│       ├── service-detail-page.component.scss
│       └── service-detail-page.component.spec.ts
├── services/
│   ├── services.service.ts
│   └── services.service.spec.ts
├── services.module.ts
├── services-routing.module.ts
└── index.ts
```

### Shared Module

The shared module exports:

- **CommonModule** — `*ngIf`, `*ngFor`, etc.
- **Components** — Header, Footer (used across pages)
- **Pipes** — Custom pipes (SafePipe for iframe URLs)
- **Services** — SeoService, ConfigService
- **Constants** — Services catalog, social media links

### Lazy Loading

Feature modules are lazy-loaded to improve initial load time:

```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'services',
    loadChildren: () => import('./features/services/services.module').then(m => m.ServicesModule),
  },
  {
    path: 'contact',
    loadChildren: () => import('./features/contact/contact.module').then(m => m.ContactModule),
  },
];
```

## Key Design Patterns

### Reactive Forms

Contact and service forms use Angular's ReactiveFormsModule:

```typescript
this.form = this.fb.group({
  name: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  message: ['', [Validators.required]],
});
```

### Custom Pipes

SafePipe is used to safely render iframe URLs:

```typescript
// In template
<iframe [src]="mapUrl | safe: 'resourceUrl'"></iframe>
```

### Constants Over Magic Values

Services, social media, and configuration are centralized:

```typescript
// src/app/shared/constants/services.constants.ts
export const BUSINESS_SERVICES: readonly Service[] = [
  { id: 'tax-preparation', ... },
  { ... }
];

// Usage in components
const services = getAllServices();
```

### Dependency Injection

Services are provided at appropriate levels:

```typescript
// Singleton service (provided in root)
@Injectable({ providedIn: 'root' })
export class SeoService {}

// Feature-specific service
@Injectable()
export class ServicesService {}
```

## Internationalization (i18n)

The application is fully bilingual with Angular's compile-time i18n:

- **English (en-US)** — Primary locale, default at `/`
- **Spanish (es-MX)** — Secondary locale at `/es/`
- **Separate Builds** — Each locale is a completely separate Angular build
- **Translation Files** — XLIFF 1.2 format in `src/locale/`

### Marking Content for Translation

**In Templates:**

```html
<h1 i18n="Hero|Main headline">Welcome</h1>
```

**In TypeScript:**

```typescript
const title = $localize`:Services|Title:Tax Preparation`;
```

### Translation Workflow

1. Mark text with `i18n` or `$localize`
2. Run `npm run extract-i18n`
3. Add Spanish translations to `messages.es-MX.xlf`
4. Build and test both locales

See [Internationalization Architecture](./i18n.md) for comprehensive details.

## State Management

The application uses:

- **Component State** — Local component properties and inputs/outputs
- **Service State** — Shared state in services (Angular services)
- **No Redux/NgRx** — Complexity kept minimal for a simpler codebase

For simple applications like this, RxJS observables in services provide sufficient state management.

## Testing Strategy

### Unit Tests

All components and services have unit tests using Vitest:

```typescript
// Example component test
describe('HomeComponent', () => {
  it('should display featured services', () => {
    const component = TestBed.createComponent(HomeComponent);
    expect(component.featuredServices.length).toBe(3);
  });
});
```

### Running Tests

```bash
npm test                 # Run all tests
npm test -- --watch     # Watch mode
npm test -- --include='**/pattern.spec.ts'  # Specific file
```

## Styling Architecture

### Global Styles

`src/styles.css` defines:

- CSS variables for colors, spacing, typography
- Base element styles
- Media queries for responsive design

### Component Styles

Each component has its own SCSS file:

```scss
// component.component.scss
.container {
  padding: var(--spacing-md);
  color: var(--color-primary-text);
}
```

### Responsive Design

Mobile-first approach with breakpoints:

```css
/* Base: mobile styles */
.grid {
  display: block;
}

/* Tablet and up */
@media (min-width: 768px) {
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## Performance Considerations

### Bundle Optimization

- **Lazy Loading** — Feature modules loaded on-demand
- **AOT Compilation** — Enabled by default in Angular 21
- **Tree Shaking** — Unused code automatically removed
- **Image Optimization** — AVIF format for smaller file sizes

### Change Detection

Components use `ChangeDetectionStrategy.OnPush` where appropriate for performance.

## Build and Deployment

### Production Builds

```bash
npm run build:i18n    # Build both locales
npm run build:en      # English only
npm run build:es      # Spanish only
```

**Output:**

```text
dist/larios-income-tax/browser/
├── en-US/            # English build
└── es-MX/            # Spanish build
```

### Azure Static Web Apps

Configured in `staticwebapp.config.json`:

- Routes `/` to English build
- Routes `/es/*` to Spanish build
- SPA fallback for client-side routing

## Architecture Documentation

**Detailed guides:**

- [Project Structure](./project-structure.md) — Directory organization and conventions
- [Internationalization (i18n)](./i18n.md) — Bilingual support architecture
- [Module Structure](./module-structure.md) — Feature and shared modules in depth

## Related Documentation

- [Getting Started](../getting-started/index.md) — Setup and development
- [Features](../features/index.md) — Feature documentation
- [Services Catalog](../features/services.md) — Service management
