import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { Header } from "../../../../shared/ui/header/header";
import { AuthService } from '../../../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { PatientApiService } from '../../../../core/services/patient-api.service';
import { AppointmentPdfService } from '../../services/appointment-pdf.service';
import { LoadingOverlay } from '../../../../shared/ui/loading-overlay/loading-overlay';

export interface CitaMedica {
    id: number;
    cedula: string;
    medico: string;
    especialidad: string;
    fecha: string;
    hora: string;
    unidadMedica: string;
    ubicacion: string;
}

@Component({
    selector: 'app-appointment-list',
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    AvatarModule,
    TooltipModule,
    Header,
    LoadingOverlay
],
    templateUrl: './appointment-list.html',
    styleUrl: './appointment-list.scss'
})
export class AppointmentListComponent implements OnInit {
    nombrePaciente: string = 'Usuario';
    citas: CitaMedica[] = [];
    loading: boolean = true;
    searching: boolean = false;
    globalQuery: string = '';

    private searchTimeoutId: ReturnType<typeof globalThis.setTimeout> | null = null;

    get headerUserLabel(): string {
        return this.authService.getDisplayLabel();
    }

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private readonly authService: AuthService,
        private readonly patientApi: PatientApiService,
        private readonly messageService: MessageService,
        private readonly cdr: ChangeDetectorRef,
        private readonly appointmentPdf: AppointmentPdfService,
    ) {}

    ngOnInit() {
        this.nombrePaciente = this.authService.getStoredUserName();
        const idPaciente = this.authService.getUserId();

        if (!idPaciente) {
            this.loading = false;
            this.messageService.add({
                severity: 'warn',
                summary: 'Sesión',
                detail: 'No se pudo identificar al paciente.',
            });
            this.cdr.markForCheck();
            return;
        }

        this.loading = true;
        this.patientApi
            .getAppointmentsByPaciente(idPaciente)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.cdr.markForCheck();
                }),
            )
            .subscribe({
                next: (items) => {
                    this.citas = (items ?? []) as any;
                    this.cdr.markForCheck();
                },
                error: (err) => {
                    console.error('Error cargando citas:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'No se pudieron cargar las citas',
                        detail: 'Intenta nuevamente.',
                    });
                },
            });
    }

    cancelarCita(cita: CitaMedica): void {
        const idPaciente = this.authService.getUserId();
        if (!idPaciente) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Sesión',
                detail: 'No se pudo identificar al paciente.',
            });
            this.cdr.markForCheck();
            return;
        }

        this.loading = true;
        this.patientApi
            .cancelAppointment(cita.id, idPaciente)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.cdr.markForCheck();
                }),
            )
            .subscribe({
                next: (res) => {
                    this.citas = this.citas.filter((x) => x.id !== cita.id);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Cita cancelada',
                        detail: res?.mensaje ?? 'La cita fue cancelada correctamente.',
                    });
                    this.cdr.markForCheck();
                },
                error: (err) => {
                    console.error('Error cancelando cita:', err);
                    const msg = err?.error?.mensaje ?? 'No se pudo cancelar la cita.';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Cancelar cita',
                        detail: msg,
                    });
                    this.cdr.markForCheck();
                },
            });
    }

    formatFecha(fechaYmd: string): string {
        const parts = (fechaYmd ?? '').split('-');
        if (parts.length !== 3) return fechaYmd;
        const [y, m, d] = parts;
        return `${d}-${m}-${y}`;
    }

    formatHoraAmPm(hhmm: string): string {
        const parts = (hhmm ?? '').split(':');
        if (parts.length < 2) return hhmm;
        const h = Number(parts[0]);
        const m = parts[1];
        if (Number.isNaN(h)) return hhmm;

        const isPm = h >= 12;
        const h12 = h % 12 === 0 ? 12 : h % 12;
        const suffix = isPm ? 'PM' : 'AM';
        return `${h12}:${m} ${suffix}`;
    }
    

    runSearch(table: Table): void {
        const query = (this.globalQuery ?? '').trim();

        if (this.searchTimeoutId !== null) {
            globalThis.clearTimeout(this.searchTimeoutId);
            this.searchTimeoutId = null;
        }

        this.searching = true;
        this.cdr.markForCheck();

        this.searchTimeoutId = globalThis.setTimeout(() => {
            table.filterGlobal(query, 'contains');
            this.searching = false;
            this.cdr.markForCheck();
            this.searchTimeoutId = null;
        }, 250);
    }

    clear(table: Table) {
        table.clear();
        this.globalQuery = '';
        this.filter.nativeElement.value = '';
    }

    imprimirTurno(cita: CitaMedica): void {
        this.appointmentPdf.descargarTurnoPdf({
            idCita: cita.id,
            paciente: this.nombrePaciente,
            cedula: cita.cedula,
            medico: cita.medico,
            especialidad: cita.especialidad,
            fecha: `${cita.fecha} ${cita.hora}`,
            consultorio: cita.unidadMedica,
        });
    }
}