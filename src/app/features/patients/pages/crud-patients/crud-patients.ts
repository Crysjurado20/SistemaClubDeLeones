import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FluidModule } from 'primeng/fluid';
import { GenericCrudComponent, TableColumn } from '../../../../shared/ui/crud/crud';
import { PatientsApiService } from '../../services/patients-api.service';

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
],
  templateUrl: './crud-patients.html',
  providers: [MessageService],
})
export class CrudPatientsComponent implements OnInit {
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
  ) {}

  ngOnInit() {
    this.cargarPacientes();
  }

  private cargarPacientes(): void {
    this.patientsApi.getAll().subscribe({
      next: (items) => {
        const list = Array.isArray(items) ? items : [];
        this.listaPacientes = list.map((p) => this.normalizePacienteForTable(p));
      },
      error: () => {
        this.listaPacientes = [];
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
  }

  abrirModalEditar(pacienteSeleccionado: any) {
    this.pacienteActual = structuredClone(pacienteSeleccionado);
    this.mostrarModalDialog = true;
  }

  eliminarPaciente(pacienteSeleccionado: any) {
    this.patientsApi.delete(pacienteSeleccionado.id).subscribe({
      next: () => {
        this.listaPacientes = this.listaPacientes.filter((pac) => pac.id !== pacienteSeleccionado.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Paciente eliminado correctamente',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el paciente',
        });
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
      this.patientsApi.update(this.pacienteActual.id, this.pacienteActual).subscribe({
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
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el paciente',
          });
        },
      });
    } else {
      this.patientsApi.create(this.pacienteActual).subscribe({
        next: (created) => {
          this.listaPacientes.push(this.normalizePacienteForTable(created ?? this.pacienteActual));
          this.listaPacientes = [...this.listaPacientes];
          this.mostrarModalDialog = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'Paciente registrado exitosamente',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo registrar el paciente',
          });
        },
      });
    }
  }

  ocultarDialog() {
    this.mostrarModalDialog = false;
  }
}
