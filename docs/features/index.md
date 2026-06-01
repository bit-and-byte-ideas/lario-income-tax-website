# Features

This section documents the features and capabilities of the Larios Income Tax website.

## Overview

The Larios Income Tax website is a fully responsive Angular application serving the tax and immigration services market.
It features bilingual support (English/Spanish), a comprehensive services catalog, and optimized user experience.

## Core Features

### Bilingual Support

- **English (en-US)** — primary locale at `/`
- **Spanish (es-MX)** — secondary locale at `/es/`
- Automatic locale detection and switching via header flag selector
- Full internationalization (i18n) using Angular's compile-time translation
- See [Internationalization Architecture](../architecture/i18n.md) for details

### Services Catalog

- **9 services** covering tax preparation, immigration, translations, and more
- **Featured services** (3) prominently displayed on home page
- **Dynamic detail pages** for each service (`/services/:id`)
- Centralized catalog in `src/app/shared/constants/services.constants.ts`
- See [Services Catalog](./services.md) for full list

### Pages & Navigation

| Page                | Routes                                          | Purpose                                                      |
| ------------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| **Home**            | `/`                                             | Landing page with hero, featured services, and quick contact |
| **Services**        | `/services`                                     | Grid of all 9 services with descriptions                     |
| **Service Details** | `/services/:id`                                 | Individual service details and contact CTA                   |
| **Contact**         | `/contact/united-states`, `/es/contacto/méxico` | Bilingual contact forms and locations                        |

### User Experience

- **Responsive Design** — Mobile-first approach supporting all screen sizes
- **Parallax Hero** — Engaging landing page with layered backgrounds
- **Professional Theme** — Warm, professional color palette (tans, browns, earth tones)
- **Accessible Forms** — Reactive forms with validation and error handling
- **Language Switcher** — Easy locale switching via flag buttons in header
- **SEO Optimized** — hreflang tags, structured data, meta tags per page

### Technical Features

- **Component-Based Architecture** — Feature modules with lazy loading
- **Reactive Forms** — Angular FormBuilder with comprehensive validation
- **Custom Pipes** — SafePipe for iframe URL sanitization
- **Constants Management** — Centralized services, social media, and configuration
- **Type Safety** — Full TypeScript with strict mode enabled

## Detailed Feature Documentation

### Pages & Components

Each page is thoroughly documented in [features/index.md](./index.md):

- **Home Page** — Hero section, featured services, contact overview
- **Services Page** — Complete service grid with descriptions
- **Service Detail Pages** — Dynamic pages for each individual service
- **Contact Pages** — Bilingual forms with location-specific information

### Internationalization

Comprehensive i18n coverage including:

- Template translations (`i18n` attributes)
- TypeScript translations (`$localize` strings)
- Service catalog translations
- SEO metadata translations
- Form labels and messages

See [Internationalization Architecture](../architecture/i18n.md) for the full workflow.

### Services Management

The services catalog is the heart of the application:

- Centralized single source of truth
- Easy to add/modify services
- Automatic display on all relevant pages
- Full bilingual support for all service text

See [Services Catalog](./services.md) and [Adding a Service](../guides/adding-services.md) for details.

## Related Documentation

### Getting Started

- [Local Development](../getting-started/development.md) — Running the dev server
- [Installation](../getting-started/installation.md) — Initial setup

### Architecture

- [Internationalization (i18n)](../architecture/i18n.md) — Translation system
- [Project Structure](../architecture/project-structure.md) — Directory organization

### Guides

- [Adding a Service](../guides/adding-services.md) — Service catalog workflow
- [Adding Translations](../guides/adding-translations.md) — Translation workflow
- [Code Quality](../guides/code-quality.md) — Testing and linting standards

## Development Status

All major features are implemented and tested:

- ✅ Landing page with hero section
- ✅ Services listing (9 services)
- ✅ Service detail pages
- ✅ Bilingual English/Spanish support
- ✅ Contact forms (US and Mexico locations)
- ✅ Responsive mobile design
- ✅ Unit test coverage
- ✅ Pre-commit hooks and code quality
- ✅ Azure Static Web Apps deployment

## Next Steps

For developers new to the project:

1. **Set up locally** — [Installation Guide](../getting-started/installation.md)
2. **Start the dev server** — [Local Development](../getting-started/development.md)
3. **Understand the architecture** — [Project Structure](../architecture/project-structure.md)
4. **Review the services** — [Services Catalog](./services.md)

To add new features:

1. **Add a service** — [Adding a Service Guide](../guides/adding-services.md)
2. **Translate text** — [Adding Translations Guide](../guides/adding-translations.md)
3. **Build and test** — [Production Build Guide](../guides/production-build.md)
