import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ChartData, ChartOptions } from 'chart.js';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { finalize } from 'rxjs';
import { LayoutService } from '../../../../shared/ui/layout/layout.service';
import {
    DashboardApiService,
    DashboardStatsResponse,
} from '../../services/dashboard-api.service';

type PieChartData = ChartData<'pie', number[], string>;
type BarChartData = ChartData<'bar', number[], string>;
type LineChartData = ChartData<'line', number[], string>;
type PieChartOptions = ChartOptions<'pie'>;
type BarChartOptions = ChartOptions<'bar'>;
type LineChartOptions = ChartOptions<'line'>;
type ChartColorPair = {
    background: string;
    hover: string;
};

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, ChartModule, ButtonModule, ProgressSpinnerModule],
    templateUrl: './admin-dashboard.html',
    styleUrl: './admin-dashboard.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
    private readonly dashboardApi = inject(DashboardApiService);
    readonly layoutService = inject(LayoutService);

    private readonly stateColorMap: Record<string, ChartColorPair> = {
        Atendida: {
            background: '#16a34a',
            hover: '#22c55e',
        },
        Cancelada: {
            background: '#dc2626',
            hover: '#ef4444',
        },
        NoAsistio: {
            background: '#7c3aed',
            hover: '#8b5cf6',
        },
        Confirmada: {
            background: '#2563eb',
            hover: '#3b82f6',
        },
        Pendiente: {
            background: '#60a5fa',
            hover: '#93c5fd',
        },
        PendientePago: {
            background: '#0ea5e9',
            hover: '#38bdf8',
        },
        Ocupada: {
            background: '#f59e0b',
            hover: '#fbbf24',
        },
        Bloqueada: {
            background: '#64748b',
            hover: '#94a3b8',
        },
    };

    readonly stats = signal<DashboardStatsResponse | null>(null);
    readonly loading = signal(true);
    readonly error = signal<string | null>(null);

    readonly pieData = signal<PieChartData>(this.createEmptyPieData());
    readonly barData = signal<BarChartData>(this.createEmptyBarData());
    readonly lineData = signal<LineChartData>(this.createEmptyLineData());

    readonly pieOptions = signal<PieChartOptions>(this.createDefaultPieOptions());
    readonly barOptions = signal<BarChartOptions>(this.createDefaultBarOptions());
    readonly lineOptions = signal<LineChartOptions>(this.createDefaultLineOptions());

    readonly totalAppointments = computed(() =>
        this.stats()?.citasPorEstado.reduce((sum, item) => sum + (item.cantidad ?? 0), 0) ?? 0,
    );

    readonly totalIncome = computed(() =>
        this.stats()?.ingresosMensuales.reduce((sum, item) => sum + (item.monto ?? 0), 0) ?? 0,
    );

    readonly topSpecialty = computed(() => this.stats()?.especialidadesMasSolicitadas[0] ?? null);

    readonly peakIncomeMonth = computed(() => {
        const months = this.stats()?.ingresosMensuales ?? [];
        if (!months.length) {
            return null;
        }

        return months.reduce((best, current) => (current.monto > best.monto ? current : best));
    });

    readonly pieSummary = computed(() =>
        (this.stats()?.citasPorEstado ?? [])
            .map((item) => `${item.etiqueta}: ${item.cantidad}`)
            .join('. '),
    );

    readonly specialtySummary = computed(() =>
        (this.stats()?.especialidadesMasSolicitadas ?? [])
            .map((item) => `${item.nombre}: ${item.cantidad}`)
            .join('. '),
    );

    readonly incomeSummary = computed(() =>
        (this.stats()?.ingresosMensuales ?? [])
            .map((item) => `${item.etiqueta}: ${this.formatCurrency(item.monto)}`)
            .join('. '),
    );

    readonly pieSummaryId = 'admin-dashboard-pie-summary';
    readonly barSummaryId = 'admin-dashboard-bar-summary';
    readonly lineSummaryId = 'admin-dashboard-line-summary';

    private readonly currencyFormatter = new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    });

    private dashboardLoaded = false;

    private readonly rebuildChartsEffect = effect(() => {
        this.layoutService.isDarkTheme();
        this.stats();
        this.rebuildCharts();
    });

    constructor() {
        this.loadDashboard();
    }

    reload(): void {
        this.dashboardLoaded = false;
        this.loadDashboard();
    }

    private loadDashboard(): void {
        if (this.dashboardLoaded) {
            return;
        }

        this.dashboardLoaded = true;
        this.loading.set(true);
        this.error.set(null);

        this.dashboardApi
            .getDashboardStats()
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: (response) => {
                    this.stats.set(response);
                },
                error: (err: unknown) => {
                    this.stats.set(null);
                    this.error.set(this.resolveErrorMessage(err));
                },
            });
    }

    private rebuildCharts(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = this.readStyleValue(documentStyle, '--text-color', '#1f2937');
        const textColorSecondary = this.readStyleValue(documentStyle, '--text-color-secondary', '#64748b');
        const surfaceBorder = this.readStyleValue(documentStyle, '--surface-border', '#dbe4f0');
        const incomeColor = '#2563eb';

        const stateItems = this.stats()?.citasPorEstado ?? [];
        const specialtyItems = this.stats()?.especialidadesMasSolicitadas ?? [];
        const incomeItems = this.stats()?.ingresosMensuales ?? [];

        const stateLabels = stateItems.map((item) => item.etiqueta);
        const stateValues = stateItems.map((item) => item.cantidad);
        const statePalette = stateItems.map((item) => this.resolveStatePalette(item.codigo));
        const stateTotal = stateValues.reduce((sum, value) => sum + value, 0);

        this.pieData.set({
            labels: stateLabels,
            datasets: [
                {
                    data: stateValues,
                    backgroundColor: statePalette.map((item) => item.background),
                    hoverBackgroundColor: statePalette.map((item) => item.hover),
                    borderWidth: 0,
                },
            ],
        });

        this.pieOptions.set({
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        color: textColor,
                    },
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label ?? '';
                            const value = Number(context.parsed ?? 0);
                            const percentage = stateTotal > 0 ? Math.round((value / stateTotal) * 100) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        },
                    },
                },
            },
        });

        const specialtyLabels = specialtyItems.map((item) => item.nombre);
        const specialtyValues = specialtyItems.map((item) => item.cantidad);
        const specialtyPalette = this.buildPalette(
            ['#0f766e', '#2563eb', '#7c3aed', '#f59e0b', '#ef4444'],
            specialtyItems.length,
        );

        this.barData.set({
            labels: specialtyLabels,
            datasets: [
                {
                    label: 'Solicitudes',
                    data: specialtyValues,
                    backgroundColor: specialtyPalette,
                    borderRadius: 12,
                    borderSkipped: false,
                    barThickness: 18,
                },
            ],
        });

        this.barOptions.set({
            maintainAspectRatio: false,
            responsive: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary,
                        precision: 0,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        display: false,
                    },
                },
            },
        });

        const incomeLabels = incomeItems.map((item) => item.etiqueta);
        const incomeValues = incomeItems.map((item) => item.monto);

        this.lineData.set({
            labels: incomeLabels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: incomeValues,
                    fill: true,
                    tension: 0.36,
                    borderColor: incomeColor,
                    backgroundColor: 'rgba(37, 99, 235, 0.14)',
                    pointBorderColor: incomeColor,
                    pointBackgroundColor: incomeColor,
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: incomeColor,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderWidth: 2.5,
                },
            ],
        });

        this.lineOptions.set({
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                    },
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const value = Number(context.parsed?.y ?? 0);
                            return `${context.dataset.label ?? 'Ingresos'}: ${this.formatCurrency(value)}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary,
                        callback: (value) => this.formatCurrency(Number(value)),
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
            },
        });
    }

    private formatCurrency(value: number): string {
        return this.currencyFormatter.format(value ?? 0);
    }

    private buildPalette(palette: string[], size: number): string[] {
        if (!size) {
            return [];
        }

        return Array.from({ length: size }, (_, index) => palette[index % palette.length]);
    }

    private resolveStatePalette(code: string): ChartColorPair {
        return this.stateColorMap[code] ?? {
            background: '#2563eb',
            hover: '#3b82f6',
        };
    }

    private createEmptyPieData(): PieChartData {
        return { labels: [], datasets: [] };
    }

    private createEmptyBarData(): BarChartData {
        return { labels: [], datasets: [] };
    }

    private createEmptyLineData(): LineChartData {
        return { labels: [], datasets: [] };
    }

    private createDefaultPieOptions(): PieChartOptions {
        return {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
        };
    }

    private createDefaultBarOptions(): BarChartOptions {
        return {
            maintainAspectRatio: false,
            responsive: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false,
                },
            },
        };
    }

    private createDefaultLineOptions(): LineChartOptions {
        return {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
            },
        };
    }

    private readStyleValue(style: CSSStyleDeclaration, property: string, fallback: string): string {
        const value = style.getPropertyValue(property).trim();
        return value || fallback;
    }

    private resolveErrorMessage(error: unknown): string {
        if (error instanceof HttpErrorResponse) {
            const payload = error.error as { mensaje?: unknown; message?: unknown } | string | null;

            if (typeof payload === 'string' && payload.trim()) {
                return payload.trim();
            }

            if (payload && typeof payload === 'object') {
                const serverMessage =
                    (typeof payload.mensaje === 'string' && payload.mensaje.trim()) ||
                    (typeof payload.message === 'string' && payload.message.trim()) ||
                    '';

                if (serverMessage) {
                    return serverMessage;
                }
            }

            return error.message || 'No se pudo cargar el panel administrativo.';
        }

        if (error instanceof Error && error.message.trim()) {
            return error.message;
        }

        return 'No se pudo cargar el panel administrativo.';
    }
}