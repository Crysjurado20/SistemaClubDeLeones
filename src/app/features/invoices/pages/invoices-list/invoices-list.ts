import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { PatientApiService } from '../../../../core/services/patient-api.service';

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
  nombrePaciente: string = 'Usuario';
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
    private readonly patientApi: PatientApiService,
    private readonly messageService: MessageService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.nombrePaciente = this.authService.getStoredUserName();
    const idPaciente = this.authService.getUserId();

    if (!idPaciente) {
      this.loading = false;
      this.messageService.add({
        severity: 'warn',
        summary: 'Sesión',
        detail: 'No se pudo identificar al paciente.',
      });
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.patientApi
      .getInvoicesByPaciente(idPaciente)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (items) => {
          this.facturas = (items ?? []) as any;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error cargando facturas:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'No se pudieron cargar las facturas',
            detail: 'Intenta nuevamente.',
          });
        },
      });
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
