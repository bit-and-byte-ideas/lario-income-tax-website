## Documentation Audit & Reorganization (2026-05-31)

### Summary of Changes Made

#### 1. Reorganized Docs Structure

Migrated from flat file structure to hierarchical TechDocs layout:

**Before:**

```text
/docs/
├── setup-guide.md
├── features.md
├── architecture.md
├── THEMES.md
├── code-quality.md
└── ... (17 files, flat)
```

**After:**

```text
/docs/
├── getting-started/
│   ├── index.md (new)
│   ├── installation.md (renamed from setup-guide.md)
│   ├── development.md (new)
│   └── environment.md (renamed from environment-config.md)
├── architecture/
│   ├── index.md (new)
│   ├── project-structure.md (from architecture.md)
│   ├── module-structure.md (from project-structure.md)
│   └── i18n.md (new, comprehensive)
├── features/
│   ├── index.md (new)
│   ├── services.md (new, comprehensive catalog)
│   └── themes.md (from THEMES.md)
├── guides/
│   ├── adding-services.md (new, step-by-step)
│   ├── adding-translations.md (new, i18n workflow)
│   ├── production-build.md
│   ├── code-quality.md
│   ├── pre-commit.md
│   ├── ci-cd.md
│   ├── azure-*.md (3 files, consolidated)
│   └── ...
└── (unchanged) index.md, project-info.md, markdown-style-guide.md
```

#### 2. Created New Essential Pages

1. **docs/getting-started/index.md** — Quick start entry point (30-min setup)
2. **docs/getting-started/development.md** — Dev server, testing, locale-specific commands
3. **docs/architecture/index.md** — Architecture overview, design patterns, module structure
4. **docs/architecture/i18n.md** — Comprehensive i18n guide (pulled from CLAUDE.md, expanded)
5. **docs/features/index.md** — Feature overview and documentation index
6. **docs/features/services.md** — Services catalog (9 services, helper functions, i18n details)
7. **docs/guides/adding-services.md** — Step-by-step service addition guide
8. **docs/guides/adding-translations.md** — i18n workflow with examples and patterns

#### 3. Updated Critical Files

**README.md**:

- Corrected `npm start` vs `npm run start:en` vs `npm run start:es` distinction
- Updated command table with all i18n build variants
- Added links to reorganized doc structure
- Added section on Claude Code skills (`/add-business-service`, `/add-translation`, etc.)
- Removed outdated doc references

**mkdocs.yml**:

- Updated `nav` section to match hierarchical directory structure
- Changed from flat list to nested sections
- All new pages properly indexed

#### 4. Documentation Philosophy

**Key Decisions**:

- **No duplication of CLAUDE.md** — Link to it, don't duplicate technical details
- **Focus on developer workflow** — Docs explain HOW to use the project, not just architecture theory
- **Actionable guides** — Every guide has step-by-step instructions and examples
- **Link to skills** — Direct developers to Claude Code automation (`/add-translation`, etc.)
- **Keep it current** — All commands match package.json scripts verified (2026-05-31)

### Documentation Coverage Status

#### Comprehensive (Complete)

- ✅ Getting Started (installation, development, environment)
- ✅ Internationalization (i18n architecture, workflow, patterns)
- ✅ Services Catalog (9 services, helper functions, adding new services)
- ✅ Features (home, services, contact pages)
- ✅ Architecture (structure, patterns, principles)
- ✅ Code Quality & Pre-commit
- ✅ Azure Deployment (setup, infrastructure, checklist)
- ✅ Production Build

#### Adequate (Existing, Moved)

- ✅ CI/CD Pipeline (ci-cd.md moved to guides/)
- ✅ Theme System (THEMES.md moved to features/themes.md)

#### Legacy/Deprecated

- ⚠️ i18n-implementation-plan.md — Marked "Phase 1 COMPLETED", now superseded by docs/architecture/i18n.md
  - Decision: Keep as historical reference, but flag in docs/architecture/i18n.md as superseded

### Project Details Confirmed

- **Framework**: Angular 21.0.4
- **Language**: TypeScript
- **i18n**: Compile-time, en-US and es-MX, XLIFF 1.2 format
- **Services**: 9 services (3 featured, 6 additional)
- **Build Outputs**: `dist/larios-income-tax/browser/{en-US, es-MX}/`
- **Deployment**: Azure Static Web Apps with route-based locale routing
- **Testing**: Vitest
- **Code Quality**: Prettier, markdownlint, pre-commit hooks

### Files Changed/Created

**New Pages (8 files)**:

1. docs/getting-started/index.md
2. docs/getting-started/development.md
3. docs/architecture/index.md
4. docs/architecture/i18n.md
5. docs/features/index.md
6. docs/features/services.md
7. docs/guides/adding-services.md
8. docs/guides/adding-translations.md

**Moved Files (13 files)**:

- setup-guide.md → getting-started/installation.md
- environment-config.md → getting-started/environment.md
- architecture.md → architecture/project-structure.md
- project-structure.md → architecture/module-structure.md
- features.md → features/index.md
- THEMES.md → features/themes.md
- production-build.md → guides/
- code-quality.md → guides/
- pre-commit-setup.md → guides/pre-commit.md
- ci-cd.md → guides/
- azure-deployment-setup.md → guides/azure-deployment.md
- azure-infrastructure.md → guides/
- azure-deployment-checklist.md → guides/azure-checklist.md

**Updated Files (2 files)**:

1. README.md — Corrected commands, links, added skills section
2. mkdocs.yml — Updated nav to match hierarchical structure

**Unchanged**:

- docs/index.md (main landing page)
- docs/project-info.md (project background)
- docs/markdown-style-guide.md (style guidelines)

### Notes for Future Sessions

#### What's Good

- Documentation is now organized per TechDocs conventions (hierarchical)
- README.md commands are verified against package.json scripts
- All critical workflows have step-by-step guides
- Claude Code skills are prominently referenced
- CLAUDE.md is preserved as the authoritative technical reference

#### What Could Be Improved

- The 9 services in services.constants.ts could use better image coverage (some use placeholder)
- i18n-implementation-plan.md is outdated; consider archiving or deprecating
- No dedicated "Troubleshooting" page (scattered across guides)
- No "FAQ" for common developer questions

#### Next Time

- Consider adding a `/docs/reference/` section with:
  - CLI commands reference
  - File paths reference
  - Error messages guide
- Monitor if new developers struggle with any workflow
- Update docs quarterly with latest package.json script changes
