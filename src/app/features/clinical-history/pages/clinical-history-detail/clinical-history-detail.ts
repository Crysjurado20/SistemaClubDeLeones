import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';

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
import { DoctorApiService } from '../../../../core/services/doctor-api.service';

type Turno = {
  id: string;
  fecha: string;
  hora: string;
  doctor: string;
  especialidad: string;
  tipoConsulta: string;
  observacionTitulo: string;
  observacionDetalle: string;
  estado: string;
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
export class ClinicalHistoryDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly doctorApi = inject(DoctorApiService);
  private readonly messageService = inject(MessageService);

  readonly hospitalNombre = signal('Club de Leones');
  readonly doctorLabel = signal('Dr. Juan Perez');

  readonly headerUserLabel = computed(() => this.authService.getDisplayLabel());

  readonly header = signal<ClinicalHistoryHeader>({
    historiaClinica: '—',
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

  readonly edad = computed(() => {
    const birth = this.parseDate(this.datosPersonales().fechaNacimiento);
    if (!birth) return '—';

    const today = new Date();
    const years = this.diffYears(today, birth);
    if (years > 0) return years === 1 ? '1 año' : `${years} años`;

    const months = this.diffMonths(today, birth);
    if (months <= 0) return '< 1 mes';
    return months === 1 ? '1 mes' : `${months} meses`;
  });

  @ViewChild('turnosTable') turnosTable?: Table;

  searchTurnos = '';
  especialidadSeleccionada: string | null = null;
  verMedicacionModal = false;

  readonly turnos = signal<Turno[]>([]);
  readonly diagnosticos = signal<Diagnostico[]>([]);
  readonly antecedentes = signal<AntecedenteItem[]>([]);
  readonly medicacion = signal<Medicamento[]>([]);

  ngOnInit(): void {
    const idPacienteRaw = this.route.snapshot.paramMap.get('hcId');
    const idPaciente = idPacienteRaw ? Number(idPacienteRaw) : Number.NaN;
    if (!Number.isFinite(idPaciente)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Id de paciente inválido.' });
      return;
    }

    this.doctorApi.getClinicalHistory(idPaciente).subscribe({
      next: (dto) => {
        this.header.set({
          historiaClinica: dto.header.historiaClinica,
          cedula: dto.header.cedula,
          apellidos: dto.header.apellidos,
          nombres: dto.header.nombres,
        });

        this.datosPersonales.set({
          dni: dto.datosPersonales.dni,
          fechaNacimiento: dto.datosPersonales.fechaNacimiento,
          sexo: dto.datosPersonales.sexo,
          estadoCivil: '—',
          telefono: dto.datosPersonales.telefono,
          email: dto.datosPersonales.email,
        });

        this.diagnosticos.set(dto.diagnosticos ?? []);
        this.antecedentes.set(dto.antecedentes ?? []);
        this.medicacion.set(dto.medicacion ?? []);
        this.turnos.set(
          (dto.turnos ?? []).map((t) => ({
            id: t.id,
            fecha: t.fecha,
            hora: t.hora,
            doctor: t.doctor,
            especialidad: t.especialidad,
            tipoConsulta: t.tipoConsulta,
            observacionTitulo: t.observacionTitulo,
            observacionDetalle: t.observacionDetalle,
            estado: t.estado,
          })),
        );
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje ?? 'No se pudo cargar la historia clínica.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
      },
    });
  }

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

  private parseDate(value?: string | null): Date | null {
    if (!value) return null;

    // ISO con hora: yyyy-mm-ddTHH:mm:ss
    const isoDatePart = /^\s*(\d{4}-\d{2}-\d{2})[T\s].*$/.exec(value);
    if (isoDatePart) {
      return this.parseDate(isoDatePart[1]);
    }

    // yyyy-mm-dd
    const iso = /^\s*(\d{4})-(\d{2})-(\d{2})\s*$/.exec(value);
    if (iso) {
      const y = Number(iso[1]);
      const m = Number(iso[2]);
      const d = Number(iso[3]);
      const dt = new Date(y, m - 1, d);
      return Number.isFinite(dt.getTime()) ? dt : null;
    }

    // dd/mm/yyyy
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

}
