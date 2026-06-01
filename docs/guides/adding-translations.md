# Adding Translations

This guide covers the workflow for making new text translatable in both English and Spanish.

## Overview

The Larios Income Tax website is fully bilingual (en-US and es-MX) using Angular's compile-time i18n system.
When you add new text, you must:

1. Mark it for translation in your code
2. Extract strings to the translation files
3. Add Spanish translations
4. Build and test both locales

## Step-by-Step Workflow

### 1. Use the add-translation Skill

The easiest approach is the Claude Code skill:

```bash
/add-translation
```

The skill will:

- Ask for the English text and location
- Add `i18n` or `$localize` markers to your code
- Extract strings (`npm run extract-i18n`)
- Prompt for Spanish translation
- Build and test both locales

### 2. Manual Process

If you prefer to add translations manually:

#### Step 2a: Mark Text in Templates

For HTML elements, add the `i18n` attribute:

```html
<!-- Simple text -->
<h1 i18n="Hero|Main headline">Welcome to Larios Income Tax</h1>

<!-- With attributes (use i18n-<attr>) -->
<img src="logo.avif" i18n-alt="Logo|Alt text for logo" alt="Larios logo" />

<!-- Multiple attributes -->
<button i18n="Contact|CTA button" i18n-title="Contact|Button tooltip" title="Call to action">
  Schedule Appointment
</button>
```

**Format**: `i18n="Context|Description"`

- **Context**: Category (e.g., "Hero", "Services", "Contact")
- **Description**: What the text is for (helps translators)

#### Step 2b: Mark Text in TypeScript

For dynamic strings, use `$localize`:

```typescript
import { $localize } from '@angular/localize/init';

// Simple string
const greeting = $localize`:Hero|Greeting:Welcome`;

// In services
export class MyService {
  getTitle(): string {
    return $localize`:Services|Title:My Service Title`;
  }

  // With variables (interpolate after localization)
  formatMessage(name: string): string {
    return $localize`:Contact|Greeting:Hello` + `, ${name}`;
  }
}

// In components
export class MyComponent {
  buttonText = $localize`:Contact|Button:Schedule Now`;

  constructor() {
    const description = $localize`:Services|Description:Professional service`;
  }
}
```

**Format**: `` $localize`:Context|Description:English text` ``

!!! warning
Don't interpolate inside the `$localize` call. Interpolate after instead:

```typescript
// WRONG - won't translate correctly
const msg = $localize`:Msg:Value is ${value}`;

// RIGHT - interpolate after
const msg = $localize`:Msg:Value is` + ` ${value}`;
```

#### Step 2c: Extract Strings

Run the extraction command:

```bash
npm run extract-i18n
```

This:

- Scans all `.html` and `.ts` files
- Finds all `i18n` and `$localize` markers
- Generates/updates `src/locale/messages.xlf` (English source)
- Preserves existing translations in `messages.es-MX.xlf`

**Output**:

```text
[info] Extract i18n messages for en-US locale to /path/to/messages.xlf
src/app/shared/constants/services.constants.ts (Line: 123): id="service-title-id"
```

#### Step 2d: Add Spanish Translations

Edit `src/locale/messages.es-MX.xlf` and find the new `<trans-unit>` entries:

```xml
<!-- New unit (no <target> yet) -->
<trans-unit id="abc123-def456" datatype="html">
  <source>Welcome to Larios Income Tax</source>
  <!-- ADD THIS LINE with Spanish translation: -->
  <target>Bienvenido a Larios Income Tax</target>
  <context-group purpose="location">
    <context context-type="sourcefile">src/app/features/home/home.component.html</context>
    <context context-type="linenumber">5</context>
  </context-group>
  <note priority="1" from="description">Hero | Main headline</note>
</trans-unit>
```

Steps:

1. Find all new `<trans-unit>` entries (they have no `<target>`)
2. For each one, add `<target>Spanish translation</target>` after the `<source>` element
3. Keep the same XML structure and indentation

**Finding New Units**:

```bash
# See which units are missing translations
grep -B2 -A3 'source>.*<\/source' src/locale/messages.es-MX.xlf | grep -B2 -A3 -v '<target'
```

#### Step 2e: Build and Test

Build both locales:

```bash
# Build both
npm run build:i18n

# Or individually
npm run build:en
npm run build:es
```

Test in development:

```bash
# Terminal 1: English
npm run start:en
# Open http://localhost:4200

# Terminal 2: Spanish (different port)
ng serve --configuration es-MX --port 4201
# Open http://localhost:4201/es/
```

Or sequentially:

```bash
# Test English
npm run start:en
# Verify in browser, then stop with Ctrl+C

# Test Spanish
npm run start:es
# Verify in browser, then stop with Ctrl+C
```

#### Step 2f: Run Tests

```bash
npm test
```

Ensure all tests pass. No hardcoded text should need changes — only if you changed data structure.

## Common Patterns

### Page Titles and Meta Tags

In component.ts:

```typescript
constructor(private seoService: SeoService) {
  this.seoService.setMetaTags({
    title: $localize`:Services|Page title:Tax Preparation Services`,
    description: $localize`:Services|Page description:Expert tax preparation for individuals and businesses`,
  });
}
```

### Form Labels

In HTML:

```html
<form>
  <label for="name" i18n="Form|Name field label">Name</label>
  <input id="name" required />

  <label for="email" i18n="Form|Email field label">Email</label>
  <input id="email" type="email" required />

  <button type="submit" i18n="Form|Submit button">Submit</button>
</form>
```

### Conditional Text

In HTML:

```html
<div *ngIf="isLoading">
  <p i18n="Status|Loading message">Loading...</p>
</div>

<div *ngIf="hasError">
  <p i18n="Status|Error message">An error occurred. Please try again.</p>
</div>
```

In TypeScript:

```typescript
get statusMessage(): string {
  if (this.isLoading) {
    return $localize`:Status|Loading:Loading...`;
  }
  if (this.hasError) {
    return $localize`:Status|Error:An error occurred. Please try again.`;
  }
  return '';
}
```

### Arrays and Lists

In TypeScript:

```typescript
const menuItems = [$localize`:Menu|Home:Home`, $localize`:Menu|Services:Services`, $localize`:Menu|Contact:Contact`];
```

### Service Descriptions (Special Case)

Service titles and descriptions in `services.constants.ts` use `$localize`:

```typescript
{
  id: 'tax-preparation',
  title: $localize`:Services|Tax Preparation title:Tax Preparation`,
  briefDescription: $localize`:Services|Tax Preparation brief description:Expert tax preparation...`,
  description: $localize`:Services|Tax Preparation full description:Our professional services...`,
  // ... other fields
}
```

When adding a new service, see [Adding a New Service](./adding-services.md).

## Checking Translation Coverage

To audit for missing Spanish translations:

```bash
/check-missing-translations
```

This reports any units in `messages.xlf` that lack a `<target>` in `messages.es-MX.xlf`.

## Committing Changes

Always commit source code, extracted strings, and translations together:

```bash
git add src/app/components/my-component.html
git add src/app/services/my-service.ts
git add src/locale/messages.xlf
git add src/locale/messages.es-MX.xlf
git commit -m "feat: add translatable strings for new feature

- Marked text with i18n and \$localize in MyComponent
- Extracted translation units
- Added Spanish translations to messages.es-MX.xlf"
```

## Best Practices

### Do's

- Mark text before or immediately after adding it
- Extract regularly (don't let translations pile up)
- Keep context hints clear and concise
- Test both locales before committing
- Commit source and translations together

### Don'ts

- Don't manually edit `messages.xlf` (it's auto-generated)
- Don't forget to add Spanish `<target>` elements
- Don't interpolate inside `$localize` strings
- Don't leave translation units untranslated

## Troubleshooting

### Strings not appearing in messages.xlf

**Check**:

1. Did you use `i18n` or `$localize`?
2. Run `npm run extract-i18n` again
3. Check file is saved

### Spanish translation not showing

**Check**:

1. Did you add `<target>` to `messages.es-MX.xlf`?
2. Is the XML syntax correct?
3. Did you rebuild? (`npm run build:es`)

### Build fails with locale errors

**Check**:

1. Run `npm run extract-i18n` to ensure consistency
2. Verify XML is valid (no unclosed tags)
3. Check for typos in `<target>` elements

### "translation is missing" error

**Solution**:

- Some unit in `messages.xlf` has no corresponding `<target>` in `messages.es-MX.xlf`
- Run `/check-missing-translations` to find and fix them

## Resources

- [Internationalization Architecture](../architecture/i18n.md) — Detailed i18n guide
- [Angular i18n Documentation](https://angular.dev/guide/i18n)
- [XLIFF 1.2 Specification](https://docs.oasis-open.org/xliff/xliff-core/v1.2/xliff-core-v1.2.html)
