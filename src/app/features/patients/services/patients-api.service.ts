import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PatientsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiUrl;

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/patients`);
  }

  create(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/patients`, payload);
  }

  update(id: string | number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiBase}/patients/${id}`, payload);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/patients/${id}`);
  }
}
