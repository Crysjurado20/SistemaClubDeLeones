import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';
import { LayoutService } from '../../../../shared/ui/layout/layout.service';
import {
  DashboardApiService,
  DashboardCharts,
  DashboardKpis,
} from '../../services/dashboard-api.service';

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, FluidModule],
  templateUrl: './reports-dashboard.html',
})
export class ReportsComponent {
  layoutService = inject(LayoutService);
  private readonly dashboardApi = inject(DashboardApiService);

  isDarkTheme = signal(false);

  kpis = signal<DashboardKpis | null>(null);
  charts = signal<DashboardCharts | null>(null);
  private dashboardLoaded = false;

  barData = signal<any>(null);
  lineData = signal<any>(null);
  doughnutData = signal<any>(null);

  barOptions = signal<any>(null);
  lineOptions = signal<any>(null);
  doughnutOptions = signal<any>(null);

  chartEffect = effect(() => {
    this.isDarkTheme.set(this.layoutService.layoutConfig().darkTheme);
    setTimeout(() => this.initCharts(), 150);
  });

  constructor() {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    if (this.dashboardLoaded) return;
    this.dashboardLoaded = true;

    this.dashboardApi.getDashboard().subscribe({
      next: (res) => {
        this.kpis.set(res?.kpis ?? null);
        this.charts.set(res?.charts ?? null);
        this.initCharts();
      },
      error: () => {
        this.kpis.set(null);
        this.charts.set(null);
        this.initCharts();
      },
    });
  }

  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    const charts = this.charts();
    const appointmentsByMonth = charts?.appointmentsByMonth ?? [];
    const busiestDoctors = charts?.busiestDoctors ?? [];
    const patientsByAgeGroup = charts?.patientsByAgeGroup ?? [];

    this.barData.set({
      labels: busiestDoctors.map((x) => x.label),
      datasets: [
        {
          label: 'Citas del mes',
          backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
          borderColor: documentStyle.getPropertyValue('--p-primary-500'),
          data: busiestDoctors.map((x) => x.value),
        },
      ],
    });

    this.barOptions.set({
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: textColorSecondary, font: { weight: 500 } },
          grid: { display: false, drawBorder: false },
        },
        y: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false },
        },
      },
    });

    this.lineData.set({
      labels: appointmentsByMonth.map((x) => x.label),
      datasets: [
        {
          label: 'Citas',
          data: appointmentsByMonth.map((x) => x.value),
          fill: true,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: documentStyle.getPropertyValue('--p-blue-500'),
          tension: 0.4,
        },
      ],
    });

    this.lineOptions.set({
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false },
        },
        y: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false },
        },
      },
    });

    this.doughnutData.set({
      labels: patientsByAgeGroup.map((x) => x.label),
      datasets: [
        {
          data: patientsByAgeGroup.map((x) => x.value),
          backgroundColor: [
            documentStyle.getPropertyValue('--p-green-500'),
            documentStyle.getPropertyValue('--p-orange-500'),
            documentStyle.getPropertyValue('--p-red-500'),
            documentStyle.getPropertyValue('--p-blue-500'),
            documentStyle.getPropertyValue('--p-gray-500'),
          ].slice(0, Math.max(patientsByAgeGroup.length, 1)),
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--p-green-400'),
            documentStyle.getPropertyValue('--p-orange-400'),
            documentStyle.getPropertyValue('--p-red-400'),
            documentStyle.getPropertyValue('--p-blue-400'),
            documentStyle.getPropertyValue('--p-gray-400'),
          ].slice(0, Math.max(patientsByAgeGroup.length, 1)),
        },
      ],
    });

    const donutTotal = patientsByAgeGroup.reduce((acc, x) => acc + (x?.value ?? 0), 0);

    this.doughnutOptions.set({
      cutout: '62%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, color: textColor },
        },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const label = ctx?.label ?? '';
              const value = Number(ctx?.parsed ?? 0);
              const pct = donutTotal > 0 ? Math.round((value / donutTotal) * 100) : 0;
              return `${label}: ${value} (${pct}%)`;
            },
          },
        },
      },
    });
  }

  get topDoctor(): { label: string; value: number } | null {
    const items = this.charts()?.busiestDoctors ?? [];
    return items.length ? items[0] : null;
  }
}
