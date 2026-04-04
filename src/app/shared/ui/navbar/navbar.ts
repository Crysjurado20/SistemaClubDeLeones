import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../layout/layout.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, StyleClassModule, NgOptimizedImage],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly layoutService = inject(LayoutService, { optional: true });

  homeLink = input<string | any[]>('/');
  logoSrc = input<string>('img/logo_Leones.png');
  logoAlt = input<string>('Logo');
  title = input<string>('Club de Leones');

  showMenuToggle = input(false);

  showActions = input(false);
  showThemeToggle = input(false);

  showUser = input(false);
  userLabel = input('Administrador');

  showLogout = input(false);
  logoutLink = input<string | any[]>('/auth/login');

  darkTheme = computed(() => this.layoutService?.layoutConfig().darkTheme ?? false);

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
}
