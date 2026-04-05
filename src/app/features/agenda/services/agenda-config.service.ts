import { Injectable, signal } from '@angular/core';

import { AgendaConfigState, AgendaHorarioDiaConfig } from '../models/agenda-config.model';

const STORAGE_KEY = 'agenda-config-v1';

@Injectable({
  providedIn: 'root',
})
export class AgendaConfigService {
  readonly state = signal<AgendaConfigState>(this.load());

  save(next: AgendaConfigState): void {
    this.state.set(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  updateHorarioSemana(horarioSemana: AgendaHorarioDiaConfig[]): void {
    const current = this.state();
    this.save({ ...current, horarioSemana: horarioSemana.map((d) => ({ ...d })) });
  }

  setBloqueo(dateKey: string, motivo: string): void {
    const current = this.state();
    this.save({ ...current, bloqueos: { ...current.bloqueos, [dateKey]: motivo } });
  }

  isDateBlocked(date: Date): boolean {
    const key = this.toDateKey(date);
    return !!this.state().bloqueos[key];
  }

  getBloqueoMotivo(date: Date): string | null {
    const key = this.toDateKey(date);
    return this.state().bloqueos[key] ?? null;
  }

  dateKey(date: Date): string {
    return this.toDateKey(date);
  }

  private load(): AgendaConfigState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.getDefault();

      const parsed = JSON.parse(raw) as AgendaConfigState;
      if (!parsed?.horarioSemana?.length) return this.getDefault();
      return {
        horarioSemana: parsed.horarioSemana.map((d) => ({ ...d })),
        bloqueos: parsed.bloqueos ?? {},
      };
    } catch {
      return this.getDefault();
    }
  }

  private getDefault(): AgendaConfigState {
    return {
      horarioSemana: [
        { key: 'lun', label: 'Lun', activo: true, inicio: '08:00', fin: '14:00' },
        { key: 'mar', label: 'Mar', activo: true, inicio: '09:00', fin: '13:00' },
        { key: 'mie', label: 'Mié', activo: true, inicio: '08:00', fin: '15:00' },
        { key: 'jue', label: 'Jue', activo: true, inicio: '08:00', fin: '12:00' },
        { key: 'vie', label: 'Vie', activo: false, inicio: null, fin: null },
        { key: 'sab', label: 'Sáb', activo: false, inicio: null, fin: null },
      ],
      bloqueos: {},
    };
  }

  private toDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
