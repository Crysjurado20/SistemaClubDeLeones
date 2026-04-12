import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AuthApiService } from '../../services/auth.service';
import { FieldError } from '../../../../shared/ui/field-error/field-error';
import { Header } from '../../../../shared/ui/header/header';
import { LoadingOverlay } from '../../../../shared/ui/loading-overlay/loading-overlay';

@Component({
    selector: 'app-forgot-password',
    imports: [
        CommonModule,
        NgOptimizedImage,
        ReactiveFormsModule,
        RouterLink,
        ButtonModule,
        InputGroupModule,
        InputGroupAddonModule,
        InputTextModule,
        ToastModule,
        Header,
        LoadingOverlay,
        FieldError,
    ],
    templateUrl: './forgot-password.html',
    styleUrl: './forgot-password.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPassword {
    private readonly formBuilder = inject(NonNullableFormBuilder);
    private readonly authApi = inject(AuthApiService);
    private readonly messageService = inject(MessageService);

    readonly isLoading = signal(false);
    readonly submitted = signal(false);
    readonly requestSent = signal(false);
    readonly requestedEmail = signal('');

    readonly form = this.formBuilder.group({
        correo: ['', [Validators.required, Validators.email]],
    });

    get correoControl() {
        return this.form.controls.correo;
    }

    enviar(): void {
        if (this.isLoading()) return;

        this.submitted.set(true);

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.messageService.clear();
            this.messageService.add({
                severity: 'warn',
                summary: 'Revisa el formulario',
                detail: 'Ingresa un correo válido para continuar.',
            });
            return;
        }

        const correo = this.correoControl.value.trim();
        this.isLoading.set(true);

        this.authApi
            .solicitarRecuperacionContrasena({ correo })
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (response) => {
                    this.requestSent.set(true);
                    this.requestedEmail.set(correo);

                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Enlace enviado',
                        detail: response?.mensaje ?? 'Revisa tu bandeja de entrada y la carpeta de spam.',
                    });
                },
                error: (error) => {
                    console.error('Error solicitando recuperación:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'No se pudo enviar el enlace',
                        detail: error.error?.mensaje || 'Intenta nuevamente en unos minutos.',
                    });
                },
            });
    }
}