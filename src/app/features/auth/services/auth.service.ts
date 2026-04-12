import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type LoginRequest = { correo: string; contrasena: string };

export type LoginResponse = {
    token: string;
    idUsuario: number;
    nombres: string;
    rol: string;
    debeCambiarContrasena?: boolean;
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

export type SolicitarRecuperacionContrasenaRequest = {
    correo: string;
};

export type SolicitarRecuperacionContrasenaResponse = {
    mensaje: string;
};

export type ValidarTokenRecuperacionRequest = {
    token: string;
};

export type ValidarTokenRecuperacionResponse = {
    esValido: boolean;
    mensaje: string;
};

export type RestablecerContrasenaConTokenRequest = {
    token: string;
    nuevaContrasena: string;
};

export type RestablecerContrasenaConTokenResponse = {
    mensaje: string;
};

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    http = inject(HttpClient);
    apiUrl = environment.apiUrl + '/Auth';

    registrarPaciente(datosPaciente: RegistroPacienteRequest): Observable<{ mensaje: string }> {
        return this.http.post<{ mensaje: string }>(`${this.apiUrl}/registro/paciente`, datosPaciente);
    }

    login(credenciales: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credenciales);
    }

    solicitarRecuperacionContrasena(
        request: SolicitarRecuperacionContrasenaRequest,
    ): Observable<SolicitarRecuperacionContrasenaResponse> {
        return this.http.post<SolicitarRecuperacionContrasenaResponse>(
            `${this.apiUrl}/recuperar-contrasena/solicitar`,
            request,
        );
    }

    validarTokenRecuperacion(
        request: ValidarTokenRecuperacionRequest,
    ): Observable<ValidarTokenRecuperacionResponse> {
        return this.http.post<ValidarTokenRecuperacionResponse>(
            `${this.apiUrl}/recuperar-contrasena/validar`,
            request,
        );
    }

    restablecerContrasenaConToken(
        request: RestablecerContrasenaConTokenRequest,
    ): Observable<RestablecerContrasenaConTokenResponse> {
        return this.http.post<RestablecerContrasenaConTokenResponse>(
            `${this.apiUrl}/recuperar-contrasena/cambiar`,
            request,
        );
    }
}