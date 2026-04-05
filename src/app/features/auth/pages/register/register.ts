import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FluidModule } from 'primeng/fluid';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Header } from "../../../../shared/ui/header/header";
import { LoadingOverlay } from '../../../../shared/ui/loading-overlay/loading-overlay';
import { FieldError } from '../../../../shared/ui/field-error/field-error';
import { AuthApiService, RegistroPacienteRequest } from '../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-register-form',
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    SelectModule,
    DatePickerModule,
    InputGroupModule,
    InputGroupAddonModule,
    FluidModule,
    ToastModule,
    Header,
    LoadingOverlay,
    FieldError
],
    templateUrl: './register.html'
})
export class Register {

    private readonly authApi = inject(AuthApiService);
    private readonly router = inject(Router);
    private readonly messageService = inject(MessageService);

    isLoading = signal(false);
    submitted = signal(false);

    private static readonly MIN_EDAD_ANIOS = 1;
    readonly maxFechaNacimiento = this.calcMaxFechaNacimiento();
    
    usuario = {
        cedula: '',
        primerNombre: '',
        segundoNombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        fechaNacimiento: null,
        genero: null,
        direccion: '',
        telefono: '',
        correo: '',
        contrasena: '',
        terminos: false
    };

    opcionesGenero = [
        { name: 'Femenino', code: 'F' },
        { name: 'Masculino', code: 'M' },
        { name: 'Otro', code: 'O' }
    ];

        private isValidEmail(value: string): boolean {
            const v = (value ?? '').toString().trim();
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        }

        private isOnlyDigits(value: string): boolean {
            const v = (value ?? '').toString().trim();
            return /^\d+$/.test(v);
        }

        private calcMaxFechaNacimiento(): Date {
            const today = new Date();
            const max = new Date(today.getFullYear() - Register.MIN_EDAD_ANIOS, today.getMonth(), today.getDate());
            max.setHours(0, 0, 0, 0);
            return max;
        }

        private isFechaNacimientoValida(value: unknown): value is Date {
            if (!(value instanceof Date)) return false;
            if (Number.isNaN(value.getTime())) return false;
            return value.getTime() <= this.maxFechaNacimiento.getTime();
        }

        private generoToEnumValue(code: string): number {
            // Backend: Masculino=1, Femenino=2, Otro=3
            const c = (code ?? '').toUpperCase();
            if (c === 'M') return 1;
            if (c === 'F') return 2;
            return 3;
        }

    registrar() {
                if (this.isLoading()) {
                    return;
                }
                this.submitted.set(true);

                if (!this.usuario.terminos) {
                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Atención',
                        detail: 'Debes aceptar los términos y condiciones.',
                    });
                    return;
                }

                const nombres = [this.usuario.primerNombre, this.usuario.segundoNombre]
                    .map((x) => (x ?? '').toString().trim())
                    .filter(Boolean)
                    .join(' ');

                const apellidos = [this.usuario.apellidoPaterno, this.usuario.apellidoMaterno]
                    .map((x) => (x ?? '').toString().trim())
                    .filter(Boolean)
                    .join(' ');

                const generoCode = (this.usuario.genero as any)?.code as string | undefined;
                if (!generoCode) {
                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Atención',
                        detail: 'Selecciona un género.',
                    });
                    return;
                }
                const genero = this.generoToEnumValue(generoCode);

                const payload: RegistroPacienteRequest = {
                    cedula: this.usuario.cedula.trim(),
                    nombres,
                    apellidos,
                    fechaNacimiento: this.usuario.fechaNacimiento as any,
                    genero,
                    telefono: this.usuario.telefono.trim(),
                    correo: this.usuario.correo.trim(),
                    contrasena: this.usuario.contrasena,
                    direccion: this.usuario.direccion.trim(),
                };

                const missing =
                    !payload.cedula ||
                    !payload.nombres ||
                    !payload.apellidos ||
                    !payload.fechaNacimiento ||
                    !payload.telefono ||
                    !payload.correo ||
                    !payload.contrasena ||
                    !payload.direccion;

                if (missing) {
                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Atención',
                        detail: 'Revisa los campos marcados e inténtalo de nuevo.',
                    });
                    return;
                }

                if (!this.isFechaNacimientoValida(payload.fechaNacimiento)) {
                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Atención',
                        detail: `La fecha de nacimiento no debe ser reciente (mínimo ${Register.MIN_EDAD_ANIOS} año).`,
                    });
                    return;
                }

                if (!this.isOnlyDigits(payload.cedula) || payload.cedula.length < 6) {
                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Atención',
                        detail: 'La cédula debe contener solo números.',
                    });
                    return;
                }

                if (!this.isOnlyDigits(payload.telefono) || payload.telefono.length < 7) {
                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Atención',
                        detail: 'El teléfono debe contener solo números.',
                    });
                    return;
                }

                if (!this.isValidEmail(payload.correo)) {
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
                    .registrarPaciente(payload)
                                        .pipe(finalize(() => this.isLoading.set(false)))
                    .subscribe({
                    next: (resp) => {
                                                this.messageService.add({
                                                    severity: 'success',
                                                    summary: 'Registro exitoso',
                                                    detail: resp?.mensaje || 'Tu cuenta fue creada correctamente.',
                                                });
                        void this.router.navigate(['/auth/login']);
                    },
                    error: (err) => {
                        console.error('Error en registro:', err);
                                                this.messageService.add({
                                                    severity: 'error',
                                                    summary: 'No se pudo registrar',
                                                    detail: err.error?.mensaje || 'Error al registrar. Intenta de nuevo.',
                                                });
                    },
                });
    }
}