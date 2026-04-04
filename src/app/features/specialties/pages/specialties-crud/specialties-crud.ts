import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FluidModule } from 'primeng/fluid';
import { GenericCrudComponent, TableColumn } from '../../../../shared/ui/crud/crud';
import { SpecialtiesApiService } from '../../services/specialties-api.service';

@Component({
  selector: 'app-crud-specialties',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    FluidModule,
    GenericCrudComponent,
  ],
  templateUrl: './specialties-crud.html',
  providers: [MessageService],
})
export class CrudSpecialtiesComponent implements OnInit {
  // Columnas para la tabla
  columnasEspecialidades: TableColumn[] = [
    { field: 'codigo', header: 'Código', type: 'text' },
    { field: 'nombre', header: 'Nombre de Especialidad', type: 'text' },
    { field: 'descripcion', header: 'Descripción', type: 'text' },
  ];

  listaEspecialidades: any[] = [];
  camposFiltro: string[] = ['codigo', 'nombre', 'descripcion'];

  mostrarModalDialog: boolean = false;
  especialidadActual: any = {};

  constructor(
    private readonly messageService: MessageService,
    private readonly specialtiesApi: SpecialtiesApiService,
  ) {}

  ngOnInit() {
    this.cargarEspecialidades();
  }

  private cargarEspecialidades(): void {
    this.specialtiesApi.getAll().subscribe({
      next: (items) => {
        this.listaEspecialidades = Array.isArray(items) ? items : [];
      },
      error: () => {
        this.listaEspecialidades = [];
      },
    });
  }

  abrirModalNuevo() {
    this.especialidadActual = {
      codigo: '',
      nombre: '',
      descripcion: '',
    };
    this.mostrarModalDialog = true;
  }

  abrirModalEditar(especialidadSeleccionada: any) {
    this.especialidadActual = structuredClone(especialidadSeleccionada);
    this.mostrarModalDialog = true;
  }

  eliminarEspecialidad(especialidadSeleccionada: any) {
    this.specialtiesApi.delete(especialidadSeleccionada.id).subscribe({
      next: () => {
        this.listaEspecialidades = this.listaEspecialidades.filter(
          (esp) => esp.id !== especialidadSeleccionada.id,
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Especialidad eliminada correctamente',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la especialidad',
        });
      },
    });
  }

  guardarEspecialidad() {
    if (!this.especialidadActual.codigo || !this.especialidadActual.nombre) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El código y el nombre son obligatorios',
      });
      return;
    }

    // Convertimos el código a mayúsculas automáticamente
    this.especialidadActual.codigo = this.especialidadActual.codigo.toUpperCase();

    if (this.especialidadActual.id) {
      this.specialtiesApi.update(this.especialidadActual.id, this.especialidadActual).subscribe({
        next: () => {
          const index = this.listaEspecialidades.findIndex((e) => e.id === this.especialidadActual.id);
          if (index >= 0) this.listaEspecialidades[index] = this.especialidadActual;

          this.listaEspecialidades = [...this.listaEspecialidades];
          this.mostrarModalDialog = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Especialidad actualizada correctamente',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la especialidad',
          });
        },
      });
    } else {
      this.specialtiesApi.create(this.especialidadActual).subscribe({
        next: (created) => {
          this.listaEspecialidades.push(created ?? this.especialidadActual);
          this.listaEspecialidades = [...this.listaEspecialidades];
          this.mostrarModalDialog = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'Especialidad registrada exitosamente',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo registrar la especialidad',
          });
        },
      });
    }
  }

  ocultarDialog() {
    this.mostrarModalDialog = false;
  }
}
