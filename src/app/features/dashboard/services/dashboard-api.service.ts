import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type DashboardAppointmentStateStat = {
    codigo: string;
    etiqueta: string;
    cantidad: number;
};

export type DashboardSpecialtyStat = {
    nombre: string;
    cantidad: number;
};

export type DashboardMonthlyIncomeStat = {
    etiqueta: string;
    monto: number;
};

export type DashboardStatsResponse = {
    citasPorEstado: DashboardAppointmentStateStat[];
    especialidadesMasSolicitadas: DashboardSpecialtyStat[];
    ingresosMensuales: DashboardMonthlyIncomeStat[];
};

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
    private readonly http = inject(HttpClient);
    private readonly apiBase = environment.apiUrl;

    getDashboardStats(): Observable<DashboardStatsResponse> {
        return this.http.get<DashboardStatsResponse>(`${this.apiBase}/admin/dashboard`);
    }

    getDashboard(): Observable<DashboardStatsResponse> {
        return this.getDashboardStats();
    }
}
