import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

export interface TableColumn {
  field: string;
  header: string;
  type?: 'text' | 'currency' | 'date' | 'tag' | 'array';
}

@Component({
  selector: 'app-generic-crud',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    ConfirmDialogModule,
  ],
  templateUrl: './crud.html',
  providers: [ConfirmationService],
})
export class GenericCrudComponent {
  @Input() title: string = 'Gestionar Registros';
  @Input() items: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() globalFilterFields: string[] = [];

  @Input() expandable: boolean = false;
  @Input() expandedArrayField: string = '';
  @Input() expandedColumns: TableColumn[] = [];

  @Output() onCreate = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  selectedItems: any[] = [];

  constructor(private confirmationService: ConfirmationService) {}

  openNew() {
    this.onCreate.emit();
  }

  editItem(item: any) {
    this.onEdit.emit(item);
  }

  deleteItem(item: any) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este registro?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.onDelete.emit(item);
      },
    });
  }

  deleteSelectedItems() {
    // Lógica para eliminar múltiples (opcional para el futuro)
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
