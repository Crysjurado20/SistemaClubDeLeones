import { AfterViewInit, Component, Input, OnInit, ViewChild, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

import { MessageService } from 'primeng/api';

import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { Header as AppHeader } from '../../../../shared/ui/header/header';

import { DailyAppointment, EstadoCita } from '../../models/daily-appointment.model';
import { DoctorApiService, DoctorSpecialty } from '../../../../core/services/doctor-api.service';
import { AttentionPdfService } from '../../services/attention-pdf.service';

type EstadoOption = { label: string; value: EstadoCita | null };
type EspecialidadOption = { label: string; value: string | null };

@Component({
    selector: 'app-daily-appoiments-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TabsModule,
        TableModule,
        InputTextModule,
        SelectModule,
        ButtonModule,
        TagModule,
        IconFieldModule,
        InputIconModule,
        DialogModule,
        ProgressSpinnerModule,
        AppHeader,
    ],
    templateUrl: './daily-appoiments-list.html',
    styleUrls: ['./daily-appoiments-list.scss'],
})
export class DailyAppoimentsListComponent implements OnInit, AfterViewInit {
    @Input() hospitalNombre = 'Club de Leones';
    @Input() doctorLabel = 'Dr. Juan Perez';

    @Input() turnos: DailyAppointment[] = [];

    @ViewChild('dt') dt?: Table;

    searchTerm = '';
    estadoSeleccionado: EstadoCita | null = 'pendiente';
    especialidadSeleccionada: string | null = null;
    especialidades: DoctorSpecialty[] = [];

    especialidadOptions: EspecialidadOption[] = [{ label: 'Todas', value: null }];

    cargandoTurnos = true;

    readonly todayLabel = this.formatFechaLarga(new Date());

    verificandoHistorial = false;
    historialDialogMessage = 'Verificando historial clínico...';

    descargandoFichaId: number | null = null;

    private debugLog(message: string, data?: unknown): void {
        if (!isDevMode()) return;

        const stamp = new Date().toISOString();
        const prefix = `[DailyAppoimentsList][${stamp}] ${message}`;
        if (data !== undefined) {
            console.log(prefix, data);
            return;
        }

        console.log(prefix);
    }

    private buildEspecialidadOptions(especialidades: DoctorSpecialty[] | null | undefined): EspecialidadOption[] {
        const base: EspecialidadOption[] = [{ label: 'Todas', value: null }];
        const items = (especialidades ?? [])
            .map((e) => (e?.nombre ?? '').trim())
            .filter((x) => !!x);

        return base.concat(items.map((nombre) => ({ label: nombre, value: nombre })));
    }

    private setEspecialidades(especialidades: DoctorSpecialty[]): void {
        this.especialidades = especialidades;
        const nextOptions = this.buildEspecialidadOptions(especialidades);

        this.debugLog('setEspecialidades: schedule update options', {
            prevOptions: this.especialidadOptions,
            nextOptions,
            selected: this.especialidadSeleccionada,
        });

        // Evita NG0100 cuando PrimeNG evalua opciones durante el mismo ciclo inicial.
        setTimeout(() => {
            this.especialidadOptions = nextOptions;

            this.debugLog('setEspecialidades: applied options', {
                appliedOptions: this.especialidadOptions,
                selected: this.especialidadSeleccionada,
            });

            if (
                this.especialidadSeleccionada &&
                !nextOptions.some((option) => option.value === this.especialidadSeleccionada)
            ) {
                this.especialidadSeleccionada = null;
                this.debugLog('setEspecialidades: selected reset because no longer exists');
            }
        });
    }

    private finishLoadTurnos(): void {
        this.debugLog('finishLoadTurnos: schedule set cargandoTurnos=false', {
            current: this.cargandoTurnos,
        });

        // Evita NG0100 si la respuesta llega durante el primer ciclo de deteccion.
        setTimeout(() => {
            this.cargandoTurnos = false;
            this.debugLog('finishLoadTurnos: applied set cargandoTurnos=false', {
                current: this.cargandoTurnos,
            });
        });
    }

    ngOnInit(): void {
        this.debugLog('ngOnInit: start', {
            route: this.router.url,
            optionsIniciales: this.especialidadOptions,
        });

        const idMedico = this.authService.getUserId();
        if (!idMedico) {
            this.debugLog('ngOnInit: no se encontro idMedico, se cancela carga');
            this.cargandoTurnos = false;
            return;
        }

        this.debugLog('ngOnInit: idMedico detectado', { idMedico });

        // Difiere la carga inicial al siguiente ciclo para evitar NG0100
        // en bindings de PrimeNG durante el primer render.
        setTimeout(() => {
            this.debugLog('ngOnInit: execute deferred loadInitialData');
            this.loadInitialData(idMedico);
        });
    }

    private loadInitialData(idMedico: number): void {
        this.debugLog('loadInitialData: start', { idMedico });

        this.debugLog('HTTP getSpecialties: request', { idMedico });
        this.doctorApi.getSpecialties(idMedico).subscribe({
            next: (items) => {
                const normalizedItems = Array.isArray(items) ? items : [];
                this.debugLog('HTTP getSpecialties: success', {
                    count: normalizedItems.length,
                    nombres: normalizedItems.map((x) => x.nombre),
                });
                this.setEspecialidades(normalizedItems);
            },
            error: (err) => {
                this.debugLog('HTTP getSpecialties: error', {
                    status: err?.status,
                    message: err?.error?.mensaje ?? err?.message,
                });
                this.setEspecialidades([]);
                const mensaje = err?.error?.mensaje ?? 'No se pudieron cargar las especialidades del doctor.';
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
            },
        });

        const todayKey = this.toLocalDateKey(new Date());
        this.debugLog('HTTP getDayAppointments: request', {
            idMedico,
            date: todayKey,
            cargandoTurnos: this.cargandoTurnos,
        });
        this.doctorApi.getDayAppointments(idMedico, todayKey).subscribe({
            next: (items) => {
                this.turnos = (items ?? []).map((x) => ({
                    idCita: x.idCita,
                    idPaciente: x.idPaciente,
                    historiaClinica: this.buildHistoriaClinica(x.idPaciente),
                    cedula: x.cedula,
                    apellidos: x.apellidos,
                    nombres: x.nombres,
                    especialidad: (x.especialidad ?? '').trim(),
                    tipoConsulta: x.tipoConsulta,
                    horaInicio: x.horaInicio,
                    horaFin: x.horaFin,
                    estado: x.estado,
                }));

                this.debugLog('HTTP getDayAppointments: success', {
                    count: this.turnos.length,
                    cargandoTurnos: this.cargandoTurnos,
                });

                this.finishLoadTurnos();

                // Asegura que por defecto se vean los pendientes de atención
                queueMicrotask(() => this.onEstadoChange());
            },
            error: (err) => {
                this.debugLog('HTTP getDayAppointments: error', {
                    status: err?.status,
                    message: err?.error?.mensaje ?? err?.message,
                });
                this.finishLoadTurnos();
                const mensaje = err?.error?.mensaje ?? 'No se pudieron cargar los turnos del día.';
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
            },
        });
    }

    private formatFechaLarga(date: Date): string {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);

        const weekday = new Intl.DateTimeFormat('es-EC', { weekday: 'long' }).format(d);
        const day = new Intl.DateTimeFormat('es-EC', { day: '2-digit' }).format(d);
        const year = new Intl.DateTimeFormat('es-EC', { year: 'numeric' }).format(d);
        const capWeekday = weekday ? weekday.charAt(0).toUpperCase() + weekday.slice(1) : '';

        return `${capWeekday} ${day} ${year}`.trim();
    }

    ngAfterViewInit(): void {
        this.onEstadoChange();
    }

    readonly navTabs = [
        { label: 'Agenda semanal', icon: 'pi pi-calendar', value: 'agenda', link: '/weekly-agenda' },
        {
            label: 'Turnos Agendados',
            icon: 'pi pi-clipboard',
            value: 'control',
            link: '/daily-appoiments-list',
        },
        { label: 'Configuración', icon: 'pi pi-cog', value: 'configuracion', link: '/agenda-config' },
    ] as const;

    activeTab: (typeof this.navTabs)[number]['value'] = 'control';

    readonly estadoOptions: EstadoOption[] = [
        { label: 'Todos', value: null },
        { label: 'Pendiente de atención', value: 'pendiente' },
        { label: 'Pendiente pago', value: 'pendiente_pago' },
        { label: 'Cancelado', value: 'cancelado' },
        { label: 'Ocupado', value: 'ocupado' },
        { label: 'Atendido', value: 'atendido' },
        { label: 'Bloqueado', value: 'bloqueado' },
        { label: 'No asistió', value: 'no_asistio' },
    ];

    onSearchChange(): void {
        this.dt?.filterGlobal(this.searchTerm.trim(), 'contains');
    }

    buscar(): void {
        // Aplica filtros manualmente para dar claridad al usuario
        this.onEspecialidadChange();
        this.onSearchChange();
    }

    onEstadoChange(): void {
        if (!this.dt) return;

        if (!this.estadoSeleccionado) {
            this.dt.filter('', 'estado', 'equals');
            return;
        }

        this.dt.filter(this.estadoSeleccionado, 'estado', 'equals');
    }

    onEspecialidadChange(): void {
        if (!this.dt) return;

        if (!this.especialidadSeleccionada) {
            this.dt.filter('', 'especialidad', 'equals');
            return;
        }

        this.dt.filter(this.especialidadSeleccionada, 'especialidad', 'equals');
    }

    limpiarFiltros(): void {
        this.searchTerm = '';
        this.estadoSeleccionado = null;
        this.especialidadSeleccionada = null;

        this.dt?.clear();
    }

    getSeverity(estado: EstadoCita): 'success' | 'info' | 'warn' | 'secondary' | 'danger' {
        const map: Record<EstadoCita, any> = {
            atendido: 'success',
            pendiente: 'info',
            pendiente_pago: 'secondary',
            ocupado: 'warn',
            bloqueado: 'secondary',
            cancelado: 'secondary',
            no_asistio: 'danger',
        };

        return map[estado] || 'info';
    }

    getLabelEstado(estado: EstadoCita): string {
        const map: Record<EstadoCita, string> = {
            atendido: 'Atendido',
            pendiente: 'Pendiente de atención',
            pendiente_pago: 'Pendiente pago',
            ocupado: 'Ocupado',
            bloqueado: 'Bloqueado',
            cancelado: 'Cancelado',
            no_asistio: 'No asistió',
        };

        return map[estado] || estado;
    }

    verHistoriaClinica(row: DailyAppointment): void {
        void this.router.navigate(['/clinical-history-detail', row.idPaciente], {
            queryParams: {
                cedula: row.cedula,
                apellidos: row.apellidos,
                nombres: row.nombres,
            },
        });
    }

    atender(row: DailyAppointment): void {
        if (row.estado === 'atendido') return;
        if (row.estado === 'cancelado') {
            this.messageService.add({
                severity: 'info',
                summary: 'Cita cancelada',
                detail: 'No se puede atender una cita cancelada.',
            });
            return;
        }
        if (row.estado === 'no_asistio') {
            this.messageService.add({
                severity: 'info',
                summary: 'No asistió',
                detail: 'No se puede atender una cita marcada como no asistió.',
            });
            return;
        }
        if (row.estado === 'pendiente_pago') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Pendiente de pago',
                detail: 'Primero confirme el pago para poder atender esta cita.',
            });
            return;
        }

        this.verificandoHistorial = true;
        this.historialDialogMessage = 'Verificando historial clínico...';

        this.doctorApi.getClinicalHistory(row.idPaciente).subscribe({
            next: (history) => {
                const empty = this.isClinicalHistoryEmpty(history as any);

                const fechaNacimiento = (history as any)?.datosPersonales?.fechaNacimiento ?? null;

                if (empty) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Historial clínico',
                        detail: 'Este paciente no tiene historial clínico. Puedes registrarlo en esta atención (antecedentes/diagnósticos).',
                    });

                    this.historialDialogMessage = 'Preparando historial clínico...';
                    setTimeout(() => {
                        this.verificandoHistorial = false;
                        this.navegarAtencion(row, fechaNacimiento);
                    }, 250);
                    return;
                }

                this.verificandoHistorial = false;
                this.navegarAtencion(row, fechaNacimiento);
            },
            error: () => {
                this.verificandoHistorial = false;
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Aviso',
                    detail: 'No se pudo verificar el historial clínico. Puedes continuar con la atención.',
                });
                this.navegarAtencion(row, null);
            },
        });
    }

    private navegarAtencion(row: DailyAppointment, fechaNacimiento: string | null): void {
        void this.router.navigate(['/appointment-attention', row.idCita], {
            queryParams: {
                idPaciente: row.idPaciente,
                historiaClinica: row.historiaClinica,
                cedula: row.cedula,
                apellidos: row.apellidos,
                nombres: row.nombres,
                fechaNacimiento,
                tipoConsulta: row.tipoConsulta,
            },
        });
    }

    confirmarPago(row: DailyAppointment): void {
        if (row.estado !== 'pendiente_pago') return;

        const idMedico = this.authService.getUserId();
        if (!idMedico) return;

        this.doctorApi.confirmPayment(row.idCita, { idMedico }).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Pago confirmado. Cita confirmada.' });
                this.turnos = this.turnos.map((t) => (t.idCita === row.idCita ? { ...t, estado: 'pendiente' } : t));
                this.buscar();
            },
            error: (err) => {
                const mensaje = err?.error?.mensaje ?? 'No se pudo confirmar el pago.';
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
            },
        });
    }

    private isClinicalHistoryEmpty(history: any): boolean {
        const antecedentes = Array.isArray(history?.antecedentes) ? history.antecedentes : [];
        const diagnosticos = Array.isArray(history?.diagnosticos) ? history.diagnosticos : [];
        const medicacion = Array.isArray(history?.medicacion) ? history.medicacion : [];
        const turnos = Array.isArray(history?.turnos) ? history.turnos : [];
        return antecedentes.length === 0 && diagnosticos.length === 0 && medicacion.length === 0 && turnos.length === 0;
    }

    get headerUserLabel(): string {
        return this.authService.getDisplayLabel();
    }

    constructor(
        private readonly router: Router,
        private readonly authService: AuthService,
        private readonly doctorApi: DoctorApiService,
        private readonly messageService: MessageService,
        private readonly attentionPdf: AttentionPdfService,
    ) { }

    private buildHistoriaClinica(idPaciente: number): string {
        return `HC-${String(idPaciente).padStart(4, '0')}`;
    }

    private toLocalDateKey(date: Date): string {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    descargarFicha(row: DailyAppointment): void {
        if (row.estado !== 'atendido') return;
        if (this.descargandoFichaId === row.idCita) return;

        this.descargandoFichaId = row.idCita;

        const today = new Date();
        const dateKey = this.toLocalDateKey(today);
        const fechaCorta = new Intl.DateTimeFormat('es-EC', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(today);

        this.doctorApi.getClinicalHistory(row.idPaciente).subscribe({
            next: (dto) => {
                const turnos = Array.isArray((dto as any)?.turnos) ? (dto as any).turnos : [];
                const turnoDelDia = [...turnos]
                    .reverse()
                    .find((t: any) => (t?.fecha ?? '').toString().trim() === dateKey && this.isSameHour(t?.hora, row.horaInicio));

                const birth = this.parseDate((dto as any)?.datosPersonales?.fechaNacimiento ?? null);
                const edad = birth ? this.formatEdad(birth) : null;

                const diagnosticos = Array.isArray((dto as any)?.diagnosticos)
                    ? (dto as any).diagnosticos
                        .filter((d: any) => d?.activo)
                        .map((d: any) => {
                            const codigo = (d?.codigo ?? '').toString().trim();
                            const descripcion = (d?.descripcion ?? '').toString().trim();
                            return [codigo, descripcion].filter(Boolean).join(' - ');
                        })
                        .filter(Boolean)
                    : [];

                const medicacion = Array.isArray((dto as any)?.medicacion)
                    ? (dto as any).medicacion
                        .map((m: any) => ({
                            medicamento: (m?.nombre ?? '').toString().trim(),
                            dosis: (m?.posologia ?? '').toString().trim(),
                        }))
                        .filter((m: any) => !!m.medicamento || !!m.dosis)
                    : [];

                const medicoLabel = this.authService.getDisplayLabel();
                const medico = this.stripRolPrefix(medicoLabel);

                this.attentionPdf.descargarFichaAtencionPdf({
                    hospital: this.hospitalNombre,
                    historiaClinica: row.historiaClinica,
                    paciente: `${row.apellidos} ${row.nombres}`.trim(),
                    cedula: row.cedula,
                    edad,
                    medico,
                    especialidad: row.especialidad,
                    fechaHora: `${fechaCorta} ${row.horaInicio}–${row.horaFin}`,
                    tipoConsulta: (turnoDelDia?.tipoConsulta ?? row.tipoConsulta ?? '').toString().trim() || null,
                    observaciones: (turnoDelDia?.observacionDetalle ?? '').toString().trim() || null,
                    diagnosticos,
                    medicacion,
                });

                this.descargandoFichaId = null;
            },
            error: (err) => {
                this.descargandoFichaId = null;
                const mensaje = err?.error?.mensaje ?? 'No se pudo generar la ficha de atención.';
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
            },
        });
    }

    private stripRolPrefix(label: string): string {
        return (label ?? '')
            .toString()
            .replace(/^(paciente|doctor|m[eé]dico|administrador)\s*:\s*/i, '')
            .trim();
    }

    private isSameHour(value: unknown, horaInicio: string): boolean {
        const raw = typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
        const candidate = raw.split(' ')[0]?.trim();
        return !!candidate && candidate === (horaInicio ?? '').toString().trim();
    }

    private parseDate(value?: string | null): Date | null {
        if (!value) return null;

        const isoDatePart = /^\s*(\d{4}-\d{2}-\d{2})[T\s].*$/.exec(value);
        if (isoDatePart) {
            return this.parseDate(isoDatePart[1]);
        }

        const iso = /^\s*(\d{4})-(\d{2})-(\d{2})\s*$/.exec(value);
        if (iso) {
            const y = Number(iso[1]);
            const m = Number(iso[2]);
            const d = Number(iso[3]);
            const dt = new Date(y, m - 1, d);
            return Number.isFinite(dt.getTime()) ? dt : null;
        }

        const dmy = /^\s*(\d{2})\/(\d{2})\/(\d{4})\s*$/.exec(value);
        if (dmy) {
            const d = Number(dmy[1]);
            const m = Number(dmy[2]);
            const y = Number(dmy[3]);
            const dt = new Date(y, m - 1, d);
            return Number.isFinite(dt.getTime()) ? dt : null;
        }

        const native = new Date(value);
        return Number.isFinite(native.getTime()) ? native : null;
    }

    private formatEdad(birth: Date): string {
        const today = new Date();
        const years = this.diffYears(today, birth);
        if (years > 0) return years === 1 ? '1 año' : `${years} años`;

        const months = this.diffMonths(today, birth);
        if (months <= 0) return '< 1 mes';
        return months === 1 ? '1 mes' : `${months} meses`;
    }

    private diffYears(today: Date, birth: Date): number {
        let years = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            years--;
        }
        return years;
    }

    private diffMonths(today: Date, birth: Date): number {
        let months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
        if (today.getDate() < birth.getDate()) {
            months--;
        }
        return months;
    }

    onTabValueChange(value: unknown): void {
        if (!this.isNavTabValue(value)) return;

        this.activeTab = value;

        const tab = this.navTabs.find((t) => t.value === this.activeTab);
        if (!tab) return;

        const currentUrl = this.router.url.split('?')[0].split('#')[0];
        if (currentUrl.startsWith(tab.link)) return;

        void this.router.navigateByUrl(tab.link);
    }

    private isNavTabValue(value: unknown): value is (typeof this.navTabs)[number]['value'] {
        return typeof value === 'string' && this.navTabs.some((t) => t.value === value);
    }
}
