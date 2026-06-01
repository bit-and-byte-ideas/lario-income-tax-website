# Larios Income Tax Website

An Angular-based web application for Larios Income Tax services, migrated from the original Wix site at [lariosincometax.com](https://www.lariosincometax.com/).

**Business:** Larios Income Tax | **Location:** 3317 El Cajon Blvd, San Diego, CA 92104 | **Phone:** +1 (619) 972-3350

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation & Development

```bash
# Clone and install
git clone <repository-url>
cd larios-income-tax-website
npm install

# Start development server (English)
npm start
# or explicitly: npm run start:en
# Navigate to http://localhost:4200

# To test Spanish locale
npm run start:es
# Navigate to http://localhost:4200/es/
```

### Common Commands

| Command                           | Purpose                         |
| --------------------------------- | ------------------------------- |
| `npm start` or `npm run start:en` | Development server (English)    |
| `npm run start:es`                | Development server (Spanish)    |
| `npm run build:i18n`              | Production build (both locales) |
| `npm run build:en`                | Production build (English only) |
| `npm run build:es`                | Production build (Spanish only) |
| `npm test`                        | Run unit tests                  |
| `npm run extract-i18n`            | Extract translatable strings    |
| `npm run format`                  | Format code with Prettier       |
| `npm run lint:md:fix`             | Fix markdown linting issues     |

For detailed development workflow, see [Local Development](docs/getting-started/development.md).

## Azure Deployment

This project includes complete Terraform infrastructure for deploying to Azure Static Web Apps:

- **Development**: Automatic deployment from `main` branch (with approval)
- **Production**: Automatic deployment from GitHub Releases (with approval)

### Quick Deploy

1. Configure [Azure and GitHub secrets](deploy/SETUP.md#step-3-github-secrets)
2. Push to main branch or create a release
3. Approve deployment in GitHub Actions

See [Infrastructure Setup Guide](deploy/SETUP.md) for complete instructions.

## Technology Stack

- **Framework:** Angular 21.0.4
- **Language:** TypeScript
- **Deployment:** Azure Static Web Apps
- **Node Version:** 20 LTS

## Documentation

Comprehensive technical documentation is available in the `/docs` directory:

### Getting Started

- [Installation](docs/getting-started/installation.md) - Setup and prerequisites
- [Local Development](docs/getting-started/development.md) - Development server and workflow
- [Environment Configuration](docs/getting-started/environment.md) - Configuration guide

### Architecture & Features

- [Project Structure](docs/architecture/project-structure.md) - Directory organization
- [Internationalization (i18n)](docs/architecture/i18n.md) - Bilingual English/Spanish setup
- [Features](docs/features/index.md) - Detailed feature documentation
- [Services Catalog](docs/features/services.md) - Service listing and management
- [Theme System](docs/features/themes.md) - Color scheme customization

### Guides & Deployment

- [Adding a New Service](docs/guides/adding-services.md) - Service catalog workflow
- [Adding Translations](docs/guides/adding-translations.md) - i18n workflow
- [Production Build](docs/guides/production-build.md) - Building for production
- [Code Quality](docs/guides/code-quality.md) - Standards and linting
- [Azure Deployment](docs/guides/azure-deployment.md) - Deployment setup

**View locally:**

```bash
pip install mkdocs-techdocs-core
mkdocs serve  # Open http://localhost:8000
```

## Theme System

Toggle between color schemes instantly without code changes:

```javascript
// Switch to Professional Theme (modern blue/green)
document.documentElement.setAttribute('data-theme', 'professional');

// Switch to Luxury Theme (elegant black/gold)
document.documentElement.setAttribute('data-theme', 'luxury');

// Switch to Classic Theme (warm beige/tan)
document.documentElement.setAttribute('data-theme', 'classic');
```

See [Theme Documentation](docs/THEMES.md) for complete guide and implementation details.

## Features

- **Landing Page** - Parallax hero section, services overview, contact form
- **Services** - Four service offerings with detailed descriptions
- **Book Online** - Service booking interface with dynamic detail pages
- **Contact** - Bilingual contact pages (English/Spanish) with Google Maps integration
- **Responsive Design** - Mobile-first approach with warm, professional aesthetic
- **Internationalization** - Location-based English/Spanish content
- **Multi-Theme System** - Toggle between Classic (beige/tan), Professional (blue/green),
  and Luxury (black/gold) color schemes

## Project Structure

```text
src/
├── app/
│   ├── shared/         # Header, Footer, SafePipe, constants
│   ├── features/       # Home, Services, Book Online, Contact
│   │   ├── home/       # Hero, ServicesOverview, ContactSection
│   │   ├── services/   # ServicesPage
│   │   ├── book-online/# BookOnlinePage, ServiceDetailPage
│   │   └── contact/    # ContactPage (bilingual)
│   └── app.ts          # Root component
├── environments/       # Environment configurations
└── styles.css          # Global styles with CSS variables
```

See [Architecture](docs/architecture.md) for detailed organization and patterns.

## Code Quality & CI/CD

- **Pre-commit hooks** enforce formatting and linting on every commit
- **GitHub Actions** run on PRs: linting, tests, build verification
- **Automated deployment** to Azure Static Web Apps on main branch and releases

See [Code Quality](docs/code-quality.md) and [CI/CD Pipeline](docs/ci-cd.md) for details.

## Contributing

This project uses automated code quality tools:

- Pre-commit hooks (Prettier, markdownlint)
- Unit tests with Vitest
- See [Code Quality Guide](docs/guides/code-quality.md)
- AI development guidelines: [CLAUDE.md](CLAUDE.md)

### Using Claude Code

Custom skills for common workflows:

```bash
/add-business-service    # Add a new service to the catalog
/add-translation         # Add translatable strings
/check-missing-translations  # Audit translation coverage
```

See [CLAUDE.md](CLAUDE.md) for detailed skill instructions.

## License

See [LICENSE](LICENSE) file for details.
