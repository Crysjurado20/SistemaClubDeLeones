import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DatePickerModule } from 'primeng/datepicker';

import { Header as AppHeader } from '../../../../shared/ui/header/header';

import { AuthService } from '../../../../core/services/auth.service';
import { DoctorApiService } from '../../../../core/services/doctor-api.service';

type PatientHeader = {
  historiaClinica: string;
  cedula: string;
  apellidos: string;
  nombres: string;
  fechaNacimiento?: string | null;
};

type DiagnosticoNuevo = {
  id: string;
  nombre: string;
  descripcion: string;
  requiereMedicacion: boolean;
  medicacion: MedicacionItem[];
};

type MedicacionItem = {
  id: string;
  medicamento: string;
  dosis: string;
  inicio: Date | null;
};

type AntecedenteNuevo = {
  id: string;
  tipo: string;
  descripcion: string;
};

@Component({
  selector: 'app-appointment-attention',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppHeader,
    ButtonModule,
    DividerModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ToggleSwitchModule,
    DatePickerModule,
  ],
  templateUrl: './appointment-attention.html',
  styleUrls: ['./appointment-attention.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentAttentionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly doctorApi = inject(DoctorApiService);
  private readonly messageService = inject(MessageService);

  readonly hospitalNombre = signal('Club de Leones');
  readonly doctorLabel = signal('Dr. Juan Perez');

  readonly headerUserLabel = computed(() => this.authService.getDisplayLabel());

  readonly header = signal<PatientHeader>({
    historiaClinica:
      this.route.snapshot.queryParamMap.get('historiaClinica') ??
      this.buildHistoriaClinicaFromQuery() ??
      '—',
    cedula: this.route.snapshot.queryParamMap.get('cedula') ?? '—',
    apellidos: this.route.snapshot.queryParamMap.get('apellidos') ?? 'Paciente',
    nombres: this.route.snapshot.queryParamMap.get('nombres') ?? 'Sin nombre',
    fechaNacimiento: this.route.snapshot.queryParamMap.get('fechaNacimiento'),
  });

  private buildHistoriaClinicaFromQuery(): string | null {
    const idPacienteRaw = this.route.snapshot.queryParamMap.get('idPaciente');
    const idPaciente = idPacienteRaw ? Number(idPacienteRaw) : Number.NaN;
    if (!Number.isFinite(idPaciente)) return null;
    return `HC-${String(idPaciente).padStart(4, '0')}`;
  }

  readonly nombreCompleto = computed(() => {
    const h = this.header();
    return `${h.apellidos} ${h.nombres}`.trim();
  });

  readonly edad = computed(() => {
    const birth = this.parseDate(this.header().fechaNacimiento ?? undefined);
    if (!birth) return '—';

    const today = new Date();
    const years = this.diffYears(today, birth);
    if (years > 0) return years === 1 ? '1 año' : `${years} años`;

    const months = this.diffMonths(today, birth);
    if (months <= 0) return '< 1 mes';
    return months === 1 ? '1 mes' : `${months} meses`;
  });

  readonly tipoConsultaOptions = signal<Array<{ label: string; value: string }>>([
    { label: 'Consulta general', value: 'Consulta general' },
    { label: 'Control', value: 'Control' },
    { label: 'Seguimiento', value: 'Seguimiento' },
  ]);

  tipoConsultaSeleccionada: string | null =
    this.route.snapshot.queryParamMap.get('tipoConsulta') ?? null;

  observaciones = '';

  registraAntecedentes = false;
  antecedentes: AntecedenteNuevo[] = [this.buildAntecedenteRow()];

  presentaDiagnostico = false;
  diagnosticos: DiagnosticoNuevo[] = [this.buildDiagnosticoRow()];

  ngOnInit(): void {
    const idPacienteRaw = this.route.snapshot.queryParamMap.get('idPaciente');
    const idPaciente = idPacienteRaw ? Number(idPacienteRaw) : Number.NaN;
    if (!Number.isFinite(idPaciente)) return;

    const currentBirth = (this.header().fechaNacimiento ?? '').toString().trim();
    if (currentBirth && this.parseDate(currentBirth)) return;

    this.doctorApi.getClinicalHistory(idPaciente).subscribe({
      next: (dto) => {
        const birth = (dto as any)?.datosPersonales?.fechaNacimiento ?? null;
        if (!birth) return;
        this.header.update((h) => ({ ...h, fechaNacimiento: birth }));
      },
      error: () => {
        // silencioso: solo mejora el dato de edad
      },
    });
  }

  volver(): void {
    void this.router.navigateByUrl('/daily-appoiments-list');
  }

  agregarMedicamento(dxId: string): void {
    this.diagnosticos = this.diagnosticos.map((dx) =>
      dx.id === dxId
        ? {
            ...dx,
            medicacion: [...dx.medicacion, this.buildMedicacionRow()],
          }
        : dx,
    );
  }

  agregarDiagnostico(): void {
    this.diagnosticos = [...this.diagnosticos, this.buildDiagnosticoRow()];
  }

  eliminarDiagnostico(id: string): void {
    this.diagnosticos = this.diagnosticos.filter((d) => d.id !== id);
    if (this.diagnosticos.length === 0) {
      this.diagnosticos = [this.buildDiagnosticoRow()];
    }
  }

  onDxRequiereMedicacionChange(dxId: string, value: boolean): void {
    this.diagnosticos = this.diagnosticos.map((dx) => {
      if (dx.id !== dxId) return dx;

      if (!value) {
        return {
          ...dx,
          requiereMedicacion: false,
          medicacion: [this.buildMedicacionRow()],
        };
      }

      return {
        ...dx,
        requiereMedicacion: true,
        medicacion: dx.medicacion.length ? dx.medicacion : [this.buildMedicacionRow()],
      };
    });
  }

  onPresentaDiagnosticoChange(value: boolean): void {
    this.presentaDiagnostico = value;
    if (!value) {
      this.diagnosticos = [this.buildDiagnosticoRow()];
    }
  }

  eliminarMedicamento(dxId: string, medId: string): void {
    this.diagnosticos = this.diagnosticos.map((dx) => {
      if (dx.id !== dxId) return dx;

      const next = dx.medicacion.filter((m) => m.id !== medId);
      return {
        ...dx,
        medicacion: next.length ? next : [this.buildMedicacionRow()],
      };
    });
  }

  agregarAntecedente(): void {
    this.antecedentes = [...this.antecedentes, this.buildAntecedenteRow()];
  }

  eliminarAntecedente(id: string): void {
    this.antecedentes = this.antecedentes.filter((a) => a.id !== id);
    if (this.antecedentes.length === 0) {
      this.antecedentes = [this.buildAntecedenteRow()];
    }
  }

  onRegistraAntecedentesChange(value: boolean): void {
    this.registraAntecedentes = value;
    if (!value) {
      this.antecedentes = [this.buildAntecedenteRow()];
    }
  }

  finalizarAtencion(): void {
    const idMedico = this.authService.getUserId();
    if (!idMedico) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo identificar al médico.' });
      return;
    }

    const idCitaRaw = this.route.snapshot.paramMap.get('hcId');
    const idCita = idCitaRaw ? Number(idCitaRaw) : Number.NaN;
    if (!Number.isFinite(idCita)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Id de cita inválido.' });
      return;
    }

    const diagnosticos = this.presentaDiagnostico
      ? this.diagnosticos
          .map((dx) => ({
            nombre: dx.nombre.trim(),
            descripcion: dx.descripcion.trim(),
            medicacion: (dx.requiereMedicacion ? dx.medicacion : [])
              .map((m) => ({
                medicamento: m.medicamento.trim(),
                dosis: m.dosis.trim(),
                fechaMandada: m.inicio ? this.toDateKey(m.inicio) : null,
              }))
              .filter((m) => !!m.medicamento || !!m.dosis),
          }))
          .filter((dx) => !!dx.nombre || !!dx.descripcion)
      : [];

    const antecedentes = this.registraAntecedentes
      ? this.antecedentes
          .map((a) => ({
            tipo: a.tipo.trim(),
            descripcion: a.descripcion.trim(),
          }))
          .filter((a) => !!a.tipo || !!a.descripcion)
      : [];

    this.doctorApi
      .attendAppointment(idCita, {
        idMedico,
        tipoConsulta: this.tipoConsultaSeleccionada,
        observaciones: this.observaciones?.trim() || null,
        antecedentes,
        diagnosticos,
      })
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Atención registrada.' });
          void this.router.navigateByUrl('/daily-appoiments-list');
        },
        error: (err) => {
          const mensaje = err?.error?.mensaje ?? 'No se pudo registrar la atención.';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
        },
      });
  }

  private toDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private buildMedicacionRow(): MedicacionItem {
    return {
      id: `med-${Math.random().toString(16).slice(2)}`,
      medicamento: '',
      dosis: '',
      inicio: new Date(),
    };
  }

  private buildDiagnosticoRow(): DiagnosticoNuevo {
    return {
      id: `dx-${Math.random().toString(16).slice(2)}`,
      nombre: '',
      descripcion: '',
      requiereMedicacion: false,
      medicacion: [this.buildMedicacionRow()],
    };
  }

  private buildAntecedenteRow(): AntecedenteNuevo {
    return {
      id: `ant-${Math.random().toString(16).slice(2)}`,
      tipo: '',
      descripcion: '',
    };
  }

  private parseDate(value?: string): Date | null {
    if (!value) return null;

    // Soporta ISO con hora: yyyy-mm-ddTHH:mm:ss(.sss)Z
    // Tomamos la parte de fecha para evitar problemas de zona horaria.
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

    // Fallback: intenta parseo nativo (por si viene como Date string)
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
}
