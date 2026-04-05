export type MotivoBloqueoAgenda = 'vacaciones' | 'fuera';

export type DiaKey = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';

export interface AgendaHorarioDiaConfig {
  key: DiaKey;
  label: string;
  activo: boolean;
  inicio: string | null; // HH:mm
  fin: string | null; // HH:mm

	duracionTurnoMinutos?: 15 | 30 | 60;
	turnosActivos?: string[]; // HH:mm
}

export interface AgendaConfigState {
  horarioSemana: AgendaHorarioDiaConfig[];
  bloqueos: Record<string, string>; // yyyy-mm-dd -> motivo (puede ser "tipo|detalle" o texto libre)
}
