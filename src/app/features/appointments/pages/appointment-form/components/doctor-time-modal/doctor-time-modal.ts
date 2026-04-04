import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

export type AppointmentCheckoutData = {
	doctor: any;
	timeSlot: any;
	specialty: string;
	formattedDate: string;
};

@Component({
  selector: 'app-doctor-time-modal',
  imports: [CommonModule, ButtonModule, DialogModule],
  templateUrl: './doctor-time-modal.html',
  styleUrl: './doctor-time-modal.scss',
})
export class DoctorTimeModal implements OnChanges {

  constructor() {}

	@Input() medicos: any[] = [];
	@Input() specialtyName: string | null = null;
	@Input() selectedDate: Date | null = null;
	@Input() visible = false;
	@Output() visibleChange = new EventEmitter<boolean>();

	internalVisible = false;

	@Output() confirmRequested = new EventEmitter<AppointmentCheckoutData>();

	citaSeleccionada: { medico: any; turno: any; fecha: Date | null } | null = null;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['visible']) {
			this.internalVisible = this.visible;
			if (!this.visible) this.limpiarSeleccion();
		}
	}

	getClaseTurno(turno: any): string {
		if (turno?.seleccionado) {
			return 'bg-green-700 text-white border-green-800 shadow-sm';
		}
		switch (turno?.estado) {
			case 'disponible':
				return 'bg-[#b3d4f0] text-blue-900 border-blue-300 hover:bg-blue-300 hover:text-blue-900 cursor-pointer';
			case 'ocupado':
				return 'bg-orange-50 text-orange-800 border-orange-200 opacity-80';
			case 'bloqueado':
				return 'bg-red-500 text-white border-red-600 opacity-80';
			case 'no_disponible':
				return 'bg-surface-200 text-surface-500 border-surface-300 opacity-70';
			default:
				return 'bg-surface-100 text-surface-600 border-surface-200';
		}
	}

	getDiaSemana(): string {
		if (!this.selectedDate) return '—';
		const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
		return dias[this.selectedDate.getDay()];
	}

	marcarSeleccion(medicoSeleccionado: any, turnoSeleccionado: any) {
		this.limpiarSeleccion();
		turnoSeleccionado.seleccionado = true;
		this.citaSeleccionada = {
			medico: medicoSeleccionado,
			turno: turnoSeleccionado,
			fecha: this.selectedDate
		};
	}

	limpiarSeleccion() {
		this.medicos?.forEach((m) => m?.horarios?.forEach((h: any) => (h.seleccionado = false)));
		this.citaSeleccionada = null;
	}

	close() {
		this.internalVisible = false;
		this.visibleChange.emit(false);
		this.limpiarSeleccion();
	}

	handleHide() {
		this.internalVisible = false;
		this.visibleChange.emit(false);
		this.limpiarSeleccion();
	}

	confirm() {
		const payload = this.buildCheckoutData();
		if (!payload) return;
		this.confirmRequested.emit(payload);
	}

	private buildCheckoutData(): AppointmentCheckoutData | null {
		if (!this.citaSeleccionada) return null;

		const dateStr = this.selectedDate
			? this.selectedDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
			: '';

		return {
			doctor: this.citaSeleccionada.medico,
			timeSlot: this.citaSeleccionada.turno,
			specialty: this.specialtyName || 'CIRUGÍA MAXILO FACIAL',
			formattedDate: `${this.getDiaSemana()} ${dateStr}`.trim()
		};
	}

}
