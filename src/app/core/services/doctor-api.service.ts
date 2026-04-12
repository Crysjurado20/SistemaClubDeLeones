import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type DoctorSpecialty = {
  idEspecialidad: number;
  nombre: string;
};

export type DoctorAgendaDay = {
  key: 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';
  label: string;
  activo: boolean;
  inicio: string | null; // HH:mm
  fin: string | null; // HH:mm
	duracionTurnoMinutos?: 15 | 30 | 60;
	turnosActivos?: string[];
};

export type DoctorAgendaConfig = {
  horarioSemana: DoctorAgendaDay[];
  bloqueos: Record<string, string>; // yyyy-MM-dd -> motivo
};

export type DoctorPatientRef = {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
};

export type DoctorWeekAppointment = {
  idCita: number;
  fecha: string; // yyyy-MM-dd
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  estado: 'pendiente' | 'pendiente_pago' | 'ocupado' | 'atendido' | 'bloqueado' | 'cancelado' | 'no_asistio';
  especialidad: string;
  tipoConsulta: string;
  observacion: string;
  paciente: DoctorPatientRef | null;
};

export type DoctorDailyAppointment = {
  idCita: number;
  idPaciente: number;
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  cedula: string;
  apellidos: string;
  nombres: string;
  especialidad: string;
  tipoConsulta: string;
  estado: 'pendiente' | 'pendiente_pago' | 'ocupado' | 'atendido' | 'bloqueado' | 'cancelado' | 'no_asistio';
};

export type ConfirmPaymentRequest = {
  idMedico: number;
};

export type RescheduleAppointmentRequest = {
  idMedico: number;
  fecha: string; // yyyy-MM-dd
  hora: string; // HH:mm
};

export type AttendMedication = {
  medicamento: string;
  dosis: string;
  fechaMandada?: string | null; // yyyy-MM-dd
};

export type AttendDiagnostico = {
  nombre: string;
  descripcion: string;
  medicacion: AttendMedication[];
};

export type AttendAppointmentRequest = {
  idMedico: number;
  tipoConsulta?: string | null;
  observaciones?: string | null;
  antecedentes?: Array<{ tipo: string; descripcion: string }>;
  diagnosticos: AttendDiagnostico[];
};

export type DoctorClinicalHistory = {
  header: {
    idPaciente: number;
    historiaClinica: string;
    cedula: string;
    apellidos: string;
    nombres: string;
  };
  datosPersonales: {
    dni: string;
    fechaNacimiento: string;
    sexo: string;
    telefono: string;
    email: string;
  };
  diagnosticos: Array<{ codigo: string; descripcion: string; activo: boolean }>;
  antecedentes: Array<{ tipo: string; detalle: string }>;
  medicacion: Array<{ id: string; nombre: string; posologia: string; fechaMandada: string }>;
  turnos: Array<{
    id: string;
    fecha: string;
    hora: string;
    doctor: string;
    especialidad: string;
    tipoConsulta: string;
    observacionTitulo: string;
    observacionDetalle: string;
    estado: string;
  }>;
};

@Injectable({ providedIn: 'root' })
export class DoctorApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiUrl + '/doctor';

  getSpecialties(idMedico: number): Observable<DoctorSpecialty[]> {
    return this.http.get<DoctorSpecialty[]>(`${this.apiBase}/specialties/${idMedico}`);
  }

  getAgendaConfig(idMedico: number): Observable<DoctorAgendaConfig> {
    return this.http.get<DoctorAgendaConfig>(`${this.apiBase}/agenda-config/${idMedico}`);
  }

  putAgendaConfig(idMedico: number, payload: DoctorAgendaConfig): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiBase}/agenda-config/${idMedico}`, payload);
  }

  getWeekAppointments(idMedico: number, start: string): Observable<DoctorWeekAppointment[]> {
    const params = new HttpParams().set('start', start);
    return this.http.get<DoctorWeekAppointment[]>(`${this.apiBase}/appointments/week/${idMedico}`, { params });
  }

  getDayAppointments(idMedico: number, date: string): Observable<DoctorDailyAppointment[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<DoctorDailyAppointment[]>(`${this.apiBase}/appointments/day/${idMedico}`, { params });
  }

  attendAppointment(idCita: number, payload: AttendAppointmentRequest): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiBase}/appointments/${idCita}/attend`, payload);
  }

  confirmPayment(idCita: number, payload: ConfirmPaymentRequest): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiBase}/appointments/${idCita}/confirm-payment`, payload);
  }

  rescheduleAppointment(idCita: number, payload: RescheduleAppointmentRequest): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiBase}/appointments/${idCita}/reschedule`, payload);
  }
  cancelAppointment(idCita: number, idMedico: number): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiBase}/appointments/${idCita}/cancel`, { idMedico });
  }

  markNoShow(idCita: number): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiBase}/appointments/${idCita}/no-show`, {});
  }

  markBusy(idCita: number): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiBase}/appointments/${idCita}/busy`, {});
  }

  markBlocked(idCita: number): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiBase}/appointments/${idCita}/block`, {});
  }

  getClinicalHistory(idPaciente: number): Observable<DoctorClinicalHistory> {
    return this.http.get<DoctorClinicalHistory>(`${this.apiBase}/patients/${idPaciente}/clinical-history`);
  }
}
