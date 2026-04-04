export type MotivoBloqueoAgenda = 'vacaciones' | 'fuera';

export type DiaKey = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';

export interface AgendaHorarioDiaConfig {
  key: DiaKey;
  label: string;
  activo: boolean;
  inicio: string | null; // HH:mm
  fin: string | null; // HH:mm
}

export interface AgendaConfigState {
  horarioSemana: AgendaHorarioDiaConfig[];
  bloqueos: Record<string, MotivoBloqueoAgenda>; // yyyy-mm-dd -> motivo
}
