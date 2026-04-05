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
import { TextareaModule } from 'primeng/textarea';
import { FluidModule } from 'primeng/fluid';
import { finalize } from 'rxjs';
import { GenericCrudComponent, TableColumn } from '../../../../shared/ui/crud/crud';
import { SpecialtiesApiService } from '../../services/specialties-api.service';
import { LoadingOverlay } from '../../../../shared/ui/loading-overlay/loading-overlay';

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
    LoadingOverlay,
  ],
  templateUrl: './specialties-crud.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrudSpecialtiesComponent {
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
    private readonly cdr: ChangeDetectorRef,
  ) {
    afterNextRender(() => this.cargarEspecialidades());
  }

  private cargarEspecialidades(): void {
    this.startLoading();
    this.specialtiesApi
      .getAll()
      .pipe(finalize(() => this.stopLoading()))
      .subscribe({
      next: (items) => {
        this.listaEspecialidades = Array.isArray(items) ? items : [];
        this.cdr.markForCheck();
      },
      error: () => {
        this.listaEspecialidades = [];
        this.cdr.markForCheck();
      },
    });
  }

  abrirModalNuevo() {
    this.especialidadActual = {
      nombre: '',
      descripcion: '',
    };
    this.mostrarModalDialog = true;
    this.cdr.markForCheck();
  }

  abrirModalEditar(especialidadSeleccionada: any) {
    this.especialidadActual = structuredClone(especialidadSeleccionada);
    this.mostrarModalDialog = true;
    this.cdr.markForCheck();
  }

  eliminarEspecialidad(especialidadSeleccionada: any) {
    this.startLoading();
    this.specialtiesApi
      .delete(especialidadSeleccionada.id)
      .pipe(finalize(() => this.stopLoading()))
      .subscribe({
      next: () => {
        this.listaEspecialidades = this.listaEspecialidades.filter(
          (esp) => esp.id !== especialidadSeleccionada.id,
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Especialidad eliminada correctamente',
        });
        this.cdr.markForCheck();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la especialidad',
        });
        this.cdr.markForCheck();
      },
    });
  }

  guardarEspecialidad() {
    if (!this.especialidadActual.nombre) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es obligatorio',
      });
      return;
    }

    const payload = {
      nombre: this.especialidadActual.nombre,
      descripcion: this.especialidadActual.descripcion ?? '',
    };

    if (this.especialidadActual.id) {
      this.startLoading();
      this.specialtiesApi
        .update(this.especialidadActual.id, payload)
        .pipe(finalize(() => this.stopLoading()))
        .subscribe({
        next: () => {
          const index = this.listaEspecialidades.findIndex((e) => e.id === this.especialidadActual.id);
          if (index >= 0) {
            this.listaEspecialidades[index] = {
              ...this.listaEspecialidades[index],
              ...payload,
            };
          }

          this.listaEspecialidades = [...this.listaEspecialidades];
          this.mostrarModalDialog = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Especialidad actualizada correctamente',
          });

          this.cdr.markForCheck();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la especialidad',
          });
          this.cdr.markForCheck();
        },
      });
    } else {
      this.startLoading();
      this.specialtiesApi
        .create(payload)
        .pipe(finalize(() => this.stopLoading()))
        .subscribe({
        next: (created) => {
          this.listaEspecialidades.push(created ?? { ...this.especialidadActual, ...payload });
          this.listaEspecialidades = [...this.listaEspecialidades];
          this.mostrarModalDialog = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'Especialidad registrada exitosamente',
          });

          this.cdr.markForCheck();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo registrar la especialidad',
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
