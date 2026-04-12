import { Component, computed, inject } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AuthService as SessionAuthService } from '../../../../core/services/auth.service';
import { LayoutService } from '../../../../shared/ui/layout/layout.service';

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

    constructor(public router: Router) { }

    readonly darkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

    isLoggedIn(): boolean {
        return this.sessionAuth.isLoggedIn();
    }

    toggleDarkMode(): void {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme,
        }));
    }

    goHomeByRole(): void {
        const homeRoute = this.sessionAuth.getHomeRouteForCurrentUser();
        void this.router.navigateByUrl(homeRoute);
    }
}