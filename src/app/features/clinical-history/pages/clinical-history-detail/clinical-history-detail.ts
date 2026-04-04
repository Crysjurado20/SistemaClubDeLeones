import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { Header as AppHeader } from '../../../../shared/ui/header/header';

import { AuthService } from '../../../../core/services/auth.service';

type EstadoTurno = 'atendido' | 'pendiente' | 'ocupado' | 'bloqueado';

type Turno = {
  id: string;
  fecha: string;
  hora: string;
  doctor: string;
  especialidad: string;
  tipoConsulta: string;
  observacionTitulo: string;
  observacionDetalle: string;
  estado: EstadoTurno;
};

type Diagnostico = {
  codigo: string;
  descripcion: string;
  activo: boolean;
};

type EstadoMedicacion = 'activo' | 'sos' | 'discontinuado' | 'suspendido';

type Medicamento = {
  id: string;
  nombre: string;
  posologia: string;
  fechaMandada: string;
};

type ClinicalHistoryHeader = {
  historiaClinica: string;
  cedula: string;
  apellidos: string;
  nombres: string;
};

type DatosPersonales = {
  dni: string;
  fechaNacimiento: string;
  sexo: string;
  estadoCivil: string;
  telefono: string;
  email: string;
};

type AntecedenteItem = {
  tipo: string;
  detalle: string;
};

@Component({
  selector: 'app-clinical-history-detail',
  imports: [
    CommonModule,
    FormsModule,
    AppHeader,
    ButtonModule,
    TableModule,
    TagModule,
    AvatarModule,
    DividerModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './clinical-history-detail.html',
  styleUrls: ['./clinical-history-detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicalHistoryDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly hospitalNombre = signal('Club de Leones');
  readonly doctorLabel = signal('Dr. Juan Perez');

  readonly headerUserLabel = computed(() => this.authService.getDisplayLabel());

  readonly header = signal<ClinicalHistoryHeader>({
    historiaClinica: this.route.snapshot.paramMap.get('hcId') ?? '—',
    cedula: this.route.snapshot.queryParamMap.get('cedula') ?? '—',
    apellidos: this.route.snapshot.queryParamMap.get('apellidos') ?? 'Paciente',
    nombres: this.route.snapshot.queryParamMap.get('nombres') ?? 'Sin nombre',
  });

  readonly datosPersonales = signal<DatosPersonales>({
    dni: this.route.snapshot.queryParamMap.get('cedula') ?? '—',
    fechaNacimiento: '—',
    sexo: '—',
    estadoCivil: '—',
    telefono: '—',
    email: '—',
  });

  @ViewChild('turnosTable') turnosTable?: Table;

  searchTurnos = '';
  especialidadSeleccionada: string | null = null;
  tipoConsultaSeleccionada: string | null = null;
  verMedicacionModal = false;

  readonly turnos = signal<Turno[]>(this.buildMockTurnos());
  readonly diagnosticos = signal<Diagnostico[]>(this.buildMockDiagnosticos());
  readonly antecedentes = signal<AntecedenteItem[]>([
    { tipo: 'Personales', detalle: 'Ansiedad generalizada. Sin alergias conocidas.' },
    { tipo: 'Familiares', detalle: 'HTA (madre). Diabetes tipo 2 (padre).' },
    { tipo: 'Alergias', detalle: 'Niega.' },
    { tipo: 'Cirugías', detalle: 'Apendicectomía (2019).' },
  ]);
  readonly medicacion = signal<Medicamento[]>(this.buildMockMedicacion());

  readonly especialidadOptions = computed(() => {
    const values = Array.from(
      new Set(
        this.turnos()
          .map((t) => t.especialidad)
          .map((v) => v?.trim())
          .filter((v): v is string => Boolean(v)),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return [{ label: 'Todas las especialidades', value: null }, ...values.map((v) => ({ label: v, value: v }))];
  });

  readonly tipoConsultaOptions = computed(() => {
    const values = Array.from(
      new Set(
        this.turnos()
          .map((t) => t.tipoConsulta)
          .map((v) => v?.trim())
          .filter((v): v is string => Boolean(v)),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return [{ label: 'Todos los tipos', value: null }, ...values.map((v) => ({ label: v, value: v }))];
  });

  readonly nombreCompleto = computed(
    () => `${this.header().apellidos} ${this.header().nombres}`.trim(),
  );

  readonly iniciales = computed(() => {
    const parts = this.nombreCompleto()
      .split(' ')
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 2);

    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'HC';
  });

  readonly diagnosticosActivos = computed(() => this.diagnosticos().filter((d) => d.activo));

  volver(): void {
    void this.router.navigateByUrl('/daily-appoiments-list');
  }

  onSearchTurnosChange(value: string): void {
    this.searchTurnos = value;
    this.turnosTable?.filterGlobal(value.trim(), 'contains');
  }

  onEspecialidadChange(value: string | null): void {
    this.especialidadSeleccionada = value;
    if (value) {
      this.turnosTable?.filter(value, 'especialidad', 'equals');
      return;
    }

    this.turnosTable?.filter(null, 'especialidad', 'equals');
  }

  onTipoConsultaChange(value: string | null): void {
    this.tipoConsultaSeleccionada = value;
    if (value) {
      this.turnosTable?.filter(value, 'tipoConsulta', 'equals');
      return;
    }

    this.turnosTable?.filter(null, 'tipoConsulta', 'equals');
  }

  abrirMedicacion(): void {
    this.verMedicacionModal = true;
  }

  formatHora(hora: string): string {
    const match = /^\s*(\d{1,2})\s*:\s*(\d{2})\s*$/.exec(hora);
    if (!match) {
      return hora;
    }

    const hoursRaw = Number(match[1]);
    const minutes = match[2];
    if (!Number.isFinite(hoursRaw) || hoursRaw < 0 || hoursRaw > 23) {
      return hora;
    }

    const isPm = hoursRaw >= 12;
    const hours12 = hoursRaw % 12 === 0 ? 12 : hoursRaw % 12;
    return `${hours12}:${minutes} ${isPm ? 'PM' : 'AM'}`;
  }

  private buildMockTurnos(): Turno[] {
    return [
      {
        id: 't-001',
        fecha: '01/04/2026',
        hora: '09:00',
        doctor: 'Dr. R. Medina',
        especialidad: 'Consulta general',
        tipoConsulta: 'Consulta general',
        observacionTitulo: 'Sesión 1 — Evolución favorable',
        observacionDetalle:
          'Paciente refiere disminución de la frecuencia e intensidad de episodios ansiosos. Se refuerza plan terapéutico cognitivo-conductual.',
        estado: 'pendiente',
      },
      {
        id: 't-002',
        fecha: '18/03/2026',
        hora: '10:30',
        doctor: 'Dra. López',
        especialidad: 'Psiquiatría',
        tipoConsulta: 'Control',
        observacionTitulo: 'Sesión 2 — Ajuste de abordaje',
        observacionDetalle:
          'Se revisa adherencia a medicación. Se indica higiene del sueño y control en 4 semanas.',
        estado: 'atendido',
      },
      {
        id: 't-003',
        fecha: '05/03/2026',
        hora: '08:00',
        doctor: 'Dr. R. Medina',
        especialidad: 'Psicología',
        tipoConsulta: 'Seguimiento',
        observacionTitulo: 'Sesión 3 — Estable',
        observacionDetalle:
          'Sin cambios significativos. Continuar plan terapéutico y registrar síntomas.',
        estado: 'ocupado',
      },
    ];
  }

  private buildMockDiagnosticos(): Diagnostico[] {
    return [
      { codigo: 'F41.1', descripcion: 'Trastorno de ansiedad generalizada', activo: true },
      { codigo: 'G47.0', descripcion: 'Insomnio', activo: true },
      { codigo: 'Z72.3', descripcion: 'Falta de ejercicio físico', activo: false },
    ];
  }

  private buildMockMedicacion(): Medicamento[] {
    return [
      {
        id: 'm-001',
        nombre: 'Escitalopram 10 mg',
        posologia: '1 comp. diario · Mañana',
        fechaMandada: '30/03/2026',
      },
      {
        id: 'm-002',
        nombre: 'Clonazepam 0,5 mg',
        posologia: 'SOS · máx. 1 comp/día',
        fechaMandada: '15/02/2026',
      },
      {
        id: 'm-003',
        nombre: 'Sertralina 50 mg',
        posologia: '1 comp. diario',
        fechaMandada: '10/2025',
      },
    ];
  }

}
