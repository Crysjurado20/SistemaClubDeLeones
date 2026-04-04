export type EstadoTurno = 'pendiente' | 'atendido' | 'ocupado' | 'bloqueado';

export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  hc: string;
}

export interface Turno {
  id: number;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  duracionMin: number;
  estado: EstadoTurno;
  paciente?: Paciente;
  motivo?: string;
  tipo: 'consulta' | 'seguimiento' | 'primera_vez' | 'bloqueado';
  notas?: string;
}

export interface HorarioDia {
  dia: string;
  diaCodigo: number; // 0=dom, 1=lun...6=sab
  activo: boolean;
  horaInicio: string;
  horaFin: string;
}

export interface BloqueoFecha {
  fecha: Date;
  motivo: 'vacaciones' | 'permiso_medico' | 'capacitacion' | 'reunion' | 'otro';
  descripcion?: string;
}

export interface Docente {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  especialidad: string;
  activo: boolean;
  horarios: HorarioDia[];
  bloqueosCalendario: BloqueoFecha[];
}
