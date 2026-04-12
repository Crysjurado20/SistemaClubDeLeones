import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { AuthApiService } from '../../services/auth.service';
import { FieldError } from '../../../../shared/ui/field-error/field-error';
import { Header } from '../../../../shared/ui/header/header';
import { LoadingOverlay } from '../../../../shared/ui/loading-overlay/loading-overlay';

const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = (control.get('nuevaContrasena')?.value ?? '').toString();
    const confirmation = (control.get('confirmarContrasena')?.value ?? '').toString();

    if (!password || !confirmation) {
        return null;
    }

    return password === confirmation ? null : { passwordMismatch: true };
};

@Component({
    selector: 'app-reset-password',
    imports: [
        CommonModule,
        NgOptimizedImage,
        ReactiveFormsModule,
        RouterLink,
        ButtonModule,
        InputGroupModule,
        InputGroupAddonModule,
        PasswordModule,
        ProgressSpinnerModule,
        ToastModule,
        Header,
        LoadingOverlay,
        FieldError,
    ],
    templateUrl: './reset-password.html',
    styleUrl: './reset-password.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly formBuilder = inject(NonNullableFormBuilder);
    private readonly authApi = inject(AuthApiService);
    private readonly messageService = inject(MessageService);

    readonly isVerifyingToken = signal(true);
    readonly isLoading = signal(false);
    readonly submitted = signal(false);
    readonly token = signal('');
    readonly tokenState = signal<'checking' | 'valid' | 'invalid'>('checking');
    readonly completed = signal(false);

    readonly form = this.formBuilder.group(
        {
            nuevaContrasena: ['', [Validators.required, Validators.minLength(8)]],
            confirmarContrasena: ['', [Validators.required]],
        },
        { validators: [passwordMatchValidator] },
    );

    get nuevaContrasenaControl() {
        return this.form.controls.nuevaContrasena;
    }

    get confirmarContrasenaControl() {
        return this.form.controls.confirmarContrasena;
    }

    ngOnInit(): void {
        const token = this.route.snapshot.queryParamMap.get('token')?.trim() ?? '';
        this.token.set(token);

        if (!token) {
            this.tokenState.set('invalid');
            this.isVerifyingToken.set(false);
            return;
        }

        this.authApi
            .validarTokenRecuperacion({ token })
            .pipe(finalize(() => this.isVerifyingToken.set(false)))
            .subscribe({
                next: (response) => {
                    const valid = !!response?.esValido;
                    this.tokenState.set(valid ? 'valid' : 'invalid');

                    if (!valid) {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Enlace inválido',
                            detail: response?.mensaje ?? 'El enlace de recuperación no es válido o ha expirado.',
                        });
                    }
                },
                error: (error) => {
                    console.error('Error validando token de recuperación:', error);
                    this.tokenState.set('invalid');
                    this.messageService.add({
                        severity: 'error',
                        summary: 'No se pudo validar el enlace',
                        detail: error.error?.mensaje || 'El enlace de recuperación no es válido o ha expirado.',
                    });
                },
            });
    }

    restablecer(): void {
        if (this.isLoading() || this.completed() || this.tokenState() !== 'valid') {
            return;
        }

        this.submitted.set(true);

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.messageService.clear();
            this.messageService.add({
                severity: 'warn',
                summary: 'Revisa el formulario',
                detail: 'La nueva contraseña y su confirmación deben coincidir.',
            });
            return;
        }

        const nuevaContrasena = this.nuevaContrasenaControl.value.trim();
        const token = this.token();

        if (!token) {
            this.tokenState.set('invalid');
            return;
        }

        this.isLoading.set(true);

        this.authApi
            .restablecerContrasenaConToken({ token, nuevaContrasena })
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (response) => {
                    this.completed.set(true);
                    this.form.reset({ nuevaContrasena: '', confirmarContrasena: '' });
                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Contraseña actualizada',
                        detail: response?.mensaje ?? 'Tu contraseña fue actualizada correctamente.',
                    });
                },
                error: (error) => {
                    console.error('Error restableciendo contraseña:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'No se pudo actualizar',
                        detail: error.error?.mensaje || 'Verifica los datos e inténtalo nuevamente.',
                    });
                },
            });
    }
}