import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-topbar',
  imports: [Navbar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-navbar
      [showMenuToggle]="true"
      [showActions]="true"
      [showThemeToggle]="false"
      [showUser]="true"
      [userLabel]="userLabel()"
      [showLogout]="true"
      logoutLink="/auth/login"
    />
  `,
})
export class AppTopbar {
  readonly userLabel = computed(() => {
    const rawUser = localStorage.getItem('usuario');
    const rawLabel = (localStorage.getItem('userLabel') ?? '').toString().trim();

    try {
      const parsed = rawUser ? (JSON.parse(rawUser) as any) : null;
      const nombres = (parsed?.nombres ?? rawLabel ?? '').toString().trim();
      const apellidos = (parsed?.apellidos ?? '').toString().trim();

      const nombre1 = nombres.split(/\s+/).filter(Boolean)[0] ?? '';
      const apellidoPaterno = apellidos.split(/\s+/).filter(Boolean)[0] ?? '';
      const label = [nombre1, apellidoPaterno].filter(Boolean).join(' ').trim();
      if (label) return label;
    } catch {
      // fallback abajo
    }

    const tokens = rawLabel.split(/\s+/).filter(Boolean);
    return tokens.slice(0, 2).join(' ') || 'Usuario';
  });
}
