import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { FluidModule } from 'primeng/fluid';
import { GenericCrudComponent, TableColumn } from '../../../../shared/ui/crud/crud';
import { DoctorsApiService } from '../../services/doctors-api.service';
import { SpecialtiesApiService } from '../../../specialties/services/specialties-api.service';

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
],
  templateUrl: './doctors-crud.html',
  providers: [MessageService],
})
export class CrudDoctorsComponent implements OnInit {

  columnasDoctores: TableColumn[] = [
    { field: 'cedula', header: 'Cédula', type: 'text' },
    { field: 'nombre', header: 'Nombre Completo', type: 'text' },
    { field: 'especialidad', header: 'Especialidades y Costos', type: 'array' },
    { field: 'telefono', header: 'Teléfono', type: 'text' }
  ];

  columnasEspecialidades: TableColumn[] = [
    { field: 'name', header: 'Especialidad Médica', type: 'text' },
    { field: 'precio', header: 'Costo de Consulta', type: 'currency' }
  ];

  listaDoctores: any[] = [];
  camposFiltro: string[] = ['nombre', 'cedula', 'especialidad', 'licencia'];

  mostrarModalDialog: boolean = false;
  doctorActual: any = {};

  especialidadesOpciones: Array<{ name: string; code: string }> = [];

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
  ) {}

  ngOnInit() {
    this.cargarDoctores();
    this.cargarOpcionesEspecialidades();
  }

  private cargarDoctores(): void {
    this.doctorsApi.getAll().subscribe({
      next: (items) => {
        this.listaDoctores = Array.isArray(items) ? items : [];
      },
      error: () => {
        this.listaDoctores = [];
      },
    });
  }

  private cargarOpcionesEspecialidades(): void {
    this.specialtiesApi.getAll().subscribe({
      next: (items) => {
        const list = Array.isArray(items) ? items : [];
        this.especialidadesOpciones = list
          .map((s: any) => ({
            name: (s?.nombre ?? s?.name ?? '').toString(),
            code: (s?.codigo ?? s?.code ?? '').toString(),
          }))
          .filter((s) => s.name && s.code);
      },
      error: () => {
        this.especialidadesOpciones = [];
      },
    });
  }

  abrirModalNuevo() {
    this.doctorActual = {
      cedula: '',
      nombre: '',
      especialidad: [],
      dias: []
    };
    this.mostrarModalDialog = true;
  }

  abrirModalEditar(doctorSeleccionado: any) {
    this.doctorActual = structuredClone(doctorSeleccionado);
    this.mostrarModalDialog = true;
  }

  eliminarDoctor(doctorSeleccionado: any) {
    this.doctorsApi.delete(doctorSeleccionado.id).subscribe({
      next: () => {
        this.listaDoctores = this.listaDoctores.filter((doc) => doc.id !== doctorSeleccionado.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Doctor eliminado correctamente',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el doctor',
        });
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

    if (this.doctorActual.id) {
      this.doctorsApi.update(this.doctorActual.id, this.doctorActual).subscribe({
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
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el doctor',
          });
        },
      });
      return;
    }

    this.doctorsApi.create(this.doctorActual).subscribe({
      next: (created) => {
        this.listaDoctores.push(created ?? this.doctorActual);
        this.listaDoctores = [...this.listaDoctores];
        this.mostrarModalDialog = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Creado',
          detail: 'Doctor registrado exitosamente',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar el doctor',
        });
      },
    });
  }

  ocultarDialog() {
    this.mostrarModalDialog = false;
  }
}