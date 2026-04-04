import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

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
import { PdfService } from '../../../invoices/services/pdf.service';
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

  get headerUserLabel(): string {
    return this.authService.getDisplayLabel();
  }

  doctorSeleccionado: number | null = 1;
  especialidadSeleccionada: string | null = null;

  readonly metodoPagoOptions: SelectOption<MetodoPago>[] = [
    { label: 'Efectivo', value: 'efectivo' },
    { label: 'Tarjeta (crédito / débito)', value: 'tarjeta' },
    { label: 'Depósito / Transferencia', value: 'transferencia' },
  ];

  readonly doctoresOptions: Array<{ label: string; value: number; especialidades: SelectOption<string>[] }> = [
    {
      label: 'Dr. Astudillo Silva Marcia Andrea',
      value: 1,
      especialidades: [
        { label: 'Cirugía Maxilofacial', value: 'CM' },
        { label: 'Odontología General', value: 'OD' },
      ],
    },
  ];

  get especialidadOptions(): SelectOption<string>[] {
    const doc = this.doctoresOptions.find((d) => d.value === this.doctorSeleccionado);
    return doc?.especialidades ?? [];
  }

  readonly pacientesOptions: PacienteOption[] = [
    {
      id: 1,
      cedula: '1723456789',
      nombres: 'María Andrea',
      apellidos: 'Astudillo Silva',
      hc: 'HC-0001',
      label: '1723456789 · Astudillo Silva María Andrea · HC-0001',
    },
    {
      id: 2,
      cedula: '1801122334',
      nombres: 'Juan',
      apellidos: 'Pérez',
      hc: 'HC-0002',
      label: '1801122334 · Pérez Juan · HC-0002',
    },
  ];

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

  get labelSemana(): string {
    const fin = new Date(this.inicioSemana);
    fin.setDate(fin.getDate() + 4); 
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `${this.inicioSemana.toLocaleDateString('es-ES', opts)} – ${fin.toLocaleDateString('es-ES', opts)} ${fin.getFullYear()}`;
  }

  ngOnInit(): void {
    this.syncActiveTabWithUrl();
    this.irAHoy();

    this.doctorSeleccionado = this.doctoresOptions[0]?.value ?? null;
    this.especialidadSeleccionada = this.especialidadOptions[0]?.value ?? null;
  }

  ngOnChanges(): void {
    this.buildSlots();
  }

  irAHoy(): void {
    const hoy = new Date();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
    lunes.setHours(0, 0, 0, 0);
    this.inicioSemana = lunes;
    this.buildDias();
    this.buildSlots();
  }

  semanaAnterior(): void {
    this.inicioSemana = new Date(this.inicioSemana.getTime() - 7 * 86400000);
    this.buildDias();
  }

  semanaSiguiente(): void {
    this.inicioSemana = new Date(this.inicioSemana.getTime() + 7 * 86400000);
    this.buildDias();
  }

  buildDias(): void {
    const hoy = new Date().toDateString();
    this.diasSemana = Array.from({ length: 5 }, (_, i) => {
      const fecha = new Date(this.inicioSemana.getTime() + i * 86400000);
      return {
        nombre: DIAS_COMPLETOS[fecha.getDay()],
        abrev: DIAS_NOMBRES[fecha.getDay()],
        fecha,
        esHoy: fecha.toDateString() === hoy,
      };
    });
  }

  get doctorNombre(): string {
    if (!this.doctor) return 'Doctor';
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
    const horas = this.getHorasDesdeConfiguracion();
    this.slots = horas.map((hora) => ({ hora, turnos: [] }));
  }

  getTurnosEnSlot(fecha: Date, hora: string): Turno[] {
    return this.turnos.filter(
      (t) => new Date(t.fecha).toDateString() === fecha.toDateString() && t.horaInicio === hora,
    );
  }

  onSlotClick(fecha: Date, hora: string): void {
    if (!this.isSlotDisponible(fecha, hora)) return;
    this.abrirNuevaCita(fecha, hora);
  }

  isSlotDisponible(fecha: Date, hora: string): boolean {
    if (!this.isSlotEnHorario(fecha, hora)) return false;
    return this.getTurnosEnSlot(fecha, hora).length === 0;
  }

  getClaseCelda(fecha: Date, hora: string): string {
    if (this.getTurnosEnSlot(fecha, hora).length > 0) return '';
    return this.isSlotEnHorario(fecha, hora) ? 'slot-disponible' : 'slot-no-disponible';
  }

  private isSlotEnHorario(fecha: Date, hora: string): boolean {
    if (this.agendaConfigService.isDateBlocked(fecha)) return false;

    const horario = this.getHorarioDia(fecha);
    if (!horario?.activo || !horario.inicio || !horario.fin) return false;

    const inicio = this.toMinutes(horario.inicio);
    const fin = this.toMinutes(horario.fin);
    const h = this.toMinutes(hora);

    // slot de 60 min
    if (h < inicio) return false;
    if (h + 60 > fin) return false;
    return true;
  }

  private getHorarioDia(date: Date): { activo: boolean; inicio: string | null; fin: string | null } | null {
    const key = this.diaKey(date);
    const horario = this.agendaConfigService.state().horarioSemana.find((d) => d.key === key);
    return horario ?? null;
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
    const horarios = this.agendaConfigService
      .state()
      .horarioSemana.filter((h) => h.activo && !!h.inicio && !!h.fin);

    if (!horarios.length) return HORAS;

    const minInicio = Math.min(...horarios.map((h) => this.toMinutes(h.inicio || '00:00')));
    const maxFin = Math.max(...horarios.map((h) => this.toMinutes(h.fin || '00:00')));

    const result: string[] = [];
    for (let minutes = minInicio; minutes + 60 <= maxFin; minutes += 60) {
      result.push(this.toTime(minutes));
    }

    return result.length ? result : HORAS;
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
    this.doctorSeleccionado = this.doctoresOptions[0]?.value ?? null;
    this.especialidadSeleccionada = this.especialidadOptions[0]?.value ?? null;

    this.mostrarNuevaCita = true;
  }

  abrirAccionesCita(turno: Turno): void {
    this.turnoAcciones = turno;
    this.mostrarAccionesCita = true;
  }

  confirmarTurnoPagado(): void {
    if (!this.turnoAcciones) return;

    const id = this.turnoAcciones.id;
    this.turnos = this.turnos.map((t) => (t.id === id ? { ...t, estado: 'ocupado' } : t));
    this.mostrarAccionesCita = false;
  }

  cancelarCita(): void {
    if (!this.turnoAcciones) return;

    const id = this.turnoAcciones.id;
    this.turnos = this.turnos.filter((t) => t.id !== id);
    this.mostrarAccionesCita = false;
  }

  reagendarCita(): void {
    if (!this.turnoAcciones) return;

    const turno = this.turnoAcciones;
    this.modoReagendar = true;

    this.slotReagendarOpciones = this.getSlotsDisponiblesSemana(turno.id);
    const currentValue = this.toSlotValue(turno.fecha, turno.horaInicio);
    this.slotReagendarSeleccionado = this.slotReagendarOpciones.some((o) => o.value === currentValue)
      ? currentValue
      : this.slotReagendarOpciones[0]?.value ?? null;

    const paciente = this.pacientesOptions.find((p) => p.id === turno.paciente?.id) ?? null;
    this.pacienteSeleccionado = paciente;

    // El modelo Turno no guarda método de pago; se selecciona nuevamente en el modal
    this.metodoPagoSeleccionado = null;
    this.qrDataUrl = null;

    // Defaults
    this.doctorSeleccionado = this.doctoresOptions[0]?.value ?? null;
    this.especialidadSeleccionada = this.especialidadOptions[0]?.value ?? null;

    // Reutiliza el mismo modal; el horario se elige en un select
    this.slotSeleccionado = { fecha: new Date(turno.fecha), hora: turno.horaInicio };

    this.mostrarAccionesCita = false;
    this.mostrarNuevaCita = true;
  }

  cerrarNuevaCita(): void {
    this.mostrarNuevaCita = false;
    this.slotSeleccionado = null;

    this.modoReagendar = false;
    this.slotReagendarSeleccionado = null;
    this.slotReagendarOpciones = [];

    this.pacienteSeleccionado = null;
    this.metodoPagoSeleccionado = null;
    this.qrDataUrl = null;
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
    const medico = this.doctoresOptions.find((d) => d.value === this.doctorSeleccionado)?.label ?? 'Doctor';
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
    if (!this.metodoPagoSeleccionado) return;

    if (this.modoReagendar) {
      if (!this.turnoAcciones) return;
      if (!this.slotReagendarSeleccionado) return;

      const parsed = this.parseSlotValue(this.slotReagendarSeleccionado);
      if (!parsed) return;

      const { fecha, hora } = parsed;
      const horaInicio = hora;
      const horaFin = this.toTime(this.toMinutes(horaInicio) + 60);

      const id = this.turnoAcciones.id;
      this.turnos = this.turnos.map((t) =>
        t.id === id
          ? {
              ...t,
              fecha,
              horaInicio,
              horaFin,
              paciente: {
                id: pacienteSeleccionado.id,
                nombre: pacienteSeleccionado.nombres,
                apellido: pacienteSeleccionado.apellidos,
                hc: pacienteSeleccionado.hc,
              },
            }
          : t,
      );

      this.turnoAcciones = null;
      this.cerrarNuevaCita();
      return;
    }

    if (!this.slotSeleccionado) return;
    if (!this.doctorSeleccionado || !this.especialidadSeleccionada) return;

    const fecha = new Date(this.slotSeleccionado.fecha);
    const horaInicio = this.slotSeleccionado.hora;
    const horaFin = this.toTime(this.toMinutes(horaInicio) + 60);

    const nuevo: Turno = {
      id: Date.now(),
      fecha,
      horaInicio,
      horaFin,
      duracionMin: 60,
      estado: 'pendiente',
      tipo: 'consulta',
      paciente: {
        id: this.pacienteSeleccionado.id,
        nombre: this.pacienteSeleccionado.nombres,
        apellido: this.pacienteSeleccionado.apellidos,
        hc: this.pacienteSeleccionado.hc,
      },
      motivo: 'Cita creada por médico',
    };

    this.turnos = [...this.turnos, nuevo];
    this.cerrarNuevaCita();
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
      ocupado: 'bg-orange-50 border-orange-400 text-orange-800',
      bloqueado: 'bg-gray-100 border-gray-400 text-gray-600',
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
      pendiente: 'Pendiente',
      ocupado: 'Ocupado',
      bloqueado: 'Bloqueado',
    };
    return map[estado] || 'Desconocido';
  }

  getSeverity(estado: EstadoTurno): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const map: Record<EstadoTurno, any> = {
      atendido: 'success',
      pendiente: 'info',
      ocupado: 'warn',
      bloqueado: 'secondary',
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

  private getSlotsDisponiblesSemana(ignoreTurnoId?: number): SelectOption<string>[] {
    const opciones: SelectOption<string>[] = [];
    const horas = this.getHorasDesdeConfiguracion();

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

  private isSlotDisponibleParaReagendar(fecha: Date, hora: string, ignoreTurnoId?: number): boolean {
    if (!this.isSlotEnHorario(fecha, hora)) return false;

    const ocupados = this.getTurnosEnSlot(fecha, hora).filter((t) => (ignoreTurnoId ? t.id !== ignoreTurnoId : true));
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
  ) {}

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
