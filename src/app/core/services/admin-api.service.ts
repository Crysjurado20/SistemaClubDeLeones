import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type AdminPatient = {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento?: string | null;
};

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);

  getPatients(): Observable<AdminPatient[]> {
    return this.http.get<AdminPatient[]>(environment.apiUrl + '/patients');
  }
}
