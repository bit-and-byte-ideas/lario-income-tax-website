# Services Catalog

The Larios Income Tax website features a centralized services catalog with 9 services
covering tax preparation, immigration, translations, and more.

## Services Overview

All services are defined in a single source of truth: `src/app/shared/constants/services.constants.ts`

### Featured Services (Home Page)

These three services are prominently displayed on the home page:

1. **Tax Preparation** - Expert tax preparation for individuals and businesses with maximum refund guarantee
2. **Immigration Services** - Comprehensive immigration assistance including visas, green cards, and family petitions
3. **Translations** - Certified translation services for legal, immigration, and official documents

### All Services (Services Page)

Complete list of 9 services accessible at `/services`:

| Service               | Duration    | Featured | Category              |
| --------------------- | ----------- | -------- | --------------------- |
| Tax Preparation       | 50 min      | Yes      | Tax                   |
| Immigration Services  | 50 min      | Yes      | Immigration           |
| Translations          | 1 hr 50 min | Yes      | Professional Services |
| E-File & Rapid Refund | 30 min      | No       | Tax                   |
| Dual Citizenship      | 1 hr        | No       | Immigration           |
| U.S. Citizenship      | 1 hr        | No       | Immigration           |
| Global Entry/Sentri   | 45 min      | No       | Travel                |
| ITINs                 | 40 min      | No       | Tax                   |
| Tourist Visas         | 45 min      | No       | Immigration           |

## Service Model

Each service follows this TypeScript interface:

```typescript
interface Service {
  id: string; // Unique identifier (kebab-case)
  title: string; // Display title
  image: string; // Path to service image
  duration: string; // Service duration (e.g., "1 hr")
  consultation: string; // Consultation info (usually "Free Consultation")
  featured: boolean; // Display on home page?
  briefDescription: string; // 1-2 sentence summary for services list
  description: string; // 3-5 sentence detailed description for detail page
}
```

## Service Content

### Brief Description vs. Full Description

**Brief Description** (`briefDescription`):

- Displayed on `/services` page in service cards
- 1-2 concise sentences giving quick overview
- Example: "Expert tax preparation for individuals and businesses with maximum refund guarantee."

**Full Description** (`description`):

- Displayed on individual service detail pages (e.g., `/services/tax-preparation`)
- 3-5 sentences with comprehensive details
- Explains specific benefits, process steps, and value propositions

## Service Images

Service images are stored in `public/assets/images/`:

- **Format**: AVIF (optimal compression)
- **Placeholder**: `/assets/images/larios_tax_logo_transparent.avif` for services without custom images
- **Path Format**: `/assets/images/service-name.avif`

### Current Service Images

```text
public/assets/images/
├── tax-preparation.avif
├── immigration-services.avif
├── transaltion-services.avif        # Note: typo in filename (historical)
├── e-file-rapid-refund.avif
├── larios_tax_logo_transparent.avif  # Placeholder
└── ...
```

## Helper Functions

Three utility functions are available in `services.constants.ts`:

### getAllServices()

Returns all 9 services:

```typescript
const allServices = getAllServices(); // Service[]
```

### getFeaturedServices()

Returns only services with `featured: true` (3 services):

```typescript
const featured = getFeaturedServices(); // Service[]
```

Used on home page to display the 3-card overview section.

### getServiceById(id: string)

Returns a specific service or undefined:

```typescript
const service = getServiceById('tax-preparation'); // Service | undefined
```

Used on service detail pages to fetch content based on route parameter.

## Internationalization (i18n)

All service fields are marked for translation using `$localize`:

```typescript
{
  id: 'tax-preparation',
  title: $localize`:Services|Tax Preparation service title:Tax Preparation`,
  image: '/assets/images/tax-preparation.avif',
  duration: $localize`:Services|Service duration:50 min`,
  consultation: $localize`:Services|Free consultation label:Free Consultation`,
  featured: true,
  briefDescription: $localize`:Services|Tax Preparation brief description:Expert tax preparation...`,
  description: $localize`:Services|Tax Preparation full description:Our professional tax preparation...`,
}
```

Format: `` $localize`:Services|<Field Name>:<English text>` ``

When you add a new service, the `add-business-service` skill will guide you through:

1. Adding the service object with proper `$localize` wrapping
2. Extracting translation strings (`npm run extract-i18n`)
3. Adding Spanish translations to `messages.es-MX.xlf`

See [Adding a New Service](../guides/adding-services.md) for step-by-step instructions.

## User Navigation Flow

Users can access services through multiple paths:

1. **Home page**: Click on any featured service card → navigates to `/services/:id`
2. **Services page** (`/services`): Click any service card → navigates to `/services/:id`
3. **Direct URL**: Navigate to `/services/service-id` for detail page

## Pages Using Services

### Home Page (`/`)

- **Component**: `src/app/features/home/components/services-overview/`
- **Data**: `getFeaturedServices()` (3 services)
- **Layout**: 3 cards in a row (responsive grid)

### Services Page (`/services`)

- **Component**: `src/app/features/services/pages/services-page/`
- **Data**: `getAllServices()` (9 services)
- **Layout**: 2 columns on desktop, 1 on mobile

### Service Detail Page (`/services/:id`)

- **Component**: `src/app/features/services/pages/service-detail-page/`
- **Data**: `getServiceById(id)` (1 service based on route parameter)
- **Layout**: Full-page detail view with image, description, and contact CTA

## Testing Services

Services are tested in multiple spec files:

- `home.component.spec.ts` — Verifies featured services display
- `services-page.component.spec.ts` — Checks all services render correctly
- `service-detail-page.component.spec.ts` — Tests dynamic service loading by ID

When adding a new service, update test expectations if they hardcode service counts:

```typescript
// Example: if test expects 3 services and you add a 4th featured service
expect(services.length).toBe(4); // Update from 3 to 4
```

## Future API Integration

The current static array in `services.constants.ts` can be easily replaced with API data:

```typescript
// Future implementation example
export async function getAllServices(): Promise<Service[]> {
  const response = await fetch('/api/services');
  return response.json();
}
```

No component changes would be needed — they already use the helper functions.

## Related

- [Adding a New Service](../guides/adding-services.md) — Step-by-step guide
- [Internationalization](../architecture/i18n.md) — Translation workflow
- `CLAUDE.md` in the project root — Technical reference for services management
