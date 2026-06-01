# Adding a New Service

This guide walks through adding a new service to the Larios Income Tax catalog.

## Overview

Services are centralized in `src/app/shared/constants/services.constants.ts`.
When you add a service, it automatically appears on:

- **Services Page** (`/services`) — in the main services grid
- **Service Detail Page** (`/services/:id`) — dynamic detail view
- **Home Page** (`/`) — if marked as `featured: true`

## Step-by-Step Guide

### 1. Use the add-business-service Skill

The easiest way to add a service is with Claude Code:

```bash
/add-business-service
```

The skill will prompt you for:

- Service ID (kebab-case, e.g., "notary-services")
- English title
- Service duration (e.g., "30 min")
- Consultation text (usually "Free Consultation")
- Featured on home page? (true/false)
- Brief description (1-2 sentences)
- Full description (3-5 sentences)
- Image filename

The skill will then:

1. Add the service to `services.constants.ts` with proper `$localize` wrapping
2. Extract translations (`npm run extract-i18n`)
3. Prompt for Spanish translations
4. Update XLIFF files
5. Run tests to verify nothing broke
6. Start the dev server for visual verification

### 2. Manual Process

If you prefer to add the service manually:

#### Step 2a: Prepare the Service Image

Place your service image in `public/assets/images/`:

```bash
# Example: add a notary services image
cp /path/to/notary-services.avif public/assets/images/
```

**Image Requirements**:

- Format: AVIF (for optimal compression)
- Or use placeholder: `/assets/images/larios_tax_logo_transparent.avif`

#### Step 2b: Add the Service Object

Edit `src/app/shared/constants/services.constants.ts` and add your service to the `BUSINESS_SERVICES` array:

```typescript
{
  id: 'notary-services',
  title: $localize`:Services|Notary Services title:Notary Services`,
  image: '/assets/images/notary-services.avif',
  duration: $localize`:Services|Service duration:30 min`,
  consultation: $localize`:Services|Free consultation label:Free Consultation`,
  featured: false,
  briefDescription: $localize`:Services|Notary Services brief description:Certified notary services for important documents.`,
  description: $localize`:Services|Notary Services full description:Professional notary services for document authentication, verification, and certification. We handle powers of attorney, affidavits, acknowledgments, and more. All notarizations are performed by certified notaries public. Available by appointment with flexible scheduling to meet your needs. Protect your important documents with our reliable notary services.`,
}
```

**Important**:

- Wrap ALL text fields in `$localize` with format: `` $localize`:Services|<Field Type>:<English text>` ``
- Place featured services first in the array
- Non-featured services follow

#### Step 2c: Extract Translation Strings

```bash
npm run extract-i18n
```

This updates `src/locale/messages.xlf` with your new service's strings.

#### Step 2d: Add Spanish Translations

Edit `src/locale/messages.es-MX.xlf` and find the new `<trans-unit>` entries for your service:

```xml
<trans-unit id="service-title-id" datatype="html">
  <source>Notary Services</source>
  <target>Servicios Notariales</target>
  <context-group purpose="location">
    <context context-type="sourcefile">src/app/shared/constants/services.constants.ts</context>
    <context context-type="linenumber">123</context>
  </context-group>
  <note priority="1" from="description">Notary Services title</note>
</trans-unit>
```

Add `<target>` elements with Spanish translations for:

- Service title
- Duration
- Consultation text
- Brief description
- Full description

#### Step 2e: Build and Test

```bash
# Build both locales
npm run build:en
npm run build:es

# Or build both at once
npm run build:i18n

# Test in development
npm run start:en   # Test English
npm run start:es   # Test Spanish
```

#### Step 2f: Run Tests

```bash
npm test
```

If tests fail due to hardcoded service counts, update them. For example:

```typescript
// In home.component.spec.ts, if you added a featured service
expect(component.featuredServices.length).toBe(4); // Update from 3 to 4
```

#### Step 2g: Visual Verification

Open both locales in the browser:

```bash
# English
npm run start:en
# Navigate to http://localhost:4200/services

# Spanish
npm run start:es
# Navigate to http://localhost:4200/es/servicios
```

Verify:

- Service appears in the grid on `/services`
- Service detail page loads at `/services/service-id`
- Spanish translations display correctly
- Images load properly
- If featured=true, service appears on home page (`/`)

## Service Fields Explained

### id

- Unique identifier used in URLs: `/services/:id`
- Format: kebab-case (lowercase with hyphens)
- Example: `tax-preparation`, `immigration-services`, `notary-services`

### title

- Display name of the service
- Shown on services page and detail page
- Wrapped in `$localize` for translation

### image

- Path to service image
- Format: `/assets/images/filename.avif`
- Use placeholder if no custom image: `/assets/images/larios_tax_logo_transparent.avif`

### duration

- Typical appointment length
- Format: "X min" or "X hr" or "X hr Y min"
- Examples: "30 min", "1 hr", "1 hr 50 min"
- Wrapped in `$localize` for translation

### consultation

- Consultation type or cost
- Usually: "Free Consultation"
- Wrapped in `$localize` for translation

### featured

- Boolean: `true` or `false`
- `true` = appears on home page in 3-card overview
- `false` = only on services page

### briefDescription

- 1-2 sentence summary
- Shown on services page (`/services`) in service cards
- Keep concise and compelling
- Wrapped in `$localize` for translation

### description

- 3-5 sentence detailed explanation
- Shown on service detail page (`/services/:id`)
- Explain benefits, process, value propositions
- More comprehensive than brief description
- Wrapped in `$localize` for translation

## Committing Your Changes

Always commit the service definition and translation files together:

```bash
git add src/app/shared/constants/services.constants.ts
git add src/locale/messages.xlf
git add src/locale/messages.es-MX.xlf
git add public/assets/images/your-service-image.avif  # if applicable
git commit -m "feat: add notary services to catalog

- Added notary services with full descriptions
- Included Spanish translations
- Image at public/assets/images/notary-services.avif"
```

## Common Issues

### Service appears on home page when it shouldn't

Check that `featured: false` is set correctly:

```typescript
// Wrong
featured: true,

// Right
featured: false,
```

### Spanish translations not showing

Verify:

1. You ran `npm run extract-i18n`
2. You added `<target>` elements to `messages.es-MX.xlf`
3. You ran `npm run build:es` to build the Spanish locale
4. No XML syntax errors in the XLIFF file

### Tests failing

Check hardcoded values in spec files:

```bash
grep -r "expect.*length.*toBe" src/app/features/home/
grep -r "expect.*toBe.*3" src/app/features/home/
```

Update counts to match the new service total (usually +1).

### Image not loading

Check:

1. File exists at `public/assets/images/filename.avif`
2. Path in service object is correct: `/assets/images/filename.avif` (starts with slash)
3. Image format is AVIF or placeholder exists

## Next Steps

- [Internationalization Guide](../architecture/i18n.md) — Understand translation system
- [Services Catalog](../features/services.md) — Review all current services
- [Adding Translations](./adding-translations.md) — More on the translation workflow
