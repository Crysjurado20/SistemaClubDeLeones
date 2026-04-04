import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DatePickerModule } from 'primeng/datepicker';

import { Header as AppHeader } from '../../../../shared/ui/header/header';

import { AuthService } from '../../../../core/services/auth.service';

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
export class AppointmentAttentionComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly hospitalNombre = signal('Club de Leones');
  readonly doctorLabel = signal('Dr. Juan Perez');

  readonly headerUserLabel = computed(() => this.authService.getDisplayLabel());

  readonly header = signal<PatientHeader>({
    historiaClinica: this.route.snapshot.paramMap.get('hcId') ?? '—',
    cedula: this.route.snapshot.queryParamMap.get('cedula') ?? '—',
    apellidos: this.route.snapshot.queryParamMap.get('apellidos') ?? 'Paciente',
    nombres: this.route.snapshot.queryParamMap.get('nombres') ?? 'Sin nombre',
    fechaNacimiento: this.route.snapshot.queryParamMap.get('fechaNacimiento'),
  });

  readonly nombreCompleto = computed(() => {
    const h = this.header();
    return `${h.apellidos} ${h.nombres}`.trim();
  });

  readonly edad = computed(() => {
    const birth = this.parseDate(this.header().fechaNacimiento ?? undefined);
    if (!birth) return '—';

    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      years--;
    }

    return years >= 0 ? `${years}` : '—';
  });

  readonly tipoConsultaOptions = signal<Array<{ label: string; value: string }>>([
    { label: 'Consulta general', value: 'Consulta general' },
    { label: 'Control', value: 'Control' },
    { label: 'Seguimiento', value: 'Seguimiento' },
  ]);

  tipoConsultaSeleccionada: string | null =
    this.route.snapshot.queryParamMap.get('tipoConsulta') ?? null;

  observaciones = '';

  presentaDiagnostico = false;
  diagnosticos: DiagnosticoNuevo[] = [this.buildDiagnosticoRow()];

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

  finalizarAtencion(): void {
    // Aquí luego se enviará al backend.
    void this.router.navigateByUrl('/daily-appoiments-list');
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

  private parseDate(value?: string): Date | null {
    if (!value) return null;

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

    return null;
  }
}
