import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';

import { Header as AppHeader } from '../../../../shared/ui/header/header';

import { AuthService } from '../../../../core/services/auth.service';
import { DoctorApiService } from '../../../../core/services/doctor-api.service';

import { AgendaHorarioDiaConfig } from '../../models/agenda-config.model';
import { AgendaConfigService } from '../../services/agenda-config.service';

@Component({
  selector: 'app-agenda-config',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppHeader,
    TabsModule,
    DividerModule,
    ButtonModule,
    ToggleSwitchModule,
    SelectModule,
    DatePickerModule,
    TextareaModule,
    TooltipModule,
  ],
  templateUrl: './agenda-config.html',
  styleUrls: ['./agenda-config.scss'],
})
export class AgendaConfigComponent implements OnInit {
  // Header demo (luego puede venir de backend/sesión)
  readonly hospitalNombre = signal('Club de Leones');
  readonly doctorLabel = signal('Dr.');

  readonly headerUserLabel = computed(() => this.authService.getDisplayLabel());

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

  activeTab: (typeof this.navTabs)[number]['value'] = 'configuracion';

  readonly timeOptions = computed(() => {
    const options: { label: string; value: string }[] = [];

    const startMinutes = 6 * 60;
    const endMinutes = 23 * 60 + 30;
    const step = 30;

    for (let minutes = startMinutes; minutes <= endMinutes; minutes += step) {
      const h = String(Math.floor(minutes / 60)).padStart(2, '0');
      const m = String(minutes % 60).padStart(2, '0');
      const value = `${h}:${m}`;
      options.push({ label: value, value });
    }

    // Permitir seleccionar fin a medianoche (00:00) como cierre del día.
    options.push({ label: '00:00', value: '00:00' });

    return options;
  });

  readonly duracionOptions = [
    { label: '15 min', value: 15 as const },
    { label: '30 min', value: 30 as const },
    { label: '1 hora', value: 60 as const },
  ];

  horarioSemana: AgendaHorarioDiaConfig[];

  private defaultHorario: AgendaHorarioDiaConfig[];

  // Bloqueo de días
  motivoBloqueo = '';
  readonly minDate = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  fechasSeleccionadas: Date[] = [];

  constructor(
    private readonly router: Router,
    private readonly agendaConfigService: AgendaConfigService,
    private readonly authService: AuthService,
    private readonly doctorApi: DoctorApiService,
    private readonly messageService: MessageService,
  ) {
    const state = this.agendaConfigService.state();
    this.horarioSemana = this.cloneHorario(state.horarioSemana);
    this.defaultHorario = this.cloneHorario(state.horarioSemana);
  }

  ngOnInit(): void {
    const idMedico = this.authService.getUserId();
    if (!idMedico) return;

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

        const state = this.agendaConfigService.state();
        this.horarioSemana = this.cloneHorario(state.horarioSemana);
        this.defaultHorario = this.cloneHorario(state.horarioSemana);

			for (const dia of this.horarioSemana) {
				this.ensureTurnosDia(dia);
			}
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje ?? 'No se pudo cargar la configuración de agenda.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
      },
    });
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

  onToggleDia(dia: AgendaHorarioDiaConfig): void {
    if (!dia.activo) {
      dia.inicio = null;
      dia.fin = null;
		dia.turnosActivos = undefined;
      return;
    }

    dia.inicio ||= '08:00';
    dia.fin ||= '14:00';
		dia.duracionTurnoMinutos ||= 30;
    this.fixRangoDia(dia);
		this.ensureTurnosDia(dia);
  }

  onChangeHora(dia: AgendaHorarioDiaConfig): void {
    if (!dia.activo) return;
    this.fixRangoDia(dia);
		this.ensureTurnosDia(dia);
  }

  onChangeDuracion(dia: AgendaHorarioDiaConfig): void {
    if (!dia.activo) return;
    dia.duracionTurnoMinutos ||= 30;
    // Al cambiar duración, regeneramos y seleccionamos todos por defecto
    dia.turnosActivos = this.getTurnosGenerados(dia);
  }

  private fixRangoDia(dia: AgendaHorarioDiaConfig): void {
    if (!dia.inicio || !dia.fin) return;

    const inicio = this.toMinutes(dia.inicio);
    const fin = this.toMinutes(dia.fin);

    if (fin <= inicio) {
      // mínimo +30 min
      const fixed = Math.min(inicio + 30, 20 * 60);
      dia.fin = this.toTime(fixed);
    }
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

  confirmarBloqueo(): void {
    if (!this.fechasSeleccionadas?.length) return;

    const motivo = (this.motivoBloqueo ?? '').trim();
    if (!motivo) {
      this.messageService.add({ severity: 'warn', summary: 'Motivo requerido', detail: 'Escriba el motivo del bloqueo.' });
      return;
    }

    for (const d of this.fechasSeleccionadas) {
      const key = this.dateKey(d);
      this.agendaConfigService.setBloqueo(key, motivo);
    }

    this.fechasSeleccionadas = [];
    this.motivoBloqueo = '';

    // Persistir inmediatamente para que se refleje en agenda semanal
    this.guardarCambios();
  }

  guardarCambios(): void {
    const idMedico = this.authService.getUserId();
    if (!idMedico) return;

    this.agendaConfigService.updateHorarioSemana(this.horarioSemana);
    const state = this.agendaConfigService.state();

    this.doctorApi
      .putAgendaConfig(idMedico, {
        horarioSemana: state.horarioSemana,
        bloqueos: state.bloqueos,
      })
      .subscribe({
        next: (res) => {
          this.defaultHorario = this.cloneHorario(state.horarioSemana);
          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: res?.mensaje ?? 'Configuración guardada.',
          });
        },
        error: (err) => {
          const mensaje = err?.error?.mensaje ?? 'No se pudo guardar la configuración.';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
        },
      });
  }

  cancelar(): void {
    this.horarioSemana = this.cloneHorario(this.defaultHorario);
    this.fechasSeleccionadas = [];
  }

  private cloneHorario(horario: AgendaHorarioDiaConfig[]): AgendaHorarioDiaConfig[] {
    return horario.map((d) => ({ ...d }));
  }

  getTurnosGenerados(dia: AgendaHorarioDiaConfig): string[] {
    if (!dia.activo || !dia.inicio || !dia.fin) return [];

    const dur = dia.duracionTurnoMinutos ?? 30;
    const inicio = this.toMinutes(dia.inicio);
    const fin = this.toMinutes(dia.fin);

    const lunchStart = 13 * 60;
    const lunchEnd = 14 * 60;

    const result: string[] = [];
    for (let m = inicio; m + dur <= fin; m += dur) {
      const slotEnd = m + dur;
      // Bloquear cualquier turno que se solape con 13:00–14:00
      if (m < lunchEnd && slotEnd > lunchStart) continue;
      result.push(this.toTime(m));
    }
    return result;
  }

  isTurnoActivo(dia: AgendaHorarioDiaConfig, hora: string): boolean {
    const generated = this.getTurnosGenerados(dia);
    if (!generated.includes(hora)) return false;

    // Si no está configurado aún, asumimos todos activos
    if (dia.turnosActivos === undefined) return true;

    return (dia.turnosActivos ?? []).includes(hora);
  }

  toggleTurno(dia: AgendaHorarioDiaConfig, hora: string): void {
    const generated = this.getTurnosGenerados(dia);
    if (!generated.includes(hora)) return;

    const current = dia.turnosActivos === undefined ? generated.slice() : (dia.turnosActivos ?? []).slice();

    if (current.includes(hora)) {
      dia.turnosActivos = current.filter((x) => x !== hora);
    } else {
      dia.turnosActivos = current.concat(hora);
    }
  }

  seleccionarTodosTurnos(dia: AgendaHorarioDiaConfig): void {
    dia.turnosActivos = this.getTurnosGenerados(dia);
  }

  limpiarTurnos(dia: AgendaHorarioDiaConfig): void {
    dia.turnosActivos = [];
  }

  private ensureTurnosDia(dia: AgendaHorarioDiaConfig): void {
    if (!dia.activo || !dia.inicio || !dia.fin) return;
    dia.duracionTurnoMinutos ||= 30;

    const generated = this.getTurnosGenerados(dia);

    if (dia.turnosActivos === undefined) {
      // primera vez: todos activos
      dia.turnosActivos = generated;
      return;
    }

    const current = dia.turnosActivos ?? [];
    dia.turnosActivos = current.filter((t) => generated.includes(t));
  }

  getDateCellClass(meta: { day: number; month: number; year: number; otherMonth?: boolean; selectable?: boolean }): string {
    const date = new Date(meta.year, meta.month, meta.day);
    const key = this.dateKey(date);

    const classes: string[] = ['agenda-config-date'];

    if (meta.otherMonth) classes.push('opacity-40');
    if (meta.selectable === false) classes.push('opacity-30');

    const reason = this.agendaConfigService.state().bloqueos[key];
    if (reason) classes.push('is-blocked');

    const selected = (this.fechasSeleccionadas ?? []).some((d) => this.dateKey(d) === key);
    if (selected && !reason) classes.push('is-selected');

    return classes.join(' ');
  }

  isFechaBloqueada(meta: { day: number; month: number; year: number }): boolean {
    const date = new Date(meta.year, meta.month, meta.day);
    const key = this.dateKey(date);
    return !!this.agendaConfigService.state().bloqueos[key];
  }

  getMotivoBloqueo(meta: { day: number; month: number; year: number }): string {
    const date = new Date(meta.year, meta.month, meta.day);
    const key = this.dateKey(date);
    return this.agendaConfigService.state().bloqueos[key] ?? '';
  }

  isFechaSeleccionada(meta: { day: number; month: number; year: number }): boolean {
    const date = new Date(meta.year, meta.month, meta.day);
    const key = this.dateKey(date);
    return (this.fechasSeleccionadas ?? []).some((d) => this.dateKey(d) === key);
  }

  private dateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
