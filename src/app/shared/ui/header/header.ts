import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-header',
  imports: [Navbar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
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
}
