import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Importante para la redirección
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Header } from '../../../../shared/ui/header/header';
import { LoadingOverlay } from '../../../../shared/ui/loading-overlay/loading-overlay';
import { FieldError } from '../../../../shared/ui/field-error/field-error';
import { AuthApiService } from '../../services/auth.service';
import { AuthService as SessionAuthService } from '../../../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        NgOptimizedImage,
        InputTextModule,
        PasswordModule,
        CheckboxModule,
        InputGroupModule,
        InputGroupAddonModule,
        ButtonModule,
        FluidModule,
        ToastModule,
        Header
        ,
        LoadingOverlay,
        FieldError
    ],
    templateUrl: './login.html'
})
export class Login {

    authApi = inject(AuthApiService);
    sessionAuth = inject(SessionAuthService);
    router = inject(Router);
    route = inject(ActivatedRoute);
    messageService = inject(MessageService);

    checked = false;
    isLoading = signal(false);
    submitted = signal(false);

    credenciales = {
        correo: '',
        contrasena: ''
    };

    private normalizeLoginResponse(raw: unknown): { token: string; idUsuario: number; nombres: string; rol: string } {
        const root = (raw ?? {}) as Record<string, unknown>;
        const nested = (root['data'] ?? root['Data'] ?? root['usuario'] ?? root['Usuario'] ?? {}) as Record<string, unknown>;

        const rawToken = (root['token'] ?? root['Token'] ?? root['access_token'] ?? root['accessToken'] ?? nested['token'] ?? nested['Token'] ?? nested['access_token'] ?? nested['accessToken'] ?? '').toString().trim();
        const token = rawToken.replace(/^Bearer\s+/i, '').trim();
        const rol = (root['rol'] ?? root['Rol'] ?? root['role'] ?? root['Role'] ?? nested['rol'] ?? nested['Rol'] ?? nested['role'] ?? nested['Role'] ?? '').toString().trim();
        const nombres = (root['nombres'] ?? root['Nombres'] ?? root['nombre'] ?? root['Nombre'] ?? nested['nombres'] ?? nested['Nombres'] ?? nested['nombre'] ?? nested['Nombre'] ?? '').toString().trim();
        const idRaw = root['idUsuario'] ?? root['IdUsuario'] ?? root['id'] ?? root['Id'] ?? nested['idUsuario'] ?? nested['IdUsuario'] ?? nested['id'] ?? nested['Id'];
        const idUsuario = typeof idRaw === 'number' ? idRaw : Number(idRaw ?? 0);

        return {
            token,
            idUsuario: Number.isFinite(idUsuario) && idUsuario > 0 ? idUsuario : 0,
            nombres,
            rol,
        };
    }

    private isValidEmail(value: string): boolean {
        const v = (value ?? '').toString().trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    private getSafeReturnUrl(): string | null {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl')?.trim() ?? '';
        if (!returnUrl.startsWith('/')) return null;
        if (returnUrl.startsWith('/auth/login')) return null;
        return returnUrl;
    }

    iniciarSesion() {
        if (this.isLoading()) {
            return;
        }
        this.submitted.set(true);

        if (!this.credenciales.correo || !this.credenciales.contrasena) {
            this.messageService.clear();
            this.messageService.add({
                severity: 'warn',
                summary: 'Atención',
                detail: 'Revisa los campos marcados e inténtalo de nuevo.',
            });
            return;
        }

        if (!this.isValidEmail(this.credenciales.correo)) {
            this.messageService.clear();
            this.messageService.add({
                severity: 'warn',
                summary: 'Atención',
                detail: 'Ingresa un correo válido.',
            });
            return;
        }

        this.isLoading.set(true);

        this.authApi
            .login(this.credenciales)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (respuesta) => {
                    const normalized = this.normalizeLoginResponse(respuesta);
                    if (!normalized.token) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'No se pudo iniciar sesión',
                            detail: 'El servidor no devolvió un token válido.',
                        });
                        return;
                    }

                    // Limpia cualquier sesión anterior (por ejemplo tokens viejos en access_token/jwt)
                    // para evitar desincronización entre el JWT (guards/interceptor) y localStorage.usuario.
                    this.sessionAuth.logout();

                    localStorage.setItem('token', normalized.token);
                    localStorage.setItem('userLabel', normalized.nombres);
                    localStorage.setItem('usuario', JSON.stringify({
                        idUsuario: normalized.idUsuario,
                        nombres: normalized.nombres,
                        rol: normalized.rol
                    }));

                    const returnUrl = this.getSafeReturnUrl();
                    if (returnUrl) {
                        void this.router.navigateByUrl(returnUrl);
                        return;
                    }

                    const roleForHome = normalized.rol || this.sessionAuth.getPrimaryAppRole();
                    const homeRoute = this.sessionAuth.getHomeRouteByRole(roleForHome);
                    void this.router.navigateByUrl(homeRoute);
                },
                error: (err) => {
                    console.error('Error en login:', err);

                    const connectionError =
                        err?.status === 0 ||
                        (typeof err?.message === 'string' &&
                            err.message.toLowerCase().includes('failed to fetch'));

                    const detail = connectionError
                        ? 'No se pudo conectar con la API. Verifica que el backend esté ejecutándose.'
                        : err.error?.mensaje || 'Credenciales incorrectas. Intenta de nuevo.';

                    this.messageService.add({
                        severity: 'error',
                        summary: 'No se pudo iniciar sesión',
                        detail,
                    });
                }
            });
    }

    loginMock(role: 'ADMIN' | 'MEDICO' | 'PATIENT') {
        this.sessionAuth.loginMock(role);
        const homeRoute = this.sessionAuth.getHomeRouteByRole(role);
        void this.router.navigateByUrl(homeRoute);
    }
}