export type EstadoCita = 'atendido' | 'pendiente' | 'pendiente_pago' | 'ocupado' | 'bloqueado' | 'cancelado';

export interface DailyAppointment {
  idCita: number;
  idPaciente: number;
  historiaClinica: string;
  cedula: string;
  apellidos: string;
  nombres: string;
  especialidad: string;
  tipoConsulta: string;
  horaInicio: string;
  horaFin: string;
  estado: EstadoCita;
}
