import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { Header as AppHeader } from '../../../../shared/ui/header/header';

import { AuthService } from '../../../../core/services/auth.service';

import {
  AgendaHorarioDiaConfig,
  MotivoBloqueoAgenda,
} from '../../models/agenda-config.model';
import { AgendaConfigService } from '../../services/agenda-config.service';

type MotivoOption = { label: string; value: MotivoBloqueoAgenda };

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
  ],
  templateUrl: './agenda-config.html',
  styleUrls: ['./agenda-config.scss'],
})
export class AgendaConfigComponent {
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
    const endMinutes = 20 * 60;
    const step = 30;

    for (let minutes = startMinutes; minutes <= endMinutes; minutes += step) {
      const h = String(Math.floor(minutes / 60)).padStart(2, '0');
      const m = String(minutes % 60).padStart(2, '0');
      const value = `${h}:${m}`;
      options.push({ label: value, value });
    }

    return options;
  });

  horarioSemana: AgendaHorarioDiaConfig[];

  private readonly defaultHorario: AgendaHorarioDiaConfig[];

  // Bloqueo de días
  motivoBloqueo: MotivoBloqueoAgenda = 'vacaciones';
  readonly motivoOptions = signal<MotivoOption[]>([
    { label: 'Vacaciones', value: 'vacaciones' },
    { label: 'Finde / fuera', value: 'fuera' },
  ]);

  fechasSeleccionadas: Date[] = [];

  constructor(
    private readonly router: Router,
    private readonly agendaConfigService: AgendaConfigService,
    private readonly authService: AuthService,
  ) {
    const state = this.agendaConfigService.state();
    this.horarioSemana = this.cloneHorario(state.horarioSemana);
    this.defaultHorario = this.cloneHorario(state.horarioSemana);
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
      return;
    }

    dia.inicio ||= '08:00';
    dia.fin ||= '14:00';
    this.fixRangoDia(dia);
  }

  onChangeHora(dia: AgendaHorarioDiaConfig): void {
    if (!dia.activo) return;
    this.fixRangoDia(dia);
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

    for (const d of this.fechasSeleccionadas) {
      const key = this.dateKey(d);
      this.agendaConfigService.setBloqueo(key, this.motivoBloqueo);
    }

    this.fechasSeleccionadas = [];
  }

  guardarCambios(): void {
    this.agendaConfigService.updateHorarioSemana(this.horarioSemana);
  }

  cancelar(): void {
    this.horarioSemana = this.cloneHorario(this.defaultHorario);
    this.fechasSeleccionadas = [];
  }

  private cloneHorario(horario: AgendaHorarioDiaConfig[]): AgendaHorarioDiaConfig[] {
    return horario.map((d) => ({ ...d }));
  }

  getDateCellClass(meta: { day: number; month: number; year: number; otherMonth?: boolean; selectable?: boolean }): string {
    const date = new Date(meta.year, meta.month, meta.day);
    const key = this.dateKey(date);

    const classes: string[] = ['agenda-config-date'];

    if (meta.otherMonth) classes.push('opacity-40');
    if (meta.selectable === false) classes.push('opacity-30');

    const reason = this.agendaConfigService.state().bloqueos[key];
    if (reason === 'vacaciones') classes.push('is-vacaciones');
    if (reason === 'fuera') classes.push('is-fuera');

    return classes.join(' ');
  }

  private dateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
