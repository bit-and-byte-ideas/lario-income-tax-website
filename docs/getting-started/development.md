# Local Development

This guide covers running the project locally and understanding the development workflow.

## Starting the Development Server

The project supports locale-specific development servers for testing English and Spanish builds:

```bash
# Default development server (English - en-US)
npm start
# or
ng serve

# Navigate to http://localhost:4200
```

To test in a specific locale:

```bash
# English locale
npm run start:en
# Navigate to http://localhost:4200

# Spanish locale
npm run start:es
# Navigate to http://localhost:4200
```

!!! note
The default `npm start` serves the English locale. Use `npm run start:en` or `npm run start:es`
to explicitly test locale-specific features.

## Common Development Tasks

### Extract Translations

When you add new translatable strings to templates or TypeScript code, extract them to the translation files:

```bash
npm run extract-i18n
```

This updates `src/locale/messages.xlf` (English source) and prepares new units for Spanish translation in `src/locale/messages.es-MX.xlf`.

See [Adding Translations](../guides/adding-translations.md) for the complete workflow.

### Running Tests

```bash
# Run all tests
npm test

# Run tests for a specific file
npm test -- --include='**/component-name.spec.ts'

# Watch mode (auto-rerun on changes)
npm test -- --watch
```

### Code Formatting

```bash
# Format all files (auto-fix)
npm run format

# Check formatting without changes
npm run format:check

# Fix markdown linting issues
npm run lint:md:fix
```

### Building for Production

```bash
# Build both locales for production
npm run build:i18n

# Build English only
npm run build:en

# Build Spanish only
npm run build:es

# Generic build command (respects angular.json default config)
npm run build
```

## Project Structure

The project follows Angular conventions with feature-based organization:

```text
src/
├── app/
│   ├── shared/              # Shared across all features
│   │   ├── components/      # Header, Footer, etc.
│   │   ├── pipes/           # Custom pipes (SafePipe)
│   │   ├── constants/       # Services catalog, social media
│   │   └── models/          # TypeScript interfaces
│   ├── features/            # Feature modules
│   │   ├── home/            # Home page
│   │   ├── services/        # Services listing & detail pages
│   │   ├── contact/         # Contact page (bilingual)
│   │   └── ...
│   └── app.ts               # Root component
├── locale/                  # Translation files (XLF format)
│   ├── messages.xlf         # English source strings
│   └── messages.es-MX.xlf   # Spanish translations
└── styles.css               # Global styles

public/
└── assets/
    └── images/              # AVIF images for services, backgrounds
```

## Adding New Features

To create a new feature component:

```bash
# Generate a new component
ng generate component features/new-feature/pages/new-page
ng generate component features/new-feature/components/sub-component

# Generate a service
ng generate service features/new-feature/services/my-service
```

## Internationalization (i18n) Workflow

For comprehensive i18n details, see [Internationalization Architecture](../architecture/i18n.md).

### Quick Reference

1. **Mark text in templates**:

   ```html
   <h1 i18n="Context|Description">English Text</h1>
   ```

2. **Mark text in TypeScript**:

   ```typescript
   const text = $localize`:Context|Description:English Text`;
   ```

3. **Extract strings**:

   ```bash
   npm run extract-i18n
   ```

4. **Add Spanish translations** to `src/locale/messages.es-MX.xlf`

5. **Test both locales**:

   ```bash
   npm run start:en
   npm run start:es
   ```

## Debug Mode

Enable verbose logging:

```bash
# In bash
DEBUG=* ng serve

# In PowerShell
$env:DEBUG="*"; ng serve
```

## Troubleshooting

**Port 4200 in use?**

```bash
ng serve --port 4300
```

**Dependencies not found?**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Tests not running?**

```bash
npm test -- --no-watch
```

## Next Steps

- [Adding a New Service](../guides/adding-services.md) - Register services in the catalog
- [Adding Translations](../guides/adding-translations.md) - Translate strings for Spanish locale
- [Production Build](../guides/production-build.md) - Prepare for deployment
