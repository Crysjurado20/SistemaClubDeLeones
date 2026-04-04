import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { Header as AppHeader } from '../../../../shared/ui/header/header';

import { DailyAppointment, EstadoCita } from '../../models/daily-appointment.model';

type EstadoOption = { label: string; value: EstadoCita | null };

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
    AppHeader,
  ],
  templateUrl: './daily-appoiments-list.html',
  styleUrls: ['./daily-appoiments-list.scss'],
})
export class DailyAppoimentsListComponent {
  @Input() hospitalNombre = 'Club de Leones';
  @Input() doctorLabel = 'Dr. Juan Perez';

  @Input() turnos: DailyAppointment[] = [];

  @ViewChild('dt') dt?: Table;

  searchTerm = '';
  estadoSeleccionado: EstadoCita | null = null;

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
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Ocupado', value: 'ocupado' },
    { label: 'Atendido', value: 'atendido' },
    { label: 'Bloqueado', value: 'bloqueado' },
  ];

  onSearchChange(): void {
    this.dt?.filterGlobal(this.searchTerm.trim(), 'contains');
  }

  onEstadoChange(): void {
    if (!this.dt) return;

    if (!this.estadoSeleccionado) {
      this.dt.filter('', 'estado', 'equals');
      return;
    }

    this.dt.filter(this.estadoSeleccionado, 'estado', 'equals');
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.estadoSeleccionado = null;

    this.dt?.clear();
  }

  getSeverity(estado: EstadoCita): 'success' | 'info' | 'warn' | 'secondary' {
    const map: Record<EstadoCita, any> = {
      atendido: 'success',
      pendiente: 'info',
      ocupado: 'warn',
      bloqueado: 'secondary',
    };

    return map[estado] || 'info';
  }

  getLabelEstado(estado: EstadoCita): string {
    const map: Record<EstadoCita, string> = {
      atendido: 'Atendido',
      pendiente: 'Pendiente',
      ocupado: 'Ocupado',
      bloqueado: 'Bloqueado',
    };

    return map[estado] || estado;
  }

  verHistoriaClinica(row: DailyAppointment): void {
    void this.router.navigate(['/clinical-history-detail', row.historiaClinica], {
      queryParams: {
        cedula: row.cedula,
        apellidos: row.apellidos,
        nombres: row.nombres,
      },
    });
  }

  atender(row: DailyAppointment): void {
    void this.router.navigate(['/appointment-attention', row.historiaClinica], {
      queryParams: {
        cedula: row.cedula,
        apellidos: row.apellidos,
        nombres: row.nombres,
        tipoConsulta: row.tipoConsulta,
      },
    });
  }

  get headerUserLabel(): string {
    return this.authService.getDisplayLabel();
  }

  constructor(
    private readonly router: Router,
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

  private isNavTabValue(value: unknown): value is (typeof this.navTabs)[number]['value'] {
    return typeof value === 'string' && this.navTabs.some((t) => t.value === value);
  }
}
