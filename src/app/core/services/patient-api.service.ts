import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type PatientSpecialtyOption = {
  idEspecialidad: number;
  name: string;
  codigo?: string | null;
};

export type PatientTimeSlot = {
  id: number;
  hora: string;
  estado: 'disponible' | 'ocupado' | 'bloqueado' | 'no_disponible';
};

export type PatientDoctorAvailability = {
  id: number;
  nombre: string;
  precio: number;
  dias: string;
  horarios: PatientTimeSlot[];
};

export type CreatePatientAppointmentRequest = {
  idPaciente: number;
  idMedico: number;
  idEspecialidad: number;
  creadaPorMedico?: boolean | null;
  fecha: string; // yyyy-MM-dd
  hora: string; // HH:mm
  metodoPago?: string | null;
  observacion?: string | null;
};

export type CreatePatientAppointmentResponse = {
  mensaje: string;
  idCita: number;
  idFactura: number;
  numeroFactura: string;
};

export type PatientAppointment = {
  id: number;
  cedula: string;
  medico: string;
  especialidad: string;
  fecha: string;
  hora: string;
  unidadMedica: string;
  ubicacion: string;
};

export type CancelPatientAppointmentResponse = {
  mensaje: string;
};

export type PatientInvoice = {
  id: number;
  numeroFactura: string;
  fechaEmision: string;
  medico: string;
  especialidad: string;
  total: number;
  estado: string;
};

@Injectable({ providedIn: 'root' })
export class PatientApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiUrl + '/patient';

  getSpecialties(): Observable<PatientSpecialtyOption[]> {
    return this.http.get<PatientSpecialtyOption[]>(`${this.apiBase}/specialties`);
  }

  getAvailability(especialidadId: number, fecha: string): Observable<PatientDoctorAvailability[]> {
    const params = new HttpParams().set('especialidadId', especialidadId).set('fecha', fecha);
    return this.http.get<PatientDoctorAvailability[]>(`${this.apiBase}/availability`, { params });
  }

  createAppointment(payload: CreatePatientAppointmentRequest): Observable<CreatePatientAppointmentResponse> {
    return this.http.post<CreatePatientAppointmentResponse>(`${this.apiBase}/appointments`, payload);
  }

  getAppointmentsByPaciente(idPaciente: number): Observable<PatientAppointment[]> {
    return this.http.get<PatientAppointment[]>(`${this.apiBase}/appointments/${idPaciente}`);
  }

  cancelAppointment(idCita: number, idPaciente: number): Observable<CancelPatientAppointmentResponse> {
    return this.http.put<CancelPatientAppointmentResponse>(
      `${this.apiBase}/appointments/${idCita}/cancel`,
      { idPaciente },
    );
  }

  getInvoicesByPaciente(idPaciente: number): Observable<PatientInvoice[]> {
    return this.http.get<PatientInvoice[]>(`${this.apiBase}/invoices/${idPaciente}`);
  }
}
