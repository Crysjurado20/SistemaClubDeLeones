import { Injectable, signal } from '@angular/core';

export type FontScale = 'xsmall' | 'small' | 'normal' | 'large' | 'xlarge';
export type TextSpacing = 'normal' | 'wide';

type AccessibilityPrefs = {
  fontScale: FontScale;
  textSpacing: TextSpacing;
  reducedMotion: boolean;
};

@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  private readonly storageKey = 'a11y-preferences-v1';

  readonly fontScale = signal<FontScale>('normal');
  readonly textSpacing = signal<TextSpacing>('normal');
  readonly reducedMotion = signal(false);

  constructor() {
    this.loadPreferences();
    this.applyPreferences();
  }

  setFontScale(value: FontScale): void {
    this.fontScale.set(value);
    this.persistAndApply();
  }

  setTextSpacing(value: TextSpacing): void {
    this.textSpacing.set(value);
    this.persistAndApply();
  }

  toggleReducedMotion(): void {
    this.reducedMotion.set(!this.reducedMotion());
    this.persistAndApply();
  }

  private persistAndApply(): void {
    this.persistPreferences();
    this.applyPreferences();
  }

  private loadPreferences(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AccessibilityPrefs>;
        if (
          parsed.fontScale === 'xsmall' ||
          parsed.fontScale === 'small' ||
          parsed.fontScale === 'normal' ||
          parsed.fontScale === 'large' ||
          parsed.fontScale === 'xlarge'
        ) {
          this.fontScale.set(parsed.fontScale);
        }
        if (parsed.textSpacing === 'normal' || parsed.textSpacing === 'wide') {
          this.textSpacing.set(parsed.textSpacing);
        }
        this.reducedMotion.set(Boolean(parsed.reducedMotion));
        return;
      }
    } catch {
      // Ignore storage errors; defaults and runtime toggles remain available.
    }

    // Respect OS preference only when there is no saved preference yet.
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      this.reducedMotion.set(true);
    }
  }

  private persistPreferences(): void {
    try {
      const payload: AccessibilityPrefs = {
        fontScale: this.fontScale(),
        textSpacing: this.textSpacing(),
        reducedMotion: this.reducedMotion(),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(payload));
    } catch {
      // Ignore storage errors in restrictive browser contexts.
    }
  }

  private applyPreferences(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;

    root.classList.remove('a11y-font-xsmall', 'a11y-font-small', 'a11y-font-normal', 'a11y-font-large', 'a11y-font-xlarge');
    root.classList.add(`a11y-font-${this.fontScale()}`);

    root.classList.toggle('a11y-spacing-wide', this.textSpacing() === 'wide');
    root.classList.toggle('a11y-reduce-motion', this.reducedMotion());
  }
}
