import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type LoginRequest = { correo: string; contrasena: string };

export type LoginResponse = {
  token: string;
  idUsuario: number;
  nombres: string;
  rol: string;
};

export type RegistroPacienteRequest = {
  cedula: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string | Date;
  genero: number;
  telefono: string;
  correo: string;
  contrasena: string;
  direccion: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
   http = inject(HttpClient);
   apiUrl = 'https://localhost:7064/api/Auth'; 

  registrarPaciente(datosPaciente: RegistroPacienteRequest): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/registro/paciente`, datosPaciente);
  }

  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credenciales);
  }
}