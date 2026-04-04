import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpecialtiesApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = '/api';

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/specialties`);
  }

  create(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/specialties`, payload);
  }

  update(id: string | number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiBase}/specialties/${id}`, payload);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/specialties/${id}`);
  }
}
