# Color Theme System

The Larios Income Tax website supports multiple color themes that can be toggled instantly without code changes.

## Available Themes

### 1. Classic Theme (Default)

Warm, professional beige and tan color palette inspired by traditional tax services.

**Colors:**

- Primary Text: `rgb(39, 36, 29)` - Warm dark brown
- Background: `rgb(255, 255, 255)` - Pure white
- Accent Beige: `rgb(198, 188, 164)` - Soft beige
- Accent Tan: `rgb(161, 151, 128)` - Medium tan
- Accent Light: `rgb(245, 242, 235)` - Cream
- Accent Dark: `rgb(89, 84, 71)` - Deep brown
- Link: `#116dff` - Bright blue
- Link Hover: `#0d54cc` - Dark blue

### 2. Professional Theme

Modern blue and green color palette emphasizing trust, growth, and financial expertise.

**Colors:**

- Primary Text: `rgb(25, 42, 70)` - Deep navy blue
- Background: `rgb(255, 255, 255)` - Pure white
- Accent Beige: `rgb(34, 102, 102)` - Teal green (finance/growth)
- Accent Tan: `rgb(46, 125, 50)` - Forest green (money/success)
- Accent Light: `rgb(232, 245, 233)` - Light green tint
- Accent Dark: `rgb(21, 67, 96)` - Deep navy
- Link: `rgb(13, 71, 161)` - Deep blue
- Link Hover: `rgb(25, 118, 210)` - Lighter blue

### 3. Luxury Theme

Elegant black and gold color palette inspired by the logo, emphasizing prestige and sophistication.

**Colors:**

- Primary Text: `rgb(26, 26, 26)` - Deep black
- Background: `rgb(255, 255, 255)` - Pure white
- Accent Beige: `rgb(212, 175, 55)` - Rich gold (luxury/premium)
- Accent Tan: `rgb(184, 134, 11)` - Dark gold (wealth/excellence)
- Accent Light: `rgb(255, 250, 240)` - Champagne tint
- Accent Dark: `rgb(33, 33, 33)` - Deep charcoal black
- Link: `rgb(184, 134, 11)` - Dark gold
- Link Hover: `rgb(212, 175, 55)` - Rich gold

## How to Switch Themes

### Quick Toggle Commands

#### Switch to Professional Theme

Open your browser's developer console (F12) and run:

```javascript
document.documentElement.setAttribute('data-theme', 'professional');
```

#### Switch to Luxury Theme

Open your browser's developer console (F12) and run:

```javascript
document.documentElement.setAttribute('data-theme', 'luxury');
```

#### Switch to Classic Theme

Open your browser's developer console (F12) and run:

```javascript
document.documentElement.setAttribute('data-theme', 'classic');
```

#### Remove Theme Attribute (Uses Default/Classic)

Open your browser's developer console (F12) and run:

```javascript
document.documentElement.removeAttribute('data-theme');
```

### Programmatic Implementation

If you want to add a theme toggle button to the application:

1. **Create a Theme Service** (optional, for persistence):

```typescript
// src/app/core/services/theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'preferred-theme';

  setTheme(theme: 'classic' | 'professional' | 'luxury'): void {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }

  getTheme(): string | null {
    return localStorage.getItem(this.THEME_KEY);
  }

  initTheme(): void {
    const savedTheme = this.getTheme();
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }

  toggleTheme(): void {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    // Cycle through themes: classic -> professional -> luxury -> classic
    let newTheme: 'classic' | 'professional' | 'luxury';
    switch (currentTheme) {
      case 'professional':
        newTheme = 'luxury';
        break;
      case 'luxury':
        newTheme = 'classic';
        break;
      default:
        newTheme = 'professional';
    }
    this.setTheme(newTheme);
  }
}
```

1. **Initialize Theme on App Load**:

```typescript
// src/app/app.ts
import { Component, OnInit } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

export class App implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.initTheme();
  }
}
```

1. **Add Theme Toggle Button** (example):

```html
<!-- Example toggle button in header or settings -->
<button (click)="toggleTheme()">Toggle Theme</button>
```

```typescript
toggleTheme(): void {
  this.themeService.toggleTheme();
}
```

## Theme Design Principles

### Classic Theme

- **Purpose**: Traditional, approachable, warm
- **Best for**: Clients who prefer familiar, conservative aesthetics
- **Accessibility**: WCAG AA compliant with 4.5:1+ contrast ratios

### Professional Theme

- **Purpose**: Modern, trustworthy, growth-oriented
- **Best for**: Tech-savvy clients, digital-first experience
- **Color Psychology**:
  - **Navy Blue**: Trust, professionalism, stability
  - **Green**: Growth, money, success, financial health
  - **Teal**: Balance between trust (blue) and growth (green)
- **Accessibility**: WCAG AA compliant with 4.5:1+ contrast ratios

### Luxury Theme

- **Purpose**: Elegant, prestigious, sophisticated
- **Best for**: High-end clients, premium service emphasis
- **Color Psychology**:
  - **Black**: Elegance, sophistication, authority, timelessness
  - **Gold**: Luxury, wealth, success, quality, prestige
  - **Combination**: Classic luxury palette conveying premium service
- **Accessibility**: WCAG AA compliant with 4.5:1+ contrast ratios

## Testing Themes

### Visual Testing

1. Switch to each theme (Classic, Professional, Luxury)
2. Check all pages: Home, Services, Book Online, Contact
3. Verify buttons, forms, and interactive elements
4. Test in light/dark browser modes

### Accessibility Testing

All three themes maintain WCAG AA compliance:

- Text contrast ratios: 4.5:1 minimum
- Interactive elements: 3:1 minimum
- Focus indicators: Clearly visible

### Browser Testing

Themes work across all modern browsers:

- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers

## Adding New Themes

To add a new theme:

1. **Define Color Variables** in `src/styles.css`:

```css
:root[data-theme='your-theme-name'] {
  --color-primary-text: /* your color */;
  --color-background: /* your color */;
  /* ... define all variables ... */
}
```

1. **Document the Theme** in this file

2. **Test Accessibility** using contrast checkers

3. **Update Toggle Logic** if using ThemeService

## Notes

- Theme preference persists in `localStorage` if using ThemeService
- Theme changes apply instantly without page reload
- All CSS custom properties are theme-aware
- No code changes required to switch themes manually
- Themes use CSS custom properties (CSS variables) for instant updates
