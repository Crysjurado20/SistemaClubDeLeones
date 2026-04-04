import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-topbar',
  imports: [Navbar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-navbar
      [showMenuToggle]="true"
      [showActions]="true"
      [showThemeToggle]="true"
      [showUser]="true"
      userLabel="Administrador"
      [showLogout]="true"
      logoutLink="/auth/login"
    />
  `,
})
export class AppTopbar {
}
