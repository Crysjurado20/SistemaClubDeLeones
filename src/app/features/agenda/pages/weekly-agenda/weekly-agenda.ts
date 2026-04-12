import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

import { MessageService } from 'primeng/api';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { Header as AppHeader } from '../../../../shared/ui/header/header';

// Importa tus modelos (Asegúrate de que coincidan con los DTOs de tu backend)
import { Docente, EstadoTurno, Turno } from '../../../doctors/models/docente.model';

import { AgendaConfigService } from '../../services/agenda-config.service';
import { AgendaHorarioDiaConfig } from '../../models/agenda-config.model';
import { PdfService } from '../../../invoices/services/pdf.service';
import { AdminApiService } from '../../../../core/services/admin-api.service';
import { DoctorApiService, DoctorWeekAppointment } from '../../../../core/services/doctor-api.service';
import { PatientApiService } from '../../../../core/services/patient-api.service';
import QRCode from 'qrcode';

interface DiaSemana {
    nombre: string;
    abrev: string;
    fecha: Date;
    esHoy: boolean;
}

interface SlotHora {
    hora: string;
    turnos: (Turno | null)[];
}

type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia';

type SelectOption<T = string> = { label: string; value: T };

type PacienteOption = {
    id: number;
    cedula: string;
    nombres: string;
    apellidos: string;
    hc: string;
    label: string;
};

const HORAS = [
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
];
const SLOT_MINUTES = 30;
const DIAS_NOMBRES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DIAS_COMPLETOS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

@Component({
    selector: 'app-agenda-semanal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        TagModule,
        TooltipModule,
        MenuModule,
        DialogModule,
        DividerModule,
        ScrollPanelModule,
        CardModule,
        TabsModule,
        InputTextModule,
        SelectModule,
        AppHeader,
        DatePipe,
    ],
    templateUrl: './weekly-agenda.html',
    styleUrls: ['./weekly-agenda.scss'],
})
export class WeeklyAgendaComponent implements OnInit, OnChanges {
    @Input() turnos: Turno[] = [];

    @Input() doctor: Docente | null = null;

    @Input() hospitalNombre = 'Club de Leones';

    @Output() estadoCambiado = new EventEmitter<{ turno: Turno; nuevoEstado: string }>();

    diasSemana: DiaSemana[] = [];
    slots: SlotHora[] = [];
    inicioSemana: Date = new Date();

    // Selector de mes (YYYY-MM)
    mesSeleccionado: string = '';

    // Crear cita
    mostrarNuevaCita = false;
    slotSeleccionado: { fecha: Date; hora: string } | null = null;

    mostrarAccionesCita = false;
    turnoAcciones: Turno | null = null;

    modoReagendar = false;
    slotReagendarSeleccionado: string | null = null;
    slotReagendarOpciones: SelectOption<string>[] = [];

    pacienteSeleccionado: PacienteOption | null = null;
    metodoPagoSeleccionado: MetodoPago | null = null;
    qrDataUrl: string | null = null;

    // Solo informativo cuando se reagenda (la especialidad real se infiere por horario)
    especialidadReagendarNombre: string | null = null;

    get headerUserLabel(): string {
        return this.authService.getDisplayLabel();
    }

    getDoctorSeleccionadoLabel(): string {
        const found = this.doctoresOptions.find((d) => d.value === this.doctorSeleccionado);
        return (found?.label ?? '').trim();
    }

    doctorSeleccionado: number | null = 1;
    especialidadSeleccionada: number | null = null;

    readonly metodoPagoOptions: SelectOption<MetodoPago>[] = [
        { label: 'Efectivo', value: 'efectivo' },
        { label: 'Tarjeta (crédito / débito)', value: 'tarjeta' },
        { label: 'Depósito / Transferencia', value: 'transferencia' },
    ];

    doctoresOptions: Array<{ label: string; value: number; especialidades: SelectOption<number>[] }> = [];

    get especialidadOptions(): SelectOption<number>[] {
        const doc = this.doctoresOptions.find((d) => d.value === this.doctorSeleccionado);
        return doc?.especialidades ?? [];
    }

    pacientesOptions: PacienteOption[] = [];

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

    activeTab: (typeof this.navTabs)[number]['value'] = 'agenda';

    mostrarDetalle = false;
    turnoSeleccionado: Turno | null = null;

    private notifiedLoadError = false;

    get labelSemana(): string {
        const offsets = this.getVisibleDayOffsets();
        const lastOffset = offsets.at(-1) ?? 4;
        const fin = new Date(this.inicioSemana);
        fin.setDate(fin.getDate() + lastOffset);
        const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
        return `${this.inicioSemana.toLocaleDateString('es-ES', opts)} – ${fin.toLocaleDateString('es-ES', opts)} ${fin.getFullYear()}`;
    }

    get gridTemplateColumns(): string {
        return `54px repeat(${this.diasSemana.length || 5}, 1fr)`;
    }

    ngOnInit(): void {
        this.syncActiveTabWithUrl();
        this.irAHoy();

        const idMedico = this.authService.getUserId();
        this.doctorSeleccionado = idMedico;

        if (idMedico) {
            console.info('[WeeklyAgenda] Inicializando agenda de medico', {
                idMedico,
                role: this.authService.getPrimaryAppRole(),
            });

            this.doctoresOptions = [
                {
                    label: this.authService.getDisplayLabel().split('·')[0]?.trim() || 'Médico',
                    value: idMedico,
                    especialidades: [],
                },
            ];
            this.loadAgendaConfig(idMedico);
            this.loadSpecialties(idMedico);
            this.loadWeekAppointments(idMedico);
        }
    }

    ngOnChanges(): void {
        this.buildSlots();
    }

    irAHoy(): void {
        const hoy = new Date();
        const lunes = new Date(hoy);
        lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
        lunes.setHours(0, 0, 0, 0);
        this.setInicioSemana(lunes);
    }

    semanaAnterior(): void {
        const target = new Date(this.inicioSemana.getTime() - 7 * 86400000);
        this.setInicioSemana(target);
    }

    semanaSiguiente(): void {
        const target = new Date(this.inicioSemana.getTime() + 7 * 86400000);
        this.setInicioSemana(target);
    }

    onMesChange(value: string | null | undefined): void {
        const key = (value ?? '').toString().trim();
        const parsed = this.parseMonthKey(key);
        if (!parsed) return;

        const firstDay = new Date(parsed.year, parsed.monthIndex, 1);
        const lunes = new Date(firstDay);
        lunes.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7));
        lunes.setHours(0, 0, 0, 0);
        this.setInicioSemana(lunes);
    }

    buildDias(): void {
        const hoy = new Date().toDateString();
        const offsets = this.getVisibleDayOffsets();
        this.diasSemana = offsets.map((i) => {
            const fecha = new Date(this.inicioSemana.getTime() + i * 86400000);
            return {
                nombre: DIAS_COMPLETOS[fecha.getDay()],
                abrev: DIAS_NOMBRES[fecha.getDay()],
                fecha,
                esHoy: fecha.toDateString() === hoy,
            };
        });
    }

    private getVisibleDayOffsets(): number[] {
        // Base: Lun–Vie. Sáb/Dom solo si están activos en la configuración.
        const base = [0, 1, 2, 3, 4];
        const config = this.agendaConfigService.state().horarioSemana ?? [];

        const sabActivo = !!config.find((d) => d.key === 'sab')?.activo;
        const domActivo = !!config.find((d) => d.key === 'dom')?.activo;

        if (sabActivo) base.push(5);
        if (domActivo) base.push(6);

        return base;
    }

    get doctorNombre(): string {
        if (!this.doctor) return 'Médico';
        return `${this.doctor.nombre} ${this.doctor.apellido}`.trim();
    }

    get doctorNombreHeader(): string {
        if (!this.doctor) return 'Dr.';

        const nombre = this.doctorNombre;
        return nombre.toLowerCase().startsWith('dr.') ? nombre : `Dr. ${nombre}`;
    }

    get doctorMeta(): string {
        if (!this.doctor) return 'Agenda semanal';

        const especialidad = this.doctor.especialidad?.trim();
        const matricula = this.doctor.matricula?.trim();

        if (especialidad && matricula) return `${especialidad} · ${matricula}`;
        return especialidad || matricula || 'Agenda semanal';
    }

    buildSlots(): void {
        const horas = this.getHorasVisiblesSemana();
        this.slots = horas.map((hora) => ({ hora, turnos: [] }));
    }

    onEspecialidadHeaderChange(): void {
        // Re-pinta la grilla usando el filtro actual (sin re-consultar API)
        this.buildSlots();
    }

    private getEspecialidadSeleccionadaNombre(): string | null {
        if (!this.especialidadSeleccionada) return null;
        const found = this.especialidadOptions.find((e) => e.value === this.especialidadSeleccionada);
        const label = (found?.label ?? '').trim();
        return label || null;
    }

    getTurnosEnSlotAll(fecha: Date, hora: string): Turno[] {
        return this.turnos.filter(
            (t) => new Date(t.fecha).toDateString() === fecha.toDateString() && t.horaInicio === hora,
        );
    }

    getTurnosEnSlot(fecha: Date, hora: string): Turno[] {
        const filtroEspecialidad = this.getEspecialidadSeleccionadaNombre();
        return this.turnos.filter(
            (t) =>
                new Date(t.fecha).toDateString() === fecha.toDateString() &&
                t.horaInicio === hora &&
                (!filtroEspecialidad || (t.especialidad ?? '').trim() === filtroEspecialidad),
        );
    }

    onSlotClick(fecha: Date, hora: string): void {
        if (!this.isSlotDisponible(fecha, hora)) return;
        this.abrirNuevaCita(fecha, hora);
    }

    isSlotDisponible(fecha: Date, hora: string): boolean {
        if (!this.isSlotEnHorario(fecha, hora)) return false;
        return this.getTurnosEnSlotAll(fecha, hora).length === 0;
    }

    getClaseCelda(fecha: Date, hora: string): string {
        if (this.getTurnosEnSlotAll(fecha, hora).length > 0) return '';
        return this.isSlotDisponible(fecha, hora) ? 'bg-primary-50/40 dark:bg-primary-950/20' : '';
    }

    private isSlotEnHorario(fecha: Date, hora: string): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const day = new Date(fecha);
        day.setHours(0, 0, 0, 0);
        if (day.getTime() < today.getTime()) return false;

        if (this.agendaConfigService.isDateBlocked(fecha)) return false;

        const allowed = this.getSlotsPermitidosDia(fecha);
        return allowed.includes(hora);
    }

    private getHorarioDia(date: Date): AgendaHorarioDiaConfig | null {
        const key = this.diaKey(date);
        const horario = this.agendaConfigService.state().horarioSemana.find((d) => d.key === key);
        return horario ?? null;
    }

    private getSlotsPermitidosDia(date: Date): string[] {
        const horario = this.getHorarioDia(date);
        if (!horario?.activo || !horario.inicio || !horario.fin) return [];

        const generated = this.generarSlotsHorario(horario);
        if (!generated.length) return [];

        // Si no está configurado aún, asumimos todos los slots generados activos.
        if (horario.turnosActivos === undefined) return generated;

        const active = horario.turnosActivos ?? [];
        return active.filter((t) => generated.includes(t));
    }

    private getDuracionDia(date: Date): number {
        const horario = this.getHorarioDia(date);
        return horario?.duracionTurnoMinutos ?? SLOT_MINUTES;
    }

    private generarSlotsHorario(horario: { inicio: string | null; fin: string | null; duracionTurnoMinutos?: number }): string[] {
        if (!horario.inicio || !horario.fin) return [];

        const dur = horario.duracionTurnoMinutos ?? SLOT_MINUTES;
        const inicio = this.toMinutes(horario.inicio);
        const fin = this.toMinutes(horario.fin);

        const lunchStart = 13 * 60;
        const lunchEnd = 14 * 60;

        const result: string[] = [];
        for (let m = inicio; m + dur <= fin; m += dur) {
            const slotEnd = m + dur;
            if (m < lunchEnd && slotEnd > lunchStart) continue;
            result.push(this.toTime(m));
        }

        return result;
    }

    isDiaBloqueado(date: Date): boolean {
        const day = new Date(date);
        day.setHours(0, 0, 0, 0);
        return this.agendaConfigService.isDateBlocked(day);
    }

    private diaKey(date: Date): 'dom' | 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' {
        const map: Array<'dom' | 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab'> = [
            'dom',
            'lun',
            'mar',
            'mie',
            'jue',
            'vie',
            'sab',
        ];
        return map[date.getDay()] ?? 'lun';
    }

    private getHorasDesdeConfiguracion(): string[] {
        const horarios = this.agendaConfigService.state().horarioSemana;
        const minutes = new Set<number>();

        for (const h of horarios) {
            if (!h.activo || !h.inicio || !h.fin) continue;
            const generated = this.generarSlotsHorario(h);
            const allowed = h.turnosActivos === undefined ? generated : (h.turnosActivos ?? []).filter((t) => generated.includes(t));
            for (const s of allowed) minutes.add(this.toMinutes(s));
        }

        const sorted = [...minutes].sort((a, b) => a - b);
        const horas = sorted.map((m) => this.toTime(m));
        return horas.length ? horas : HORAS;
    }

    private getHorasVisiblesSemana(): string[] {
        const minutes = new Set<number>();

        // Horarios configurados (sin considerar "pasado")
        for (const dia of this.diasSemana) {
            for (const slot of this.getSlotsPermitidosDia(dia.fecha)) {
                minutes.add(this.toMinutes(slot));
            }
        }

        // Incluye horas con turnos ya agendados (por si hay algo fuera del rango actual)
        for (const t of this.turnos ?? []) {
            const m = this.toMinutes(t.horaInicio);
            if (Number.isFinite(m)) minutes.add(m);
        }

        const sorted = [...minutes].sort((a, b) => a - b);
        const horas = sorted.map((m) => this.toTime(m));
        return horas.length ? horas : this.getHorasDesdeConfiguracion();
    }

    private toMinutes(hhmm: string): number {
        const [h, m] = hhmm.split(':').map(Number);
        return h * 60 + m;
    }

    private toTime(minutes: number): string {
        const h = String(Math.floor(minutes / 60)).padStart(2, '0');
        const m = String(minutes % 60).padStart(2, '0');
        return `${h}:${m}`;
    }

    abrirNuevaCita(fecha: Date, hora: string): void {
        this.modoReagendar = false;
        this.slotReagendarSeleccionado = null;
        this.slotReagendarOpciones = [];

        this.slotSeleccionado = { fecha: new Date(fecha), hora };
        this.pacienteSeleccionado = null;
        this.metodoPagoSeleccionado = null;
        this.qrDataUrl = null;

        // defaults
        if (!this.doctorSeleccionado) this.doctorSeleccionado = this.doctoresOptions[0]?.value ?? null;
        if (!this.especialidadSeleccionada) this.especialidadSeleccionada = this.especialidadOptions[0]?.value ?? null;

        // Se carga bajo demanda para no bloquear la vista semanal si el endpoint devuelve 403.
        if (!this.pacientesOptions.length) {
            this.loadPatients();
        }

        this.mostrarNuevaCita = true;
    }

    abrirAccionesCita(turno: Turno): void {
        this.turnoAcciones = turno;
        this.mostrarAccionesCita = true;
    }

    confirmarTurnoPagado(): void {
        if (!this.turnoAcciones) return;

        if (this.turnoAcciones.estado !== 'pendiente_pago') {
            this.mostrarAccionesCita = false;
            return;
        }

        const idMedico = this.doctorSeleccionado ?? this.authService.getUserId();
        if (!idMedico) return;

        const idCita = this.turnoAcciones.id;
        this.doctorApi.confirmPayment(idCita, { idMedico }).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Pago confirmado. Cita confirmada.' });
                this.mostrarAccionesCita = false;
                this.turnoAcciones = null;
                this.loadWeekAppointments(idMedico);
            },
            error: (err) => {
                const mensaje = err?.error?.mensaje ?? 'No se pudo confirmar el pago.';
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
            },
        });
    }

    cancelarCita(): void {
        if (!this.turnoAcciones) return;

        if (this.turnoAcciones.estado === 'no_asistio') {
            this.messageService.add({
                severity: 'info',
                summary: 'No asistió',
                detail: 'No se puede cancelar una cita marcada como no asistió.',
            });
            return;
        }

        const idCita = this.turnoAcciones.id;
        const idMedico = this.doctorSeleccionado ?? this.authService.getUserId();

        if (!idMedico) return;

        this.doctorApi.cancelAppointment(idCita, idMedico).subscribe({
            next: (res) => {
                this.turnos = this.turnos.map((t) => (t.id === idCita ? { ...t, estado: 'cancelado' } : t));

                this.messageService.add({
                    severity: 'success',
                    summary: 'Cita cancelada',
                    detail: (res?.mensaje ?? 'La cita fue cancelada correctamente.') + ' La factura asociada ha sido anulada.'
                });

                this.turnoAcciones = null;
                this.mostrarAccionesCita = false;
            },
            error: (err) => {
                const mensaje = err?.error?.mensaje ?? 'No se pudo cancelar la cita.';
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
            }
        });
    }

    reagendarCita(): void {
        if (!this.turnoAcciones) return;

        if (this.turnoAcciones.estado === 'pendiente_pago') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Pendiente de pago',
                detail: 'Primero confirme el pago para poder reagendar la cita.',
            });
            return;
        }

        if (this.turnoAcciones.estado === 'atendido') {
            this.messageService.add({
                severity: 'info',
                summary: 'Cita atendida',
                detail: 'No se puede reagendar una cita que ya fue atendida.',
            });
            return;
        }

        if (this.turnoAcciones.estado === 'no_asistio') {
            this.messageService.add({
                severity: 'info',
                summary: 'No asistió',
                detail: 'No se puede reagendar una cita marcada como no asistió.',
            });
            return;
        }

        const turno = this.turnoAcciones;
        this.modoReagendar = true;

        this.slotReagendarOpciones = this.getSlotsDisponiblesSemana(turno.id);

        if (!this.slotReagendarOpciones.length) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Sin disponibilidad',
                detail: 'No hay turnos disponibles para reagendar en la agenda visible.',
            });
            this.modoReagendar = false;
            return;
        }

        const currentValue = this.toSlotValue(turno.fecha, turno.horaInicio);
        this.slotReagendarSeleccionado = this.slotReagendarOpciones.some((o) => o.value === currentValue)
            ? currentValue
            : this.slotReagendarOpciones[0]?.value ?? null;

        const paciente = this.pacientesOptions.find((p) => p.id === turno.paciente?.id) ?? null;
        this.pacienteSeleccionado = paciente;

        this.especialidadReagendarNombre = (turno.especialidad ?? '').trim() || null;

        // El modelo Turno no guarda método de pago; se selecciona nuevamente en el modal
        this.metodoPagoSeleccionado = null;
        this.qrDataUrl = null;

        // Defaults
        if (!this.doctorSeleccionado) this.doctorSeleccionado = this.doctoresOptions[0]?.value ?? null;
        if (!this.especialidadSeleccionada) this.especialidadSeleccionada = this.especialidadOptions[0]?.value ?? null;

        // Reutiliza el mismo modal; el horario se elige en un select
        this.slotSeleccionado = { fecha: new Date(turno.fecha), hora: turno.horaInicio };

        this.mostrarAccionesCita = false;
        this.mostrarNuevaCita = true;
    }

    cerrarNuevaCita(): void {
        const wasReagendar = this.modoReagendar;

        this.mostrarNuevaCita = false;
        this.slotSeleccionado = null;

        this.modoReagendar = false;
        this.slotReagendarSeleccionado = null;
        this.slotReagendarOpciones = [];

        this.pacienteSeleccionado = null;
        this.metodoPagoSeleccionado = null;
        this.qrDataUrl = null;

        this.especialidadReagendarNombre = null;

        if (wasReagendar) this.turnoAcciones = null;
    }

    onAccionesHide(): void {
        // Si estamos pasando al flujo de reagendar, no limpiar el turno objetivo.
        if (this.modoReagendar) return;
        this.turnoAcciones = null;
    }

    onDoctorChange(): void {
        if (!this.especialidadOptions.some((e) => e.value === this.especialidadSeleccionada)) {
            this.especialidadSeleccionada = this.especialidadOptions[0]?.value ?? null;
        }
    }

    async onMetodoPagoChange(): Promise<void> {
        this.qrDataUrl = null;

        if (this.metodoPagoSeleccionado === 'tarjeta' || this.metodoPagoSeleccionado === 'transferencia') {
            const payload = this.buildQrPayload();
            this.qrDataUrl = await QRCode.toDataURL(payload, { width: 240, margin: 1 });
        }
    }

    async descargarComprobanteEfectivo(): Promise<void> {
        const slot = this.getSlotActual();
        if (!slot) return;

        const paciente = this.pacienteSeleccionado;
        const medico = this.doctoresOptions.find((d) => d.value === this.doctorSeleccionado)?.label ?? 'Médico';
        const especialidad =
            this.especialidadOptions.find((e) => e.value === this.especialidadSeleccionada)?.label ??
            'Especialidad';

        const qrDataUrl = await QRCode.toDataURL(
            JSON.stringify({
                type: 'comprobante-cita',
                method: 'efectivo',
                paciente: paciente ? `${paciente.apellidos} ${paciente.nombres}`.trim() : null,
                cedula: paciente?.cedula ?? null,
                hc: paciente?.hc ?? null,
                fecha: this.formatFechaHora(slot.fecha, slot.hora),
            }),
            { width: 240, margin: 1 },
        );

        const pdf = this.pdfService.generarComprobanteCitaPdf({
            medico,
            especialidad,
            paciente: paciente ? `${paciente.apellidos} ${paciente.nombres}`.trim() : '—',
            cedula: paciente?.cedula ?? '—',
            historiaClinica: paciente?.hc ?? '—',
            fecha: this.formatFechaHora(slot.fecha, slot.hora),
            metodoPago: 'Efectivo',
            qrDataUrl,
        });

        pdf.download('comprobante-cita.pdf');
    }

    crearCita(): void {
        if (!this.pacienteSeleccionado) return;
        const pacienteSeleccionado = this.pacienteSeleccionado;

        if (this.modoReagendar) {
            if (!this.turnoAcciones) return;
            if (!this.slotReagendarSeleccionado) return;

            const parsed = this.parseSlotValue(this.slotReagendarSeleccionado);
            if (!parsed) return;

            const { fecha, hora } = parsed;

            const idMedico = this.doctorSeleccionado ?? this.authService.getUserId();
            if (!idMedico) return;

            const idCita = this.turnoAcciones.id;

            this.doctorApi
                .rescheduleAppointment(idCita, {
                    idMedico,
                    fecha: this.toLocalDateKey(fecha),
                    hora,
                })
                .subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Cita reagendada correctamente.',
                        });
                        this.turnoAcciones = null;
                        this.cerrarNuevaCita();
                        this.loadWeekAppointments(idMedico);
                    },
                    error: (err) => {
                        const mensaje = err?.error?.mensaje ?? 'No se pudo reagendar la cita.';
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    },
                });
            return;
        }

        if (!this.slotSeleccionado) return;
        if (!this.doctorSeleccionado || !this.especialidadSeleccionada) return;

        const horaInicio = this.slotSeleccionado.hora;
        const fechaKey = this.toLocalDateKey(this.slotSeleccionado.fecha);

        this.patientApi
            .createAppointment({
                idPaciente: pacienteSeleccionado.id,
                idMedico: this.doctorSeleccionado,
                idEspecialidad: this.especialidadSeleccionada,
                creadaPorMedico: true,
                fecha: fechaKey,
                hora: horaInicio,
                metodoPago: this.metodoPagoSeleccionado,
                observacion: 'Control',
            })
            .subscribe({
                next: (res) => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cita creada correctamente.' });
                    this.cerrarNuevaCita();
                    if (this.doctorSeleccionado) this.loadWeekAppointments(this.doctorSeleccionado);
                },
                error: (err) => {
                    const mensaje = err?.error?.mensaje ?? 'No se pudo crear la cita.';
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                },
            });
    }

    private loadAgendaConfig(idMedico: number): void {
        this.doctorApi.getAgendaConfig(idMedico).subscribe({
            next: (dto) => {
                this.agendaConfigService.save({
                    horarioSemana: dto.horarioSemana.map((d) => ({
                        key: d.key,
                        label: d.label,
                        activo: d.activo,
                        inicio: d.inicio,
                        fin: d.fin,
                        duracionTurnoMinutos: d.duracionTurnoMinutos ?? 30,
                        turnosActivos: d.turnosActivos,
                    })),
                    bloqueos: dto.bloqueos ?? {},
                });
                this.buildDias();
                this.buildSlots();
            },
            error: () => {
                // silencioso: usa defaults locales
            },
        });
    }

    private loadSpecialties(idMedico: number): void {
        this.doctorApi.getSpecialties(idMedico).subscribe({
            next: (items) => {
                const options = (items ?? [])
                    .filter((x) => !!x?.idEspecialidad)
                    .map((x) => ({ label: x.nombre, value: x.idEspecialidad }));

                if (this.doctoresOptions.length) {
                    this.doctoresOptions = [{ ...this.doctoresOptions[0], especialidades: options }];
                }

                if (!this.especialidadSeleccionada || !options.some((o) => o.value === this.especialidadSeleccionada)) {
                    this.especialidadSeleccionada = options[0]?.value ?? null;
                }
            },
            error: (err) => {
                if (!this.notifiedLoadError) {
                    const mensaje = err?.error?.mensaje ?? 'No se pudieron cargar las especialidades del doctor.';
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    this.notifiedLoadError = true;
                }
            },
        });
    }

    private loadPatients(): void {
        this.adminApi.getPatients().subscribe({
            next: (items) => {
                this.pacientesOptions = (items ?? []).map((p) => {
                    const hc = this.buildHistoriaClinica(p.id);
                    return {
                        id: p.id,
                        cedula: p.cedula,
                        nombres: p.nombres,
                        apellidos: p.apellidos,
                        hc,
                        label: `${p.cedula} · ${p.apellidos} ${p.nombres} · ${hc}`.trim(),
                    };
                });
            },
            error: (err) => {
                console.warn('[WeeklyAgenda] Error cargando /api/patients', {
                    status: err?.status,
                    message: err?.error?.mensaje ?? err?.message ?? 'Error desconocido',
                });
                // mantiene vacío
            },
        });
    }

    private loadWeekAppointments(idMedico: number): void {
        const start = this.toLocalDateKey(this.inicioSemana);
        this.doctorApi.getWeekAppointments(idMedico, start).subscribe({
            next: (items) => {
                this.turnos = (items ?? []).map((t) => this.mapWeekDtoToTurno(t));
            },
            error: (err) => {
                this.turnos = [];

                if (!this.notifiedLoadError) {
                    const mensaje = err?.error?.mensaje ?? 'No se pudieron cargar los turnos de la semana.';
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
                    this.notifiedLoadError = true;
                }
            },
        });
    }

    private mapWeekDtoToTurno(dto: DoctorWeekAppointment): Turno {
        const fecha = this.parseLocalDateKey(dto.fecha) ?? new Date(dto.fecha);

        const duracion = this.getDuracionDia(fecha);

        const paciente = dto.paciente
            ? {
                id: dto.paciente.id,
                nombre: dto.paciente.nombres,
                apellido: dto.paciente.apellidos,
                hc: this.buildHistoriaClinica(dto.paciente.id),
            }
            : undefined;

        return {
            id: dto.idCita,
            fecha,
            horaInicio: dto.horaInicio,
            horaFin: dto.horaFin || this.toTime(this.toMinutes(dto.horaInicio) + duracion),
            duracionMin: duracion,
            estado: dto.estado,
            especialidad: (dto.especialidad ?? '').trim() || undefined,
            tipoConsulta: (dto.tipoConsulta ?? '').trim() || undefined,
            tipo: 'consulta',
            paciente,
            notas: dto.observacion || undefined,
            motivo: paciente ? undefined : 'Sin paciente',
        };
    }

    private buildHistoriaClinica(idPaciente: number): string {
        return `HC-${String(idPaciente).padStart(4, '0')}`;
    }

    private buildQrPayload(): string {
        const paciente = this.pacienteSeleccionado;
        const slot = this.getSlotActual();
        const fecha = slot ? this.formatFechaHora(slot.fecha, slot.hora) : '';

        return JSON.stringify({
            type: 'pago-cita',
            method: this.metodoPagoSeleccionado,
            paciente: paciente ? `${paciente.apellidos} ${paciente.nombres}`.trim() : null,
            cedula: paciente?.cedula ?? null,
            hc: paciente?.hc ?? null,
            fecha,
        });
    }

    private getSlotActual(): { fecha: Date; hora: string } | null {
        if (this.modoReagendar && this.slotReagendarSeleccionado) {
            return this.parseSlotValue(this.slotReagendarSeleccionado);
        }

        return this.slotSeleccionado ? { fecha: this.slotSeleccionado.fecha, hora: this.slotSeleccionado.hora } : null;
    }

    formatFechaHora(fecha: Date, hora: string): string {
        const dateStr = fecha.toLocaleDateString('es-EC', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        return `${dateStr} ${hora}`;
    }

    getClaseTurno(estado: EstadoTurno): string {
        const map: Record<EstadoTurno, string> = {
            atendido: 'bg-teal-50 border-teal-500 text-teal-800',
            pendiente: 'bg-blue-50 border-blue-500 text-blue-800',
            pendiente_pago: 'bg-surface-50 border-surface-500 text-surface-800',
            ocupado: 'bg-orange-50 border-orange-400 text-orange-800',
            bloqueado: 'bg-gray-100 border-gray-400 text-gray-600',
            cancelado: 'bg-red-50 border-red-500 text-red-800',
            no_asistio: 'bg-purple-50 border-purple-500 text-purple-800',
        };
        return map[estado] || 'bg-blue-50 border-blue-500 text-blue-800';
    }

    getTooltipTurno(turno: Turno): string {
        const pac = turno.paciente
            ? `${turno.paciente.nombre} ${turno.paciente.apellido}`
            : 'Sin paciente';
        return `${pac} · ${turno.horaInicio}–${turno.horaFin} · ${this.getLabelEstado(turno.estado)}`;
    }

    getLabelEstado(estado: EstadoTurno): string {
        const map: Record<EstadoTurno, string> = {
            atendido: 'Atendido',
            pendiente: 'Pendiente de atención',
            pendiente_pago: 'Pendiente pago',
            ocupado: 'Ocupado',
            bloqueado: 'Bloqueado',
            cancelado: 'Cancelado',
            no_asistio: 'No asistió',
        };
        return map[estado] || 'Desconocido';
    }

    getSeverity(estado: EstadoTurno): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const map: Record<EstadoTurno, any> = {
            atendido: 'success',
            pendiente: 'info',
            pendiente_pago: 'secondary',
            ocupado: 'warn',
            bloqueado: 'secondary',
            cancelado: 'danger',
            no_asistio: 'danger',
        };
        return map[estado] || 'info';
    }

    verDetalle(turno: Turno): void {
        // Reemplaza el detalle por un panel de acciones (pago/cancelar/reagendar)
        this.abrirAccionesCita(turno);
    }

    cambiarEstadoDesdeDetalle(nuevoEstado: string): void {
        if (this.turnoSeleccionado) {
            this.estadoCambiado.emit({ turno: this.turnoSeleccionado, nuevoEstado });
            this.mostrarDetalle = false;
        }
    }

    marcarNoAsistio(): void {
        if (!this.turnoAcciones) return;
        const idCita = this.turnoAcciones.id;

        this.doctorApi.markNoShow(idCita).subscribe({
            next: (res) => {
                this.turnos = this.turnos.map((t) => (t.id === idCita ? { ...t, estado: 'no_asistio' as const } : t));
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: res?.mensaje ?? 'Cita marcada como no asistió.' });
                this.turnoAcciones = null;
                this.mostrarAccionesCita = false;
            },
            error: (err) => {
                const mensaje = err?.error?.mensaje ?? 'No se pudo marcar como no asistió.';
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
            },
        });
    }

    marcarOcupada(): void {
        if (!this.turnoAcciones) return;
        const idCita = this.turnoAcciones.id;

        this.doctorApi.markBusy(idCita).subscribe({
            next: (res) => {
                this.turnos = this.turnos.map((t) => (t.id === idCita ? { ...t, estado: 'ocupado' as const } : t));
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: res?.mensaje ?? 'Cita marcada como ocupada.' });
                this.turnoAcciones = null;
                this.mostrarAccionesCita = false;
            },
            error: (err) => {
                const mensaje = err?.error?.mensaje ?? 'No se pudo marcar como ocupada.';
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
            },
        });
    }

    marcarBloqueada(): void {
        if (!this.turnoAcciones) return;
        const idCita = this.turnoAcciones.id;

        this.doctorApi.markBlocked(idCita).subscribe({
            next: (res) => {
                this.turnos = this.turnos.map((t) => (t.id === idCita ? { ...t, estado: 'bloqueado' as const } : t));
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: res?.mensaje ?? 'Cita bloqueada correctamente.' });
                this.turnoAcciones = null;
                this.mostrarAccionesCita = false;
            },
            error: (err) => {
                const mensaje = err?.error?.mensaje ?? 'No se pudo bloquear la cita.';
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
            },
        });
    }

    private getSlotsDisponiblesSemana(ignoreTurnoId?: number): SelectOption<string>[] {
        const opciones: SelectOption<string>[] = [];
        const horas = this.getHorasVisiblesSemana();

        for (const dia of this.diasSemana) {
            for (const hora of horas) {
                if (!this.isSlotDisponibleParaReagendar(dia.fecha, hora, ignoreTurnoId)) continue;
                opciones.push({
                    label: `${dia.abrev} ${dia.fecha.getDate().toString().padStart(2, '0')}/${(dia.fecha.getMonth() + 1)
                        .toString()
                        .padStart(2, '0')} · ${hora}`,
                    value: this.toSlotValue(dia.fecha, hora),
                });
            }
        }

        return opciones;
    }

    private setInicioSemana(date: Date): void {
        const monday = new Date(date);
        monday.setHours(0, 0, 0, 0);
        this.inicioSemana = monday;
        this.mesSeleccionado = this.toMonthKey(monday);

        this.buildDias();
        this.buildSlots();
        if (this.doctorSeleccionado) this.loadWeekAppointments(this.doctorSeleccionado);
    }

    private toMonthKey(date: Date): string {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${y}-${m}`;
    }

    private parseMonthKey(value: string): { year: number; monthIndex: number } | null {
        const match = /^(\d{4})-(\d{2})$/.exec(value);
        if (!match) return null;
        const year = Number(match[1]);
        const month = Number(match[2]);
        if (!Number.isFinite(year) || !Number.isFinite(month)) return null;
        if (month < 1 || month > 12) return null;
        return { year, monthIndex: month - 1 };
    }

    private isSlotDisponibleParaReagendar(fecha: Date, hora: string, ignoreTurnoId?: number): boolean {
        if (!this.isSlotEnHorario(fecha, hora)) return false;

        const ocupados = this.getTurnosEnSlotAll(fecha, hora).filter((t) => (ignoreTurnoId ? t.id !== ignoreTurnoId : true));
        return ocupados.length === 0;
    }

    private toSlotValue(fecha: Date, hora: string): string {
        return `${this.toLocalDateKey(fecha)}|${hora}`;
    }

    private parseSlotValue(value: string): { fecha: Date; hora: string } | null {
        const [dateKey, hora] = value.split('|');
        if (!dateKey || !hora) return null;
        const fecha = this.parseLocalDateKey(dateKey);
        if (!fecha) return null;
        return { fecha, hora };
    }

    private toLocalDateKey(date: Date): string {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    private parseLocalDateKey(key: string): Date | null {
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
        if (!match) return null;
        const y = Number(match[1]);
        const m = Number(match[2]);
        const d = Number(match[3]);
        const date = new Date(y, m - 1, d);
        date.setHours(0, 0, 0, 0);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    constructor(
        private readonly router: Router,
        private readonly agendaConfigService: AgendaConfigService,
        private readonly pdfService: PdfService,
        private readonly authService: AuthService,
        private readonly doctorApi: DoctorApiService,
        private readonly adminApi: AdminApiService,
        private readonly patientApi: PatientApiService,
        private readonly messageService: MessageService,
    ) { }

    onTabValueChange(value: unknown): void {
        if (!this.isNavTabValue(value)) return;

        this.activeTab = value;

        const tab = this.navTabs.find((t) => t.value === this.activeTab);
        if (!tab) return;

        const currentUrl = this.router.url.split('?')[0].split('#')[0];
        if (currentUrl.startsWith(tab.link)) return;

        void this.router.navigateByUrl(tab.link);
    }

    private syncActiveTabWithUrl(): void {
        const currentUrl = this.router.url.split('?')[0].split('#')[0];

        const match = [...this.navTabs]
            .sort((a, b) => b.link.length - a.link.length)
            .find((t) => currentUrl.startsWith(t.link));

        this.activeTab = match?.value ?? 'agenda';
    }

    private isNavTabValue(value: unknown): value is (typeof this.navTabs)[number]['value'] {
        return typeof value === 'string' && this.navTabs.some((t) => t.value === value);
    }
}
