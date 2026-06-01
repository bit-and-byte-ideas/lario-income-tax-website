# Pre-commit Hooks Setup

## Overview

This project uses `pre-commit` framework with Prettier and markdownlint to ensure code quality and
consistent formatting on every commit.

## What's Configured

### Tools

1. **Prettier** - Code formatter for TypeScript, JavaScript, CSS, JSON, YAML, HTML, and Markdown
2. **markdownlint** - Linter for Markdown files
3. **pre-commit hooks** - Additional checks (trailing whitespace, EOF, YAML/JSON validation, etc.)

### Configuration Files

- `.pre-commit-config.yaml` - Pre-commit framework configuration
- `.prettierrc.json` - Prettier formatting rules
- `.prettierignore` - Files to exclude from Prettier
- `.markdownlint.json` - Markdown linting rules
- `.markdownlintignore` - Files to exclude from markdown linting

## How It Works

When you commit changes:

1. Pre-commit hooks automatically run on staged files
2. Prettier formats code (TS, JS, CSS, HTML, JSON, YAML, MD)
3. Markdownlint checks and fixes markdown files
4. Additional checks run (trailing whitespace, EOF, merge conflicts, etc.)
5. If any tool modifies files, the commit is paused
6. Review changes, stage them, and commit again

## Installation

The hooks are already installed in this project. If you need to reinstall:

```bash
pre-commit install
```

## Manual Commands

### Format all files with Prettier

```bash
npm run format
```

### Check formatting without making changes

```bash
npm run format:check
```

### Lint markdown files

```bash
npm run lint:md
```

### Fix markdown issues

```bash
npm run lint:md:fix
```

### Run pre-commit on all files (not just staged)

```bash
pre-commit run --all-files
```

### Update pre-commit hooks to latest versions

```bash
pre-commit autoupdate
```

## Prettier Rules

Key formatting rules:

- **Semi-colons**: Required
- **Quotes**: Single quotes (except in JSON)
- **Print Width**: 100 characters
- **Tab Width**: 2 spaces
- **Trailing Commas**: ES5 style
- **Arrow Parens**: Avoid when possible
- **End of Line**: LF (Unix style)

## Markdownlint Rules

Key markdown rules:

- **Headers**: ATX style (`#` instead of underline)
- **Lists**: Dash style (`-` instead of `*` or `+`)
- **Line Length**: 120 characters (tables/code blocks exempt)
- **Code Blocks**: Fenced style with language specification
- **HTML**: Only `<br>`, `<details>`, `<summary>` allowed

## Bypassing Hooks (Not Recommended)

If absolutely necessary, you can skip hooks:

```bash
git commit --no-verify -m "commit message"
```

**Warning**: Only use this in emergencies. Code quality checks exist for a reason.

## Troubleshooting

### Hooks not running

```bash
# Reinstall hooks
pre-commit uninstall
pre-commit install
```

### Clear pre-commit cache

```bash
pre-commit clean
```

### Hook fails on specific file

Check if the file is in an ignore list:

- `.prettierignore`
- `.markdownlintignore`

### Update hooks to fix issues

```bash
pre-commit autoupdate
```

## Integration with IDE

### VS Code

Install these extensions for automatic formatting:

- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **markdownlint** (`DavidAnson.vscode-markdownlint`)

Add to your VS Code settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Files Checked by Pre-commit

### Prettier

- `*.ts`, `*.tsx` - TypeScript files
- `*.js`, `*.jsx` - JavaScript files
- `*.css`, `*.scss` - Style files
- `*.html` - HTML templates
- `*.json` - JSON files (except package-lock.json)
- `*.yaml`, `*.yml` - YAML files
- `*.md` - Markdown files

### Markdownlint

- All `*.md` files (except in node_modules, dist, .angular)

### Additional Checks

- Trailing whitespace removal
- End-of-file fixer (ensures newline at end)
- YAML syntax validation
- JSON syntax validation
- Merge conflict detection
- Mixed line ending fixer (enforces LF)
- Large file checker (max 1000 KB)

## Benefits

- Consistent code style across the team
- Catch common errors before they reach CI/CD
- Automatic formatting reduces manual work
- Markdown documentation stays clean and professional
- Prevents committing large files accidentally
- Ensures code quality standards are met

## Next Steps

The hooks are active and will run on every commit. Just code normally, and the tools will handle
formatting and linting automatically!
