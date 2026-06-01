# Code Quality

## Overview

This project enforces high code quality standards through automated tooling and pre-commit hooks.

## Tools

### Prettier

**Purpose:** Automatic code formatting

**Files Formatted:**

- TypeScript (`.ts`, `.tsx`)
- JavaScript (`.js`, `.jsx`)
- CSS (`.css`, `.scss`)
- HTML (`.html`)
- JSON (`.json`)
- YAML (`.yaml`, `.yml`)
- Markdown (`.md`)

**Configuration:** `.prettierrc.json`

**Key Rules:**

- Single quotes (except JSON)
- 100 character line width
- 2 space indentation
- Semicolons required
- LF line endings
- ES5 trailing commas

**Commands:**

```bash
npm run format           # Format all files
npm run format:check     # Check formatting
```

### markdownlint

**Purpose:** Markdown linting and consistency

**Configuration:** `.markdownlint.json`

**Key Rules:**

- ATX-style headers (`#` instead of underline)
- Dash-style lists (`-` instead of `*` or `+`)
- 120 character line length
- Fenced code blocks with language
- Blank lines around headings/lists/code

**Commands:**

```bash
npm run lint:md          # Check markdown
npm run lint:md:fix      # Fix markdown issues
```

**Common Violations:**

- MD013: Line too long
- MD040: Missing code block language
- MD029: Ordered list numbering (use 1/1/1 style)
- MD022: Missing blank lines around headings
- MD032: Missing blank lines around lists

See [Markdown Style Guide](markdown-style-guide.md) for details.

### TypeScript

**Purpose:** Static type checking and code analysis

**Configuration:** `tsconfig.json`

**Features:**

- Strict mode enabled
- Null checks enforced
- No implicit any
- Strict property initialization

**Commands:**

```bash
ng build     # Compiles and checks types
ng lint      # Runs linter (when configured)
```

### Pre-commit Hooks

**Purpose:** Automatic code quality checks before commit

**Framework:** pre-commit (Python-based)

**Configuration:** `.pre-commit-config.yaml`

**Hooks Enabled:**

1. **Prettier** - Auto-formats code
1. **markdownlint** - Fixes markdown issues
1. **Trailing whitespace** - Removes trailing spaces
1. **End of file** - Ensures newline at EOF
1. **YAML syntax** - Validates YAML files
1. **JSON syntax** - Validates JSON files
1. **Merge conflicts** - Detects conflict markers
1. **Line endings** - Enforces LF endings
1. **Large files** - Prevents commits > 1MB

**Installation:**

```bash
pre-commit install
```

**Commands:**

```bash
pre-commit run --all-files    # Run on all files
pre-commit autoupdate         # Update hooks
```

**Bypass (Not Recommended):**

```bash
git commit --no-verify -m "message"
```

See [Pre-commit Setup](pre-commit-setup.md) for detailed documentation.

## Code Standards

### TypeScript Style

**Naming Conventions:**

- Classes: PascalCase (`UserService`)
- Interfaces: PascalCase with I prefix (`IUser`)
- Variables: camelCase (`userName`)
- Constants: UPPER_SNAKE_CASE (`API_URL`)
- Files: kebab-case (`user-service.ts`)

**Best Practices:**

- Use `const` and `let`, avoid `var`
- Prefer arrow functions
- Use async/await over promises
- Type everything explicitly
- Avoid `any` type

### Angular Style Guide

Follow the [Angular Style Guide](https://angular.dev/style-guide):

- One component per file
- Use barrel exports
- Lazy load feature modules
- Use OnPush change detection
- Unsubscribe from observables

### Component Structure

```typescript
@Component({
  selector: 'app-feature-name',
  templateUrl: './feature-name.component.html',
  styleUrls: ['./feature-name.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureNameComponent implements OnInit, OnDestroy {
  // Public properties
  public title: string = 'Feature';

  // Private properties
  private subscription = new Subscription();

  constructor(private service: FeatureService) {}

  ngOnInit(): void {
    // Initialization logic
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Public methods
  public handleClick(): void {
    // Event handling
  }

  // Private methods
  private loadData(): void {
    // Data loading
  }
}
```

### Service Structure

```typescript
@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getData(): Observable<Data> {
    return this.http.get<Data>(`${this.apiUrl}/data`);
  }
}
```

## Testing Standards

### Unit Tests

**Framework:** Vitest

**Coverage Target:** 80%+

**Best Practices:**

- Test public API only
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Test edge cases

**Example:**

```typescript
describe('FeatureService', () => {
  let service: FeatureService;

  beforeEach(() => {
    service = new FeatureService();
  });

  it('should return data', () => {
    // Arrange
    const expected = { id: 1, name: 'Test' };

    // Act
    const result = service.getData();

    // Assert
    expect(result).toEqual(expected);
  });
});
```

**Commands:**

```bash
ng test                                    # Run all tests
ng test --include='**/service.spec.ts'    # Run specific test
```

## Security Checks

### Preventing Common Vulnerabilities

**XSS (Cross-Site Scripting):**

- Angular sanitizes templates automatically
- Avoid `bypassSecurityTrust*` unless necessary
- Sanitize user input

**CSRF (Cross-Site Request Forgery):**

- Implement CSRF tokens in API
- Use HTTP interceptor for token management

**Injection Attacks:**

- Never concatenate user input in queries
- Use parameterized queries
- Validate all inputs

**Dependency Vulnerabilities:**

```bash
npm audit                # Check for vulnerabilities
npm audit fix            # Fix vulnerabilities
```

## Performance Guidelines

### Bundle Size

**Budgets** (configured in `angular.json`):

- Initial bundle: 500kB warning, 1MB error
- Component styles: 4kB warning, 8kB error

**Optimization:**

- Lazy load feature modules
- Use production build (`ng build`)
- Enable AOT compilation
- Tree shake unused code

### Runtime Performance

- Use OnPush change detection
- Implement trackBy in ngFor
- Avoid function calls in templates
- Use async pipe for observables
- Optimize images and assets

## Continuous Integration

### Pre-commit Stage

- Prettier formatting
- Markdown linting
- Syntax validation
- Large file check

### Build Stage

- TypeScript compilation
- Unit tests
- Bundle size check
- Production build

### Deployment Stage

- Terraform validation
- Infrastructure deployment
- Application deployment to Azure Static Web Apps
- Deployment verification

## Code Review Guidelines

### Checklist

- [ ] Code follows Angular style guide
- [ ] Types are explicit (no `any`)
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No console.log statements
- [ ] Error handling is implemented
- [ ] Code is formatted (Prettier)
- [ ] Commits follow convention

### Review Focus

1. **Architecture** - Does it fit the pattern?
1. **Security** - Any vulnerabilities?
1. **Performance** - Any bottlenecks?
1. **Testability** - Can it be tested?
1. **Maintainability** - Is it readable?

## Resources

- [Angular Style Guide](https://angular.dev/style-guide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [markdownlint Rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- [Markdown Style Guide](markdown-style-guide.md)
- [Pre-commit Setup](pre-commit-setup.md)
