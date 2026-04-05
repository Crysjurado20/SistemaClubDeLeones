import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { finalize, forkJoin, map } from 'rxjs';
import { PatientApiService } from '../../../../../../core/services/patient-api.service';

@Component({
  selector: 'app-calendar-custom',
  standalone: true,
  imports: [CommonModule, ButtonModule, FieldsetModule],
  templateUrl: './calendar-custom.html'
})
export class CalendarCustomComponent implements OnChanges {

    @Input() specialtyId: number | null = null;
    @Output() loadingChange = new EventEmitter<boolean>();
    
    @Output() dateSelected = new EventEmitter<Date>();

    weekDayLabels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    availableBg = 'color-mix(in srgb, var(--primary-color), transparent 92%)';
    selectedBg = 'color-mix(in srgb, var(--primary-color), transparent 82%)';

    private viewMonth = this.startOfMonth(new Date());
    monthCells = this.buildMonthCells(this.viewMonth);
    selectedDate: Date | null = this.findFirstAvailableDate(this.monthCells);

    private readonly patientApi = inject(PatientApiService);
    private readonly cdr = inject(ChangeDetectorRef);

    private readonly monthCache = new Map<string, Map<string, number>>();
    private loading = false;

    get todayColumnIndex(): number {
        const dow = new Date().getDay();
        return dow === 0 ? 6 : dow - 1; // Lunes=0 ... Domingo=6
    }

    get monthLabel(): string {
        const formatted = new Intl.DateTimeFormat('es-EC', { month: 'long', year: 'numeric' }).format(this.viewMonth);
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }

    nextMonth(): void {
        this.viewMonth = this.startOfMonth(new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth() + 1, 1));
        this.monthCells = this.buildMonthCells(this.viewMonth);
        this.selectedDate = this.findFirstAvailableDate(this.monthCells);

        this.loadMonthAvailability();
    }

    prevMonth(): void {
        this.viewMonth = this.startOfMonth(new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth() - 1, 1));
        this.monthCells = this.buildMonthCells(this.viewMonth);
        this.selectedDate = this.findFirstAvailableDate(this.monthCells);

        this.loadMonthAvailability();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['specialtyId']) {
            this.monthCells = this.buildMonthCells(this.viewMonth);
            this.selectedDate = this.findFirstAvailableDate(this.monthCells);
            this.loadMonthAvailability();
        }
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

    isToday(date: Date): boolean {
        return this.toYmd(date) === this.toYmd(new Date());
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
            cells.push({ date, available: false, slots: 0 });
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
        // La disponibilidad real la determina el backend (horarios/bloqueos del médico).
        // Aquí solo evitamos fechas pasadas.
        return !this.isPast(date);
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

    private setLoading(value: boolean): void {
        if (this.loading === value) return;
        this.loading = value;
        this.loadingChange.emit(value);
        this.cdr.markForCheck();
    }

    private getMonthKey(): string {
        const y = this.viewMonth.getFullYear();
        const m = String(this.viewMonth.getMonth() + 1).padStart(2, '0');
        const id = this.specialtyId ?? 'none';
        return `${id}-${y}-${m}`;
    }

    private loadMonthAvailability(): void {
        if (!this.specialtyId) {
            this.setLoading(false);
            this.applySlotsFromMap(new Map());
            return;
        }

        const monthKey = this.getMonthKey();
        const cached = this.monthCache.get(monthKey);
        if (cached) {
            this.applySlotsFromMap(cached);
            return;
        }

        const idEspecialidad = this.specialtyId;
        const dates = this.monthCells
            .filter((c) => !!c.date)
            .map((c) => c.date as Date)
            .filter((d) => this.isDateAvailable(d));

        if (dates.length === 0) {
            this.setLoading(false);
            return;
        }

        this.setLoading(true);

        const requests = dates.map((d) => {
            const ymd = this.toYmd(d);
            return this.patientApi.getAvailability(idEspecialidad, ymd).pipe(
                map((items) => {
                    const slots = this.countAvailableSlots(items ?? []);
                    return { ymd, slots };
                }),
            );
        });

        if (requests.length === 0) {
            const map = new Map<string, number>();
            this.monthCache.set(monthKey, map);
            this.applySlotsFromMap(map);
            this.setLoading(false);
            return;
        }

        forkJoin(requests).pipe(
            finalize(() => this.setLoading(false)),
        ).subscribe({
            next: (pairs: any) => {
                const map = new Map<string, number>();
                for (const p of pairs as Array<{ ymd: string; slots: number }>) map.set(p.ymd, p.slots);
                this.monthCache.set(monthKey, map);
                this.applySlotsFromMap(map);
            },
            error: (err) => {
                console.error('Error cargando disponibilidad del mes:', err);
                this.cdr.markForCheck();
            },
        });
    }

    private applySlotsFromMap(map: Map<string, number>): void {
        this.monthCells = this.monthCells.map((c) => {
            if (!c.date) return c;
            if (!this.isDateAvailable(c.date)) return { ...c, slots: 0, available: false };

            const slots = map.get(this.toYmd(c.date)) ?? 0;
            return { ...c, slots, available: slots > 0 };
        });

        this.selectedDate = this.findFirstAvailableDate(this.monthCells);
        this.cdr.markForCheck();
    }

    private countAvailableSlots(items: Array<{ horarios?: Array<{ estado?: string }> }>): number {
        let total = 0;
        for (const medico of items) {
            const horarios = medico.horarios ?? [];
            for (const h of horarios) {
                if ((h.estado ?? '').toString().toLowerCase() === 'disponible') total++;
            }
        }
        return total;
    }
}