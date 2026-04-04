import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { Header } from "../../../../shared/ui/header/header";
import { AuthService } from '../../../../core/services/auth.service';

type MockRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    ButtonModule,
    CheckboxModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    PasswordModule,
    RippleModule,
    Header
],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email: string = '';

  password: string = '';

  checked: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  loginMock(role: MockRole): void {
    const labelByRole: Record<MockRole, string> = {
      ADMIN: 'Admin Demo',
      DOCTOR: 'Juan Perez',
      PATIENT: 'Maria Lopez',
    };

    this.authService.loginMock(role, labelByRole[role]);

    const routeByRole: Record<MockRole, string> = {
      ADMIN: '/reports-dashboard',
      DOCTOR: '/weekly-agenda',
      PATIENT: '/appointments',
    };

    void this.router.navigateByUrl(routeByRole[role]);
  }

 
}
