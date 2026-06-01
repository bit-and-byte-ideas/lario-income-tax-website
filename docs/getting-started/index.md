# Getting Started

Welcome to the Larios Income Tax website development guide.
This section covers everything you need to set up the project and understand the development workflow.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 20.x or higher — [Download](https://nodejs.org/)
- **npm** 10.x or higher (included with Node.js)
- **Git** for version control — [Download](https://git-scm.com/)
- **A code editor** (VS Code recommended) — [Download](https://code.visualstudio.com/)

## Quick Start (30 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/bit-and-byte-ideas/larios-income-tax-website.git
cd larios-income-tax-website
```

### 2. Install Dependencies

```bash
npm install
```

This installs all Node packages listed in `package.json`.

### 3. Start Development Server

```bash
npm start
```

This starts the Angular development server with the English locale.

**Output:**

```text
✔ Compiled successfully
✔ Building...
Application bundle generation complete.

Initial Chunk Files | Names | Raw Size | Estimated Transfer Size
main.js             |       | 450 kB   | 120 kB
```

### 4. Open in Browser

Navigate to **<http://localhost:4200>** in your browser. You should see the Larios Income Tax home page.

### 5. Testing Both Locales

To test the Spanish version:

```bash
# Stop the current server (Ctrl+C)

# Start Spanish dev server
npm run start:es
# Open http://localhost:4200/es/
```

## Key Documentation

**Next, read these guides in order:**

1. **[Installation](./installation.md)** — Detailed setup and configuration
2. **[Local Development](./development.md)** — Development server, testing, and workflows
3. **[Environment Configuration](./environment.md)** — Environment variables and API keys

## Project Structure Overview

```text
larios-income-tax-website/
├── src/
│   ├── app/
│   │   ├── features/          # Feature modules (home, services, contact)
│   │   ├── shared/            # Shared components, pipes, constants
│   │   └── app.ts             # Root component
│   ├── locale/                # Translation files (XLF format)
│   │   ├── messages.xlf       # English source strings
│   │   └── messages.es-MX.xlf # Spanish translations
│   └── styles.css             # Global styles
├── public/
│   └── assets/                # Images, icons, etc.
├── docs/                      # Technical documentation
├── angular.json               # Angular configuration
├── package.json               # Dependencies and scripts
└── README.md                  # Project overview
```

For a detailed breakdown, see [Project Structure](../architecture/project-structure.md).

## Common Development Tasks

### Start Development Server (English)

```bash
npm start
```

### Test Spanish Locale

```bash
npm run start:es
```

### Run Tests

```bash
npm test
```

### Extract Translations

```bash
npm run extract-i18n
```

### Build for Production

```bash
npm run build:i18n
```

### Format Code

```bash
npm run format
```

## Understanding the Architecture

The project is organized into logical layers:

### Features

Feature modules (`src/app/features/`) contain page components and their related logic:

- **home** — Landing page
- **services** — Services listing and detail pages
- **contact** — Contact forms (bilingual)

### Shared

Reusable components, services, and utilities (`src/app/shared/`):

- **components** — Header, Footer, Layout
- **pipes** — Custom pipes (SafePipe)
- **constants** — Services catalog, social media links
- **models** — TypeScript interfaces

### Internationalization

Full bilingual support using Angular's i18n:

- Mark text with `i18n` attributes or `$localize`
- Extract strings with `npm run extract-i18n`
- Translate to Spanish in `messages.es-MX.xlf`

See [Internationalization Architecture](../architecture/i18n.md) for details.

## Making Your First Change

### Add a New Service

The easiest way to see the system in action:

1. Read [Services Catalog](../features/services.md)
2. Follow [Adding a Service](../guides/adding-services.md)
3. Use the Claude Code skill: `/add-business-service`

### Add Translations

To practice the i18n workflow:

1. Read [Internationalization Architecture](../architecture/i18n.md)
2. Follow [Adding Translations](../guides/adding-translations.md)
3. Use the Claude Code skill: `/add-translation`

## Troubleshooting

### Port 4200 already in use

```bash
ng serve --port 4300
```

### Module not found errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build fails

```bash
npm run format
npm run lint:md:fix
npm test
```

## Next Steps

1. **[Installation Guide](./installation.md)** — Detailed setup
2. **[Local Development Guide](./development.md)** — Dev server and workflows
3. **[Project Structure](../architecture/project-structure.md)** — Understand the codebase
4. **[Services Catalog](../features/services.md)** — Review the service listing

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Commands](https://angular.dev/tools/cli)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- `CLAUDE.md` in the project root — AI development guidelines
