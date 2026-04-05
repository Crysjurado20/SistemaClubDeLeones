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
import { SelectModule } from 'primeng/select';
import { FluidModule } from 'primeng/fluid';
import { finalize } from 'rxjs';
import { GenericCrudComponent, TableColumn } from '../../../../shared/ui/crud/crud';
import { PatientsApiService } from '../../services/patients-api.service';
import { LoadingOverlay } from '../../../../shared/ui/loading-overlay/loading-overlay';

@Component({
  selector: 'app-crud-patients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    FluidModule,
    GenericCrudComponent,
    LoadingOverlay,
],
  templateUrl: './crud-patients.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrudPatientsComponent {
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

  columnasPacientes: TableColumn[] = [
    { field: 'cedula', header: 'Cédula', type: 'text' },
    { field: 'apellidos', header: 'Apellidos', type: 'text' },
    { field: 'nombres', header: 'Nombres', type: 'text' },
    { field: 'telefono', header: 'Teléfono', type: 'text' },
    { field: 'correo', header: 'Correo Electrónico', type: 'text' },
  ];

  listaPacientes: any[] = [];
  camposFiltro: string[] = ['nombres', 'apellidos', 'cedula', 'correo'];

  mostrarModalDialog: boolean = false;
  pacienteActual: any = {};

  opcionesGenero = [
    { name: 'Masculino', code: 'M' },
    { name: 'Femenino', code: 'F' },
    { name: 'Otro', code: 'O' },
  ];

  constructor(
    private readonly messageService: MessageService,
    private readonly patientsApi: PatientsApiService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    afterNextRender(() => this.cargarPacientes());
  }

  private cargarPacientes(): void {
    this.startLoading();
    this.patientsApi
      .getAll()
      .pipe(finalize(() => this.stopLoading()))
      .subscribe({
      next: (items) => {
        const list = Array.isArray(items) ? items : [];
        this.listaPacientes = list.map((p) => this.normalizePacienteForTable(p));
        this.cdr.markForCheck();
      },
      error: () => {
        this.listaPacientes = [];
        this.cdr.markForCheck();
      },
    });
  }

  private normalizePacienteForTable(paciente: any): any {
    const primerNombre = (paciente?.primerNombre ?? '').toString();
    const segundoNombre = (paciente?.segundoNombre ?? '').toString();
    const apellidoPaterno = (paciente?.apellidoPaterno ?? '').toString();
    const apellidoMaterno = (paciente?.apellidoMaterno ?? '').toString();

    const nombresFromParts = `${primerNombre} ${segundoNombre}`.trim();
    const apellidosFromParts = `${apellidoPaterno} ${apellidoMaterno}`.trim();

    return {
      ...paciente,
      nombres: (paciente?.nombres ?? nombresFromParts).toString(),
      apellidos: (paciente?.apellidos ?? apellidosFromParts).toString(),
    };
  }

  abrirModalNuevo() {
    this.pacienteActual = {
      cedula: '',
      primerNombre: '',
      segundoNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      fechaNacimiento: '',
      genero: null,
      direccion: '',
      telefono: '',
      correo: '',
    };
    this.mostrarModalDialog = true;
    this.cdr.markForCheck();
  }

  abrirModalEditar(pacienteSeleccionado: any) {
    this.pacienteActual = structuredClone(pacienteSeleccionado);
    this.mostrarModalDialog = true;
    this.cdr.markForCheck();
  }

  eliminarPaciente(pacienteSeleccionado: any) {
    this.startLoading();
    this.patientsApi
      .delete(pacienteSeleccionado.id)
      .pipe(finalize(() => this.stopLoading()))
      .subscribe({
      next: () => {
        this.listaPacientes = this.listaPacientes.filter((pac) => pac.id !== pacienteSeleccionado.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Paciente eliminado correctamente',
        });
        this.cdr.markForCheck();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el paciente',
        });
        this.cdr.markForCheck();
      },
    });
  }

  guardarPaciente() {
    // Validación de campos obligatorios básicos
    if (
      !this.pacienteActual.primerNombre ||
      !this.pacienteActual.apellidoPaterno ||
      !this.pacienteActual.cedula
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La cédula, primer nombre y apellido paterno son obligatorios',
      });
      return;
    }

    // Concatenamos los nombres y apellidos para mostrarlos ordenados en la tabla
    this.pacienteActual.nombres =
      `${this.pacienteActual.primerNombre} ${this.pacienteActual.segundoNombre || ''}`.trim();
    this.pacienteActual.apellidos =
      `${this.pacienteActual.apellidoPaterno} ${this.pacienteActual.apellidoMaterno || ''}`.trim();

    if (this.pacienteActual.id) {
      this.startLoading();
      this.patientsApi
        .update(this.pacienteActual.id, this.pacienteActual)
        .pipe(finalize(() => this.stopLoading()))
        .subscribe({
        next: () => {
          const index = this.listaPacientes.findIndex((p) => p.id === this.pacienteActual.id);
          if (index >= 0) this.listaPacientes[index] = this.pacienteActual;

          this.listaPacientes = [...this.listaPacientes];
          this.mostrarModalDialog = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Datos del paciente actualizados correctamente',
          });

          this.cdr.markForCheck();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el paciente',
          });
          this.cdr.markForCheck();
        },
      });
    } else {
      this.startLoading();
      this.patientsApi
        .create(this.pacienteActual)
        .pipe(finalize(() => this.stopLoading()))
        .subscribe({
        next: (created) => {
          this.listaPacientes.push(this.normalizePacienteForTable(created ?? this.pacienteActual));
          this.listaPacientes = [...this.listaPacientes];
          this.mostrarModalDialog = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'Paciente registrado exitosamente',
          });

          this.cdr.markForCheck();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo registrar el paciente',
          });
          this.cdr.markForCheck();
        },
      });
    }
  }

  ocultarDialog() {
    this.mostrarModalDialog = false;
    this.cdr.markForCheck();
  }
}
