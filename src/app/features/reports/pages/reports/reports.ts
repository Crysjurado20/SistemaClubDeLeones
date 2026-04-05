import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { FluidModule } from 'primeng/fluid';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DatePickerModule,
    TableModule,
    FluidModule,
    SelectModule
  ],
  templateUrl: './reports.html',
})
export class ReportsComponent implements OnInit {
  
  tiposReporte: any[] = [];
  reporteSeleccionado: any = null;
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  columnasDinamicas: any[] = [];
  datosReporte: any[] = [];
  cargando: boolean = false;

  constructor(
    private readonly messageService: MessageService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.tiposReporte = [
      { id: 1, nombre: 'Consolidado de Ingresos y Facturación', code: 'FINANCIERO' },
      { id: 2, nombre: 'Productividad por Médico', code: 'OPERATIVO' },
      { id: 3, nombre: 'Listado de Pacientes por Especialidad', code: 'DEMOGRAFICO' }
    ];
  }

  generarReporte() {
    if (!this.reporteSeleccionado) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Seleccione un tipo de reporte' });
      return;
    }

    this.cargando = true;

    setTimeout(() => {
      switch (this.reporteSeleccionado.code) {
        case 'FINANCIERO':
          this.cargarReporteFinanciero();
          break;
        case 'OPERATIVO':
          this.cargarReporteOperativo();
          break;
        case 'DEMOGRAFICO':
          this.cargarReporteDemografico();
          break;
      }
      this.cargando = false;
      this.cdr.markForCheck();
    }, 600);
  }


  cargarReporteFinanciero() {
    this.columnasDinamicas = [
      { field: 'factura', header: 'Nro. Factura' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'paciente', header: 'Paciente' },
      { field: 'medico', header: 'Médico' },
      { field: 'total', header: 'Total (USD)' },
      { field: 'estado', header: 'Estado' }
    ];
    this.datosReporte = [
      { factura: '001-002-00001024', fecha: '25/03/2026', paciente: 'Juan López', medico: 'Dr. Vasconez', total: '$35.00', estado: 'Pagada' },
      { factura: '001-002-00001089', fecha: '02/04/2026', paciente: 'María Pérez', medico: 'Dra. Astudillo', total: '$50.00', estado: 'Pagada' }
    ];
  }

  cargarReporteOperativo() {
    this.columnasDinamicas = [
      { field: 'medico', header: 'Nombre del Médico' },
      { field: 'especialidad', header: 'Especialidad' },
      { field: 'pacientesAtendidos', header: 'Pacientes Atendidos' },
      { field: 'totalGenerado', header: 'Total Generado (USD)' }
    ];
    this.datosReporte = [
      { medico: 'Dra. Astudillo Silva Marcia', especialidad: 'Cirugía Maxilofacial', pacientesAtendidos: 45, totalGenerado: '$2,250.00' },
      { medico: 'Dr. Vasconez Yepez Luis', especialidad: 'Cardiología', pacientesAtendidos: 38, totalGenerado: '$1,330.00' }
    ];
  }

  cargarReporteDemografico() {
    this.columnasDinamicas = [
      { field: 'cedula', header: 'Cédula' },
      { field: 'paciente', header: 'Nombre del Paciente' },
      { field: 'telefono', header: 'Teléfono' },
      { field: 'ultimaCita', header: 'Última Cita' },
      { field: 'especialidad', header: 'Especialidad Atendida' }
    ];
    this.datosReporte = [
      { cedula: '1804567890', paciente: 'Juan Carlos López', telefono: '0991234567', ultimaCita: '02/04/2026', especialidad: 'Cirugía Maxilofacial' },
      { cedula: '1722334455', paciente: 'Ana Gómez', telefono: '0987654321', ultimaCita: '15/03/2026', especialidad: 'Cardiología' }
    ];
  }

  exportarPDF() {
    this.messageService.add({ severity: 'info', summary: 'En construcción', detail: 'Próximamente exportará a PDF con Times New Roman' });
  }

  exportarExcel() {
    this.messageService.add({ severity: 'info', summary: 'En construcción', detail: 'Próximamente exportará a Excel' });
  }
}