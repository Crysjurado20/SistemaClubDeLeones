import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectorEspecialidadComponent } from './components/selector-especialidad/selector-especialidad';
import { CalendarCustomComponent } from './components/calendar-custom/calendar-custom';
import { DoctorTimeModal, AppointmentCheckoutData } from './components/doctor-time-modal/doctor-time-modal';
import { PaymentMethodsComponent } from './components/payment-method/payment-method';
import { Header } from "../../../../shared/ui/header/header";
import { AuthService } from '../../../../core/services/auth.service';

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
    Header
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './appointment-form.html',
})
export class AppointmentsFormComponent {
  readonly userLabel: string;
  
  constructor(
      private readonly authService: AuthService,
      messageService: MessageService,
      confirmationService: ConfirmationService,
  ) {
    this.userLabel = this.authService.getDisplayLabel();
  }

  vistaActual: 'agendamiento' | 'pagos' = 'agendamiento';
  mostrarModal: boolean = false;

  especialidadSeleccionada: any = null;
  fechaSeleccionada: Date | null = null;
  citaConfirmada: AppointmentCheckoutData | null = null;

  listaMedicos = [
    {
      id: 1,
      nombre: 'Astudillo Silva Marcia Andrea',
      precio: '12.00',
      dias: 'Martes Jueves Viernes Sabado',
      horarios: [
        { id: 101, hora: '08:00', estado: 'disponible', seleccionado: false },
        { id: 103, hora: '09:00', estado: 'ocupado', seleccionado: false },
      ],
    },
  ];

  recibirEspecialidad(especialidad: any) {
    this.especialidadSeleccionada = especialidad;
    console.log('Especialidad elegida:', especialidad);
  }

  abrirModalDoctores(fecha: Date) {
    this.fechaSeleccionada = fecha;
    this.mostrarModal = true;
  }

  confirmarCita(datosCita: AppointmentCheckoutData) {
    this.mostrarModal = false;
    this.citaConfirmada = datosCita;
    this.vistaActual = 'pagos';
  }

  
}