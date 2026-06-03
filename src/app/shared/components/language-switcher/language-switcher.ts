import { Component, Inject, LOCALE_ID } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

interface Language {
  code: string;
  flagSrc: string;
  label: string;
  path: string;
}

@Component({
  selector: 'app-language-switcher',
  imports: [CommonModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
})
export class LanguageSwitcher {
  currentLocale: string;

  languages: Language[] = [
    { code: 'en-US', flagSrc: '/assets/images/us-flag.svg', label: 'English', path: '/' },
    { code: 'es-MX', flagSrc: '/assets/images/mx-flag.svg', label: 'Español', path: '/es/' },
  ];

  constructor(
    @Inject(LOCALE_ID) locale: string,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.currentLocale = locale;
  }

  switchLanguage(language: Language): void {
    if (language.code !== this.currentLocale) {
      // Get the current path without the locale prefix
      const currentPath = this.document.location.pathname;
      let newPath = currentPath;

      // Remove current locale prefix if exists
      if (this.currentLocale === 'es-MX' && currentPath.startsWith('/es/')) {
        newPath = currentPath.substring(3);
      } else if (this.currentLocale === 'en-US' && currentPath.startsWith('/')) {
        newPath = currentPath;
      }

      // Add new locale prefix
      if (language.code === 'es-MX') {
        newPath = '/es' + (newPath.startsWith('/') ? newPath : '/' + newPath);
      }

      // Ensure path starts with /
      if (!newPath.startsWith('/')) {
        newPath = '/' + newPath;
      }

      // Navigate to the new locale
      this.document.location.href = newPath;
    }
  }

  isCurrentLanguage(language: Language): boolean {
    return language.code === this.currentLocale;
  }
}
