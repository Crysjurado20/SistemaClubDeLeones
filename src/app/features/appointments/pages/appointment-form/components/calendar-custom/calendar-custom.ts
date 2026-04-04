import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-calendar-custom',
  standalone: true,
  imports: [CommonModule, ButtonModule, FieldsetModule],
  templateUrl: './calendar-custom.html'
})
export class CalendarCustomComponent {
    
    @Output() dateSelected = new EventEmitter<Date>();

    weekDayLabels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    availableBg = 'color-mix(in srgb, var(--primary-color), transparent 92%)';
    selectedBg = 'color-mix(in srgb, var(--primary-color), transparent 82%)';

    private viewMonth = this.startOfMonth(new Date());
    monthCells = this.buildMonthCells(this.viewMonth);
    selectedDate: Date | null = this.findFirstAvailableDate(this.monthCells);

    get monthLabel(): string {
        const formatted = new Intl.DateTimeFormat('es-EC', { month: 'long', year: 'numeric' }).format(this.viewMonth);
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }

    nextMonth(): void {
        this.viewMonth = this.startOfMonth(new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth() + 1, 1));
        this.monthCells = this.buildMonthCells(this.viewMonth);
        this.selectedDate = this.findFirstAvailableDate(this.monthCells);
    }

    prevMonth(): void {
        this.viewMonth = this.startOfMonth(new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth() - 1, 1));
        this.monthCells = this.buildMonthCells(this.viewMonth);
        this.selectedDate = this.findFirstAvailableDate(this.monthCells);
    }

    selectDateAndOpen(cell: { date: Date | null; available: boolean }): void {
        if (!cell.date || !cell.available) return;
        
        this.selectedDate = cell.date;
                this.dateSelected.emit(this.selectedDate);
    }

    isSelected(date: Date): boolean {
        if (!this.selectedDate) return false;
        return this.toYmd(date) === this.toYmd(this.selectedDate);
    }

    trackByCell = (_: number, item: { date: Date | null }): string => (item.date ? this.toYmd(item.date) : `empty-${_}`);

    private buildMonthCells(viewMonth: Date): Array<{ date: Date | null; available: boolean; slots: number }> {
        const first = this.startOfMonth(viewMonth);
        const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
        const firstDow = first.getDay();
        const leadingEmpty = (firstDow + 6) % 7;
        const cells: Array<{ date: Date | null; available: boolean; slots: number }> = [];

        for (let i = 0; i < leadingEmpty; i++) cells.push({ date: null, available: false, slots: 0 });
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(first.getFullYear(), first.getMonth(), day);
            const available = this.isDateAvailable(date);
            cells.push({ date, available, slots: available ? 14 : 0 });
        }
        while (cells.length % 7 !== 0) cells.push({ date: null, available: false, slots: 0 });
        while (cells.length < 42) cells.push({ date: null, available: false, slots: 0 });
        return cells;
    }

    private findFirstAvailableDate(cells: Array<{ date: Date | null; available: boolean }>): Date | null {
        for (const c of cells) {
            if (c.date && c.available) return c.date;
        }
        return null;
    }

    private isDateAvailable(date: Date): boolean {
        return this.isWeekday(date) && !this.isPast(date);
    }

    private isWeekday(date: Date): boolean {
        const dow = date.getDay();
        return dow >= 1 && dow <= 5;
    }

    private isPast(date: Date): boolean {
        const today = this.startOfDay(new Date());
        const candidate = this.startOfDay(date);
        return candidate.getTime() < today.getTime();
    }

    private startOfDay(date: Date): Date {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    private startOfMonth(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    private toYmd(date: Date): string {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
}