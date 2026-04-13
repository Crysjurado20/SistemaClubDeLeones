import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { SelectorEspecialidadComponent } from './components/selector-especialidad/selector-especialidad';
import { CalendarCustomComponent } from './components/calendar-custom/calendar-custom';
import { DoctorTimeModal, AppointmentCheckoutData } from './components/doctor-time-modal/doctor-time-modal';
import { PaymentMethodsComponent } from './components/payment-method/payment-method';
import { Header } from "../../../../shared/ui/header/header";
import { AuthService } from '../../../../core/services/auth.service';
import { PatientApiService, PatientDoctorAvailability } from '../../../../core/services/patient-api.service';
import { LoadingOverlay } from '../../../../shared/ui/loading-overlay/loading-overlay';

@Component({
  selector: 'app-appointments-form',
  standalone: true,
  imports: [
    CommonModule,
    SelectorEspecialidadComponent,
    CalendarCustomComponent,
    DoctorTimeModal,
    PaymentMethodsComponent,
    ToastModule,
    ConfirmDialogModule,
    FormsModule,
    ButtonModule,
    FieldsetModule,
    InputGroupModule,
    InputGroupAddonModule,
    SelectModule,
    DrawerModule,
    Header,
    LoadingOverlay
],
  providers: [ConfirmationService],
  templateUrl: './appointment-form.html',
})
export class AppointmentsFormComponent {
  readonly userLabel: string;
  
  constructor(
      private readonly authService: AuthService,
      private readonly patientApi: PatientApiService,
      private readonly messageService: MessageService,
      private readonly confirmationService: ConfirmationService,
      private readonly cdr: ChangeDetectorRef,
      private readonly router: Router,
  ) {
    this.userLabel = this.authService.getDisplayLabel();
  }

  vistaActual: 'agendamiento' | 'pagos' = 'agendamiento';
  mostrarModal: boolean = false;

  especialidadSeleccionada: any = null;
  fechaSeleccionada: Date | null = null;
  citaConfirmada: AppointmentCheckoutData | null = null;

  cargandoDisponibilidad: boolean = false;
  agendando: boolean = false;
  cargandoCalendario: boolean = false;
  mostrandoCalendario: boolean = false;

  listaMedicos: Array<PatientDoctorAvailability & { horarios: Array<any> }> = [];

  recibirEspecialidad(especialidad: any) {
    const previousSpecialtyId = this.especialidadSeleccionada?.idEspecialidad ?? null;
    const nextSpecialtyId = especialidad?.idEspecialidad ?? null;
    const specialtyChanged = previousSpecialtyId !== nextSpecialtyId;

    this.especialidadSeleccionada = especialidad;

    if (!this.mostrandoCalendario || specialtyChanged) {
      this.mostrandoCalendario = true;
      // Solo activamos loading cuando realmente hay una carga nueva del calendario.
      this.cargandoCalendario = true;
    }

    this.cdr.markForCheck();
  }

  onCalendarioLoadingChange(loading: boolean) {
    this.cargandoCalendario = loading;
    this.cdr.markForCheck();
  }

  abrirModalDoctores(fecha: Date) {
    if (!this.especialidadSeleccionada?.idEspecialidad) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Primero selecciona una especialidad.',
      });
      return;
    }

    // Validación de fecha pasada (coherente con backend DateTime.UtcNow)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(fecha);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate.getTime() < today.getTime()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Fecha no válida',
        detail: 'No puedes agendar citas en fechas pasadas. Selecciona una fecha futura.',
      });
      return;
    }

    this.fechaSeleccionada = fecha;
    this.cargandoDisponibilidad = true;
    this.listaMedicos = [];
    this.cdr.markForCheck();

    const fechaStr = this.formatLocalDateYMD(fecha);
    const idEspecialidad = this.especialidadSeleccionada.idEspecialidad as number;

    this.patientApi
      .getAvailability(idEspecialidad, fechaStr)
      .pipe(
        finalize(() => {
          this.cargandoDisponibilidad = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (items) => {
          this.listaMedicos = (items ?? []).map((m) => ({
            ...m,
            horarios: (m.horarios ?? []).map((h: any) => ({ ...h, seleccionado: false })),
          }));
          this.mostrarModal = true;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error cargando disponibilidad:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'No se pudo cargar disponibilidad',
            detail: 'Intenta nuevamente.',
          });
        },
      });
  }

  confirmarCita(datosCita: AppointmentCheckoutData) {
    this.mostrarModal = false;
    this.citaConfirmada = datosCita;
    this.vistaActual = 'pagos';
  }

  pagarYAgendar(metodoPago: string) {
    if (this.agendando) return;

    const idPaciente = this.authService.getUserId();
    const fecha = this.fechaSeleccionada;
    const cita = this.citaConfirmada;
    const idEspecialidad = this.especialidadSeleccionada?.idEspecialidad as number | undefined;

    if (!idPaciente || !fecha || !cita || !idEspecialidad) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Faltan datos para agendar la cita.',
      });
      return;
    }

    const idMedico = cita.doctor?.id as number | undefined;
    const hora = cita.timeSlot?.hora as string | undefined;
    if (!idMedico || !hora) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Selecciona un turno válido.',
      });
      return;
    }

    this.agendando = true;
    this.cdr.markForCheck();

    this.patientApi
      .createAppointment({
        idPaciente,
        idMedico,
        idEspecialidad,
        fecha: this.formatLocalDateYMD(fecha),
        hora,
        metodoPago,
      })
      .pipe(
        finalize(() => {
          this.agendando = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Cita agendada',
            detail: res?.mensaje ?? 'Cita agendada correctamente.',
          });
          void this.router.navigate(['/appointment-list']);
        },
        error: (err) => {
          console.error('Error creando cita:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'No se pudo agendar',
            detail: err?.error?.mensaje || 'Intenta nuevamente.',
          });
        },
      });
  }

  private formatLocalDateYMD(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  
}