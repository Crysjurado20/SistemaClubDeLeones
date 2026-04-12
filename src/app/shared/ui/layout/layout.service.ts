import { Injectable, effect, signal, computed } from '@angular/core';

export interface LayoutConfig {
    preset: string;
    primary: string;
    surface: string | undefined | null;
    darkTheme: boolean;
    menuMode: string;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    configSidebarVisible: boolean;
    mobileMenuActive: boolean;
    menuHoverActive: boolean;
    activePath: string | null;
}

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    private readonly themeStorageKey = 'ui-theme';

    layoutConfig = signal<LayoutConfig>({
        preset: 'Aura',
        primary: 'emerald',
        surface: null,
        darkTheme: false,
        menuMode: 'static',
    });

    layoutState = signal<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        configSidebarVisible: false,
        mobileMenuActive: false,
        menuHoverActive: false,
        activePath: null,
    });

    theme = computed(() => (this.layoutConfig().darkTheme ? 'dark' : 'light'));

    isSidebarActive = computed(
        () => this.layoutState().overlayMenuActive || this.layoutState().mobileMenuActive,
    );

    isDarkTheme = computed(() => this.layoutConfig().darkTheme);

    getPrimary = computed(() => this.layoutConfig().primary);

    getSurface = computed(() => this.layoutConfig().surface);

    isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');

    transitionComplete = signal<boolean>(false);

    private initialized = false;

    constructor() {
        const storedDarkTheme = this.readStoredDarkTheme();
        if (storedDarkTheme !== null) {
            this.layoutConfig.update((prev) => ({
                ...prev,
                darkTheme: storedDarkTheme,
            }));
        }

        this.toggleDarkMode(this.layoutConfig());
        this.persistThemePreference(this.layoutConfig().darkTheme);

        effect(() => {
            const config = this.layoutConfig();

            if (!this.initialized || !config) {
                this.initialized = true;
                return;
            }

            this.persistThemePreference(config.darkTheme);
            this.handleDarkModeTransition(config);
        });
    }

    private readStoredDarkTheme(): boolean | null {
        try {
            const storedTheme = localStorage.getItem(this.themeStorageKey);
            if (storedTheme === 'dark') {
                return true;
            }

            if (storedTheme === 'light') {
                return false;
            }

            return null;
        } catch {
            return null;
        }
    }

    private persistThemePreference(isDarkTheme: boolean): void {
        try {
            localStorage.setItem(this.themeStorageKey, isDarkTheme ? 'dark' : 'light');
        } catch {
            // Ignore storage errors to keep app functional in restricted browsers.
        }
    }

    private handleDarkModeTransition(config: LayoutConfig): void {
        const supportsViewTransition = 'startViewTransition' in document;

        if (supportsViewTransition) {
            this.startViewTransition(config);
        } else {
            this.toggleDarkMode(config);
        }
    }

    private startViewTransition(config: LayoutConfig): void {
        document.startViewTransition(() => {
            this.toggleDarkMode(config);
        });
    }

    toggleDarkMode(config?: LayoutConfig): void {
        const _config = config || this.layoutConfig();
        if (_config.darkTheme) {
            document.documentElement.classList.add('app-dark');
        } else {
            document.documentElement.classList.remove('app-dark');
        }

        document.documentElement.style.colorScheme = _config.darkTheme ? 'dark' : 'light';
    }

    onMenuToggle() {
        if (this.isOverlay()) {
            this.layoutState.update((prev) => ({
                ...prev,
                overlayMenuActive: !this.layoutState().overlayMenuActive,
            }));
        }

        if (this.isDesktop()) {
            this.layoutState.update((prev) => ({
                ...prev,
                staticMenuDesktopInactive: !this.layoutState().staticMenuDesktopInactive,
            }));
        } else {
            this.layoutState.update((prev) => ({
                ...prev,
                mobileMenuActive: !this.layoutState().mobileMenuActive,
            }));
        }
    }

    showConfigSidebar() {
        this.layoutState.update((prev) => ({ ...prev, configSidebarVisible: true }));
    }

    hideConfigSidebar() {
        this.layoutState.update((prev) => ({ ...prev, configSidebarVisible: false }));
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }
}
