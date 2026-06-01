# Project Structure

## Directory Layout

```text
larios-income-tax-website/
├── .devcontainer/          # VS Code devcontainer configuration
├── .github/                # GitHub workflows and configuration
├── .husky/                 # Git hooks (not used, using pre-commit)
├── .vscode/                # VS Code settings and extensions
├── docs/                   # TechDocs documentation
├── public/                 # Static assets
├── src/                    # Application source code
│   ├── app/                # Angular application
│   │   ├── core/           # Core module (singletons)
│   │   ├── shared/         # Shared module (reusables)
│   │   ├── features/       # Feature modules
│   │   ├── app.ts          # Root component
│   │   ├── app.config.ts   # App configuration
│   │   └── app.routes.ts   # Routing configuration
│   ├── environments/       # Environment configs
│   ├── index.html          # Main HTML file
│   ├── main.ts             # Application entry point
│   └── styles.css          # Global styles
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore patterns
├── .markdownlint.json      # Markdown linting rules
├── .pre-commit-config.yaml # Pre-commit hook configuration
├── .prettierrc.json        # Prettier formatting rules
├── angular.json            # Angular CLI configuration
├── catalog-info.yaml       # Backstage catalog metadata
├── CLAUDE.md               # AI assistant guidelines
├── LICENSE                 # Project license
├── mkdocs.yml              # TechDocs configuration
├── package.json            # NPM dependencies and scripts
├── README.md               # Project overview
├── staticwebapp.config.json # Azure Static Web Apps configuration
├── tsconfig.json           # TypeScript configuration
└── deploy/                 # Terraform infrastructure
    ├── modules/
    │   └── static-web-app/ # Static Web App module
    └── environments/
        ├── dev/            # Dev environment
        └── prod/           # Prod environment
```

## Key Directories

### `/src/app/core/`

Singleton services, guards, and interceptors loaded once at app startup.

**Subdirectories:**

- `services/` - Core services (API, auth, logging)
- `guards/` - Route guards
- `interceptors/` - HTTP interceptors

**Rules:**

- Import only in AppModule
- Never import in feature modules
- Contains singleton services only

### `/src/app/shared/`

Reusable components, directives, and pipes shared across features.

**Subdirectories:**

- `components/` - UI components (buttons, cards, etc.)
- `directives/` - Custom directives
- `pipes/` - Custom pipes

**Rules:**

- Import in feature modules as needed
- Only reusable code
- No feature-specific logic

### `/src/app/features/`

Feature modules with lazy loading for each major section.

**Planned Features:**

- `home/` - Home page
- `services/` - Services page
- `contact/` - Contact page
- `about/` - About page

**Rules:**

- Each feature is a separate module
- Use lazy loading
- Self-contained functionality

### `/src/environments/`

Environment-specific configuration files.

**Files:**

- `environment.ts` - Development configuration
- `environment.prod.ts` - Production configuration

**Contents:**

- API URLs
- Feature flags
- Business information
- Third-party API keys

### `/docs/`

TechDocs documentation for Backstage developer portal.

**Contents:**

- Markdown documentation files
- Images and diagrams
- mkdocs.yml configuration

### `/public/`

Static assets served directly without processing.

**Contents:**

- `favicon.ico`
- Other static files

## Configuration Files

### Angular Configuration

- **angular.json** - Angular CLI workspace configuration
- **tsconfig.json** - Base TypeScript configuration
- **tsconfig.app.json** - App-specific TypeScript config
- **tsconfig.spec.json** - Test-specific TypeScript config

### Code Quality

- **.prettierrc.json** - Code formatting rules
- **.markdownlint.json** - Markdown linting rules
- **.pre-commit-config.yaml** - Pre-commit hooks

### Deployment

- **staticwebapp.config.json** - Azure Static Web Apps configuration
  - Navigation fallback for SPA routing
  - Security headers
  - MIME types
- **deploy/** - Terraform infrastructure as code
  - Infrastructure for dev and prod environments
  - Static Web App resources
  - Application Insights

### Development

- **.editorconfig** - Editor settings
- **.vscode/** - VS Code workspace settings
- **.devcontainer/** - Dev container configuration

### Backstage

- **catalog-info.yaml** - Service catalog metadata
- **mkdocs.yml** - TechDocs configuration

## Build Outputs

### `/dist/larios-income-tax/`

Production build output (not in version control).

**Structure:**

```text
dist/larios-income-tax/
├── browser/                # Browser bundle
│   ├── index.html
│   ├── main-[hash].js
│   ├── styles-[hash].css
│   └── assets/
└── server/                 # SSR bundle (if using SSR)
```

### `/.angular/`

Angular build cache (not in version control).

### `/node_modules/`

NPM dependencies (not in version control).

## File Naming Conventions

### Components

- Component: `feature-name.component.ts`
- Template: `feature-name.component.html`
- Styles: `feature-name.component.css`
- Tests: `feature-name.component.spec.ts`

### Services

- Service: `feature-name.service.ts`
- Tests: `feature-name.service.spec.ts`

### Modules

- Module: `feature-name.module.ts`
- Routing: `feature-name-routing.module.ts`

### Other

- Guards: `feature-name.guard.ts`
- Interceptors: `feature-name.interceptor.ts`
- Pipes: `feature-name.pipe.ts`
- Directives: `feature-name.directive.ts`

## Important Files

### Root Level

- **README.md** - Project overview and quick start
- **package.json** - Dependencies and npm scripts
- **CLAUDE.md** - Guidelines for AI-assisted development
- **LICENSE** - Project license (view actual content)

### Documentation

- **docs/index.md** - Documentation home page
- **docs/setup-guide.md** - Setup instructions
- **docs/architecture.md** - Architecture overview
- **docs/project-info.md** - Migration details

## Adding New Features

When adding a new feature module:

1. Create directory in `src/app/features/`
1. Generate module with routing
1. Add lazy loading route in `app.routes.ts`
1. Create feature components
1. Import SharedModule as needed
1. Update documentation

Example:

```bash
cd src/app/features
ng generate module services --routing
ng generate component services/components/services-list
```
