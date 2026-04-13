import { Component, computed, inject, signal } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AuthService as SessionAuthService } from '../../../../core/services/auth.service';
import { LayoutService } from '../../../../shared/ui/layout/layout.service';
import { AccessibilityService, FontScale, TextSpacing } from '../../../../core/services/accessibility.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule],
    templateUrl: './topbar.html',
    styleUrl: './topbar.scss'
})
export class Topbar {
    private readonly sessionAuth = inject(SessionAuthService);
    private readonly layoutService = inject(LayoutService);
    private readonly accessibilityService = inject(AccessibilityService);

    constructor(public router: Router) { }

    readonly darkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);
    readonly fontScale = computed(() => this.accessibilityService.fontScale());
    readonly textSpacing = computed(() => this.accessibilityService.textSpacing());
    readonly reducedMotion = computed(() => this.accessibilityService.reducedMotion());
    readonly accessibilityOpen = signal(false);

    isLoggedIn(): boolean {
        return this.sessionAuth.isLoggedIn();
    }

    toggleDarkMode(): void {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme,
        }));
    }

    toggleAccessibilityPanel(): void {
        this.accessibilityOpen.update((v) => !v);
    }

    setFontScale(value: FontScale): void {
        this.accessibilityService.setFontScale(value);
    }

    setTextSpacing(value: TextSpacing): void {
        this.accessibilityService.setTextSpacing(value);
    }

    toggleReducedMotion(): void {
        this.accessibilityService.toggleReducedMotion();
    }

    goHomeByRole(): void {
        const homeRoute = this.sessionAuth.getHomeRouteForCurrentUser();
        void this.router.navigateByUrl(homeRoute);
    }
}