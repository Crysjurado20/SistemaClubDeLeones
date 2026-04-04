import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type DashboardKpis = {
  totalPatients: number;
  monthlyIncome: number;
  monthlyAppointments: number;
  activeDoctors: number;
};

export type DashboardCharts = {
  incomeBySpecialty: Array<{ label: string; value: number }>;
  appointmentsByMonth: Array<{ label: string; value: number }>;
  patientsByGender: Array<{ label: string; value: number }>;
  billingStatus: Array<{ label: string; value: number }>;
};

export type DashboardResponse = {
  kpis: DashboardKpis;
  charts: DashboardCharts;
};

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = '/api';

  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.apiBase}/admin/dashboard`);
  }
}
