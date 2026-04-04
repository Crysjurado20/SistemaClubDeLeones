export type EstadoCita = 'atendido' | 'pendiente' | 'ocupado' | 'bloqueado';

export interface DailyAppointment {
  historiaClinica: string;
  cedula: string;
  apellidos: string;
  nombres: string;
  tipoConsulta: string;
  estado: EstadoCita;
}
