import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { Header } from '../../../../shared/ui/header/header';
import { PdfService } from '../../services/pdf.service';
import { AuthService } from '../../../../core/services/auth.service';

export interface FacturaElectronica {
  id: string;
  numeroFactura: string;
  fechaEmision: string;
  medico: string;
  especialidad: string;
  total: number;
  estado: string;
}

@Component({
  selector: 'app-facturas-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    AvatarModule,
    TooltipModule,
    TagModule,
    DialogModule, 
    Header,
  ],
  templateUrl: './invoices-list.html',
})
export class InvoicesListComponent implements OnInit {
  nombrePaciente: string = 'Juan López';
  facturas: FacturaElectronica[] = [];
  loading: boolean = true;
  mostrarModalPdf: boolean = false;
  pdfSrc: SafeResourceUrl | null = null;

  get headerUserLabel(): string {
    return this.authService.getDisplayLabel();
  }

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private readonly pdfService: PdfService,
    private readonly sanitizer: DomSanitizer,
    private readonly authService: AuthService,
  ) {}

  ngOnInit() {
    this.facturas = [
      {
        id: '1',
        numeroFactura: '001-002-00001024',
        fechaEmision: '2026-03-25',
        medico: 'Dr. Vasconez Yepez Luis',
        especialidad: 'Consulta - Cardiología',
        total: 35,
        estado: 'Pagada',
      },
      {
        id: '2',
        numeroFactura: '001-002-00001089',
        fechaEmision: '2026-04-02',
        medico: 'Dra. Astudillo Silva Marcia',
        especialidad: 'Consulta - Cirugía Maxilofacial',
        total: 50,
        estado: 'Pagada',
      },
    ];
    this.loading = false;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  descargarFactura(factura: FacturaElectronica) {
    const pdf = this.pdfService.generarFacturaPdf(factura, this.nombrePaciente);
    pdf
      .getDataUrl()
      .then((dataUrl: string) => {
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
        this.mostrarModalPdf = true;
      })
      .catch((error: any) => {
        console.error('Error al generar el PDF:', error);
      });
  }
}
