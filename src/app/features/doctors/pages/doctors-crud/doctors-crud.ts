import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { FluidModule } from 'primeng/fluid';
import { finalize } from 'rxjs';
import { GenericCrudComponent, TableColumn } from '../../../../shared/ui/crud/crud';
import { DoctorsApiService } from '../../services/doctors-api.service';
import { SpecialtiesApiService } from '../../../specialties/services/specialties-api.service';
import { LoadingOverlay } from '../../../../shared/ui/loading-overlay/loading-overlay';

@Component({
  selector: 'app-crud-doctors',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    MultiSelectModule,
    FluidModule,
    GenericCrudComponent,
    LoadingOverlay,
],
  templateUrl: './doctors-crud.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrudDoctorsComponent {

  private readonly lunchStartMin = 13 * 60;
  private readonly lunchEndMin = 14 * 60;

  private loadingCount = 0;
  get isLoading(): boolean {
    return this.loadingCount > 0;
  }

  private startLoading(): void {
    this.loadingCount++;
    this.cdr.markForCheck();
  }

  private stopLoading(): void {
    setTimeout(() => {
      this.loadingCount = Math.max(0, this.loadingCount - 1);
      this.cdr.markForCheck();
    }, 0);
  }

  columnasDoctores: TableColumn[] = [
    { field: 'cedula', header: 'Cédula', type: 'text' },
    { field: 'nombre', header: 'Nombre Completo', type: 'text' },
    { field: 'consultorio', header: 'Consultorio', type: 'text' },
    { field: 'especialidad', header: 'Especialidades y Costos', type: 'array' },
    { field: 'telefono', header: 'Teléfono', type: 'text' }
  ];

  columnasEspecialidades: TableColumn[] = [
    { field: 'name', header: 'Especialidad Médica', type: 'text' },
    { field: 'precio', header: 'Costo de Consulta', type: 'currency' }
  ];

  listaDoctores: any[] = [];
  camposFiltro: string[] = ['nombre', 'cedula', 'especialidad', 'licencia', 'consultorio'];

  mostrarModalDialog: boolean = false;
  doctorActual: any = {};

  especialidadesOpciones: Array<{ name: string; idEspecialidad: number }> = [];

  diasSemana = [
    { name: 'Lunes', code: 'LU' },
    { name: 'Martes', code: 'MA' },
    { name: 'Miércoles', code: 'MI' },
    { name: 'Jueves', code: 'JU' },
    { name: 'Viernes', code: 'VI' },
    { name: 'Sábado', code: 'SA' },
    { name: 'Domingo', code: 'DO' },
  ];

  constructor(
    private readonly messageService: MessageService,
    private readonly doctorsApi: DoctorsApiService,
    private readonly specialtiesApi: SpecialtiesApiService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    afterNextRender(() => {
      this.cargarDoctores();
      this.cargarOpcionesEspecialidades();
    });
  }

  private cargarDoctores(): void {
    this.startLoading();
    this.doctorsApi
      .getAll()
      .pipe(finalize(() => this.stopLoading()))
      .subscribe({
      next: (items) => {
        this.listaDoctores = Array.isArray(items) ? items : [];
        this.cdr.markForCheck();
      },
      error: () => {
        this.listaDoctores = [];
        this.cdr.markForCheck();
      },
    });
  }

  private cargarOpcionesEspecialidades(): void {
    this.startLoading();
    this.specialtiesApi
      .getAll()
      .pipe(finalize(() => this.stopLoading()))
      .subscribe({
      next: (items) => {
        const list = Array.isArray(items) ? items : [];
        this.especialidadesOpciones = list
          .map((s: any) => ({
            name: (s?.nombre ?? s?.name ?? '').toString(),
            idEspecialidad: Number(s?.id ?? s?.idEspecialidad ?? s?.Id ?? s?.IdEspecialidad),
          }))
          .filter((s) => s.name && Number.isFinite(s.idEspecialidad) && s.idEspecialidad > 0);
        this.cdr.markForCheck();
      },
      error: () => {
        this.especialidadesOpciones = [];
        this.cdr.markForCheck();
      },
    });
  }

  abrirModalNuevo() {
    this.doctorActual = {
      cedula: '',
      nombre: '',
      especialidad: [],
      correo: '',
      telefono: '',
      licencia: '',
      consultorio: '',
      contrasena: '',
    };
    this.mostrarModalDialog = true;
    this.cdr.markForCheck();
  }

  abrirModalEditar(doctorSeleccionado: any) {
    this.doctorActual = structuredClone(doctorSeleccionado);
    this.doctorActual.contrasena = '';
    this.onEspecialidadesChange();
    this.mostrarModalDialog = true;
    this.cdr.markForCheck();
  }

  onEspecialidadesChange(): void {
    const selected = Array.isArray(this.doctorActual?.especialidad) ? this.doctorActual.especialidad : [];

    const normalized = selected
      .map((e: any) => ({
        idEspecialidad: Number(e?.idEspecialidad ?? e?.id ?? 0),
        name: (e?.name ?? e?.nombre ?? '').toString(),
        precio: typeof e?.precio === 'number' ? e.precio : 0,
        dias: Array.isArray(e?.dias) ? e.dias : [],
        horaInicio: (e?.horaInicio ?? '').toString() || '08:00',
        horaFin: (e?.horaFin ?? '').toString() || '13:00',
      }))
      .filter((e: any) => Number.isFinite(e.idEspecialidad) && e.idEspecialidad > 0);

    const byId = new Map<number, any>();
    for (const esp of normalized) {
      if (!byId.has(esp.idEspecialidad)) byId.set(esp.idEspecialidad, esp);
    }

    this.doctorActual.especialidad = Array.from(byId.values());
    this.cdr.markForCheck();
  }

  eliminarDoctor(doctorSeleccionado: any) {
    this.startLoading();
    this.doctorsApi
      .delete(doctorSeleccionado.id)
      .pipe(finalize(() => this.stopLoading()))
      .subscribe({
      next: () => {
        this.listaDoctores = this.listaDoctores.filter((doc) => doc.id !== doctorSeleccionado.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Doctor eliminado correctamente',
        });
        this.cdr.markForCheck();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje ?? 'No se pudo eliminar el doctor';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: mensaje,
        });
        this.cdr.markForCheck();
      },
    });
  }

  guardarDoctor() {
    if (!this.doctorActual.nombre || !this.doctorActual.cedula) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Nombre y Cédula son obligatorios'
        });
        return;
    }

    if (!this.doctorActual.correo || !this.doctorActual.telefono) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Correo y Teléfono son obligatorios'
      });
      return;
    }

    const validationMessage = this.validarEspecialidadesYHorarios();
    if (validationMessage) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validación',
        detail: validationMessage,
      });
      return;
    }

    if (this.doctorActual.id) {
      this.startLoading();
      this.doctorsApi
        .update(this.doctorActual.id, this.doctorActual)
        .pipe(finalize(() => this.stopLoading()))
        .subscribe({
        next: () => {
          const index = this.listaDoctores.findIndex((d) => d.id === this.doctorActual.id);
          if (index >= 0) this.listaDoctores[index] = this.doctorActual;

          this.listaDoctores = [...this.listaDoctores];
          this.mostrarModalDialog = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Datos actualizados correctamente',
          });

          this.cdr.markForCheck();
        },
        error: (err) => {
          const mensaje = err?.error?.mensaje ?? 'No se pudo actualizar el doctor';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: mensaje,
          });
          this.cdr.markForCheck();
        },
      });
      return;
    }

    this.startLoading();
    this.doctorsApi
      .create(this.doctorActual)
      .pipe(finalize(() => this.stopLoading()))
      .subscribe({
      next: (created) => {
        this.listaDoctores.push(created ?? this.doctorActual);
        this.listaDoctores = [...this.listaDoctores];
        this.mostrarModalDialog = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Creado',
          detail: 'Doctor registrado exitosamente',
        });

        this.cdr.markForCheck();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje ?? 'No se pudo registrar el doctor';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: mensaje,
        });
        this.cdr.markForCheck();
      },
    });
  }

  private validarEspecialidadesYHorarios(): string | null {
    const especialidades = Array.isArray(this.doctorActual?.especialidad) ? this.doctorActual.especialidad : [];
    if (especialidades.length === 0) return 'Debe seleccionar al menos una especialidad.';

    const build = this.buildIntervalos(especialidades);
    if ('error' in build) return build.error;

    const choque = this.findChoque(build.intervalos);
    return choque;
  }

  private buildIntervalos(especialidades: any[]): { intervalos: Array<{ dia: string; inicio: number; fin: number; esp: string }> } | { error: string } {
    const intervalos: Array<{ dia: string; inicio: number; fin: number; esp: string }> = [];

    for (const esp of especialidades) {
      const nombre = (esp?.name ?? '').toString();
      const dias = Array.isArray(esp?.dias) ? esp.dias : [];
      const horaInicio = (esp?.horaInicio ?? '').toString();
      const horaFin = (esp?.horaFin ?? '').toString();

      if (!dias.length) return { error: `La especialidad "${nombre}" debe tener al menos un día.` };
      if (!horaInicio || !horaFin) return { error: `La especialidad "${nombre}" debe tener hora inicio y fin.` };

      const inicioMin = this.horaToMinutos(horaInicio);
      const finMin = this.horaToMinutos(horaFin);

      if (inicioMin === null || finMin === null) return { error: `Horario inválido en "${nombre}". Use HH:mm.` };
      if (inicioMin >= finMin) return { error: `En "${nombre}", la hora inicio debe ser menor a la hora fin.` };

      // Bloqueo de almuerzo (13:00–14:00)
      // Intersecta si inicio < 14:00 y fin > 13:00
      if (inicioMin < this.lunchEndMin && finMin > this.lunchStartMin) {
        return {
          error: `En "${nombre}", el horario no puede cubrir el receso de almuerzo (13:00–14:00). Ajusta para que termine a las 13:00 o inicie desde las 14:00.`,
        };
      }

      for (const d of dias) {
        const code = (d?.code ?? '').toString();
        intervalos.push({ dia: code, inicio: inicioMin, fin: finMin, esp: nombre });
      }
    }

    return { intervalos };
  }

  private findChoque(intervalos: Array<{ dia: string; inicio: number; fin: number; esp: string }>): string | null {
    const byDia = new Map<string, Array<{ inicio: number; fin: number; esp: string }>>();

    for (const i of intervalos) {
      if (!byDia.has(i.dia)) byDia.set(i.dia, []);
      byDia.get(i.dia)!.push({ inicio: i.inicio, fin: i.fin, esp: i.esp });
    }

    for (const [dia, list] of byDia.entries()) {
      const sorted = [...list].sort((a, b) => a.inicio - b.inicio);
      for (let idx = 1; idx < sorted.length; idx++) {
        const prev = sorted[idx - 1];
        const cur = sorted[idx];
        if (cur.inicio < prev.fin) {
          const label = this.diaCodeToLabel(dia);
          return `Choque de horarios el día ${label}: "${prev.esp}" se solapa con "${cur.esp}".`;
        }
      }
    }

    return null;
  }

  private diaCodeToLabel(code: string): string {
    const normalized = (code ?? '').toString().trim().toUpperCase();
    return this.diasSemana.find((d) => d.code === normalized)?.name ?? normalized;
  }

  private horaToMinutos(value: string): number | null {
    const raw = value.trim();
    const re = /^(\d{2}):(\d{2})$/;
    const match = re.exec(raw);
    if (!match) return null;
    const hh = Number(match[1]);
    const mm = Number(match[2]);
    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
    if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
    return hh * 60 + mm;
  }

  ocultarDialog() {
    this.mostrarModalDialog = false;
    this.cdr.markForCheck();
  }
}