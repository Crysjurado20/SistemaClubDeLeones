import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../layout/layout.service';
import { AuthService as SessionAuthService } from '../../../core/services/auth.service';
import { AccessibilityService, FontScale, TextSpacing } from '../../../core/services/accessibility.service';

@Component({
    selector: 'app-navbar',
    imports: [CommonModule, RouterModule, StyleClassModule, NgOptimizedImage],
    templateUrl: './navbar.html',
    styleUrl: './navbar.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
    private readonly layoutService = inject(LayoutService, { optional: true });
    private readonly router = inject(Router);
    private readonly authService = inject(SessionAuthService);
    private readonly accessibilityService = inject(AccessibilityService);

    homeLink = input<string | any[]>('/');
    logoSrc = input<string>('img/logo_Leones.png');
    logoAlt = input<string>('Logo');
    title = input<string>('Club de Leones');

    showMenuToggle = input(false);

    showActions = input(false);
    showThemeToggle = input(true);

    showUser = input(false);
    userLabel = input('Administrador');

    showLogout = input(false);
    logoutLink = input<string | any[]>('/auth/login');

    accessibilityOpen = signal(false);

    darkTheme = computed(() => this.layoutService?.layoutConfig().darkTheme ?? false);
    fontScale = computed(() => this.accessibilityService.fontScale());
    textSpacing = computed(() => this.accessibilityService.textSpacing());
    reducedMotion = computed(() => this.accessibilityService.reducedMotion());

    onMenuToggle() {
        this.layoutService?.onMenuToggle();
    }

    toggleDarkMode() {
        if (!this.layoutService) return;

        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme,
        }));
    }

    toggleAccessibilityPanel() {
        this.accessibilityOpen.update((current) => !current);
    }

    setFontScale(value: FontScale) {
        this.accessibilityService.setFontScale(value);
    }

    setTextSpacing(value: TextSpacing) {
        this.accessibilityService.setTextSpacing(value);
    }

    toggleReducedMotion() {
        this.accessibilityService.toggleReducedMotion();
    }

    onLogout() {
        this.authService.logout();

        const link = this.logoutLink();
        if (Array.isArray(link)) {
            void this.router.navigate(link);
            return;
        }

        void this.router.navigateByUrl(link);
    }
}
