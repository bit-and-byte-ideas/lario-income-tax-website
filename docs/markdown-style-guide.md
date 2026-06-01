# Markdown Style Guide

## Overview

This document records common markdown linting violations and how to fix them. Use this as a
reference when writing or editing markdown files in this project.

## Common Violations and Fixes

### MD013: Line Too Long

**Error**: Line length exceeds 120 characters (except in code blocks and tables)

**Fix**: Break long lines into multiple lines

```markdown
<!-- ❌ Bad -->

This is a very long line that exceeds the 120 character limit and will trigger the MD013 linting error because it's too long.

<!-- ✅ Good -->

This is a very long line that exceeds the 120 character limit and will trigger the MD013 linting
error because it's too long.
```

### MD040: Missing Code Block Language

**Error**: Fenced code blocks must specify a language

**Fix**: Add language identifier after opening backticks

```markdown
<!-- ❌ Bad -->

` ` `code here` ` `

<!-- ✅ Good -->

` ` `bash
code here
` ` `

` ` `typescript
code here
` ` `

` ` `text
plain text or directory structure
` ` `
```

**Common language identifiers**:

- `bash` - Shell commands
- `typescript` or `ts` - TypeScript code
- `javascript` or `js` - JavaScript code
- `json` - JSON data
- `html` - HTML markup
- `css` - CSS styles
- `text` - Plain text, directory trees, or unknown format

### MD029: Ordered List Numbering

**Error**: Inconsistent ordered list numbering (should use 1/1/1 style)

**Fix**: Use `1.` for all ordered list items (auto-numbering)

```markdown
<!-- ❌ Bad -->

1. First item
2. Second item
3. Third item

<!-- ✅ Good -->

1. First item
1. Second item
1. Third item
```

**Why?** Using all `1.` makes it easier to reorder items without renumbering.

### MD022: Headings Need Blank Lines

**Error**: Headings should be surrounded by blank lines

**Fix**: Add blank line before and after headings

```markdown
<!-- ❌ Bad -->

## Heading

Content immediately after

<!-- ✅ Good -->

## Heading

Content with blank line
```

### MD032: Lists Need Blank Lines

**Error**: Lists should be surrounded by blank lines

**Fix**: Add blank line before and after lists

```markdown
<!-- ❌ Bad -->

Some text

- List item 1
- List item 2
  More text

<!-- ✅ Good -->

Some text

- List item 1
- List item 2

More text
```

### MD031: Code Blocks Need Blank Lines

**Error**: Fenced code blocks should be surrounded by blank lines

**Fix**: Add blank line before and after code blocks

```markdown
<!-- ❌ Bad -->

Some text

` ` `bash
code here
` ` `

More text

<!-- ✅ Good -->

Some text

` ` `bash
code here
` ` `

More text
```

### MD034: No Bare URLs

**Error**: URLs should be wrapped in angle brackets or markdown links

**Fix**: Use proper markdown link syntax or angle brackets

```markdown
<!-- ❌ Bad -->

Visit https://example.com for more info

<!-- ✅ Good -->

Visit <https://example.com> for more info
Visit [example.com](https://example.com) for more info
```

### MD003: Header Style

**Error**: Headers must use ATX style (with `#`)

**Fix**: Use `#` symbols instead of underline style

```markdown
<!-- ❌ Bad - Setext style -->

# Header 1

## Header 2

<!-- ✅ Good - ATX style -->

# Header 1

## Header 2
```

### MD004: List Style

**Error**: Unordered lists must use dash style

**Fix**: Use `-` for list items (not `*` or `+`)

```markdown
<!-- ❌ Bad -->

- Item 1
- Item 2

<!-- ✅ Good -->

- Item 1
- Item 2
```

### MD033: Inline HTML

**Error**: HTML tags are restricted (only `<br>`, `<details>`, `<summary>` allowed)

**Fix**: Use markdown syntax instead, or use allowed HTML tags

```markdown
<!-- ❌ Bad -->
<div>Content</div>
<span>Text</span>

<!-- ✅ Good -->

**Content** (use markdown bold)
_Text_ (use markdown italic)

<!-- ✅ Allowed HTML -->

Line break<br>

<details>
  <summary>Click to expand</summary>
  Hidden content
</details>
```

## Quick Reference

### Ordered Lists in Markdown

Always use `1.` for all items (markdownlint style 1/1/1):

````markdown
1. First step

   Additional info for first step

1. Second step

   ```bash
   code example
   ```
````

1. Third step

````<!-- end example -->

### Code Block Languages

Always specify a language for code blocks:

| Content Type | Language Tag |
|--------------|--------------|
| Shell/Terminal | `bash` |
| TypeScript | `typescript` or `ts` |
| JavaScript | `javascript` or `js` |
| JSON | `json` |
| HTML | `html` |
| CSS | `css` |
| YAML | `yaml` |
| Plain text/tree | `text` |
| Markdown | `markdown` |

### Line Length

- **Maximum**: 120 characters per line
- **Exceptions**: Code blocks, tables, and URLs are exempt
- **Fix**: Break long sentences across multiple lines

## Auto-fixing

Most violations can be auto-fixed:

```bash
npm run lint:md:fix
````

This will automatically fix:

- MD022 (blank lines around headings)
- MD032 (blank lines around lists)
- MD031 (blank lines around code blocks)
- MD004 (list marker style)
- And many others

## Manual Fixes Required

These violations need manual fixing:

- MD013 (line length) - Break lines manually
- MD040 (code language) - Add language identifier
- MD034 (bare URLs) - Wrap in proper syntax
- MD033 (HTML usage) - Convert to markdown or use allowed tags

## Checking Your Markdown

Before committing, check for violations:

```bash
npm run lint:md
```

Or let pre-commit hooks handle it automatically!

## Configuration

Markdown linting rules are defined in `.markdownlint.json` in the project root

Current configuration:

- **Line length**: 120 characters (code/tables exempt)
- **Header style**: ATX (`#` symbols)
- **List marker**: Dash (`-`)
- **List numbering**: 1/1/1 style
- **Code blocks**: Must have language specified
- **Allowed HTML**: `<br>`, `<details>`, `<summary>` only

## Examples from This Project

### Fixed MD013 Violation

**Before**:

```markdown
This project uses `pre-commit` framework with Prettier and markdownlint to ensure code quality and consistent formatting on every commit.
```

**After**:

```markdown
This project uses `pre-commit` framework with Prettier and markdownlint to ensure code quality and
consistent formatting on every commit.
```

### Fixed MD040 Violation

**Before**:

````markdown
```
src/
├── app/
```
````

**After**:

````markdown
```text
src/
├── app/
```
````

### Fixed MD029 Violation

**Before**:

```markdown
1. First item
2. Second item
3. Third item
```

**After**:

```markdown
1. First item
1. Second item
1. Third item
```

## Best Practices

1. **Run linter before committing** - Use `npm run lint:md:fix`
1. **Specify code block languages** - Always add language identifier
1. **Keep lines under 120 chars** - Break long lines manually
1. **Use blank lines** - Separate headings, lists, and code blocks
1. **Use markdown syntax** - Avoid HTML when possible
1. **Use 1/1/1 numbering** - Makes reordering easier

## Resources

- [markdownlint rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- `.markdownlint.json` - Project configuration (in project root)
- [pre-commit-setup.md](guides/pre-commit.md) - Pre-commit hook details
