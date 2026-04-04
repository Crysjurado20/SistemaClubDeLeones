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
  pieData = signal<any>(null);
  doughnutData = signal<any>(null);

  barOptions = signal<any>(null);
  lineOptions = signal<any>(null);
  pieOptions = signal<any>(null);

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
    const incomeBySpecialty = charts?.incomeBySpecialty ?? [];
    const appointmentsByMonth = charts?.appointmentsByMonth ?? [];
    const patientsByGender = charts?.patientsByGender ?? [];
    const billingStatus = charts?.billingStatus ?? [];

    this.barData.set({
      labels: incomeBySpecialty.map((x) => x.label),
      datasets: [
        {
          label: 'Ingresos Mensuales',
          backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
          borderColor: documentStyle.getPropertyValue('--p-primary-500'),
          data: incomeBySpecialty.map((x) => x.value),
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
          label: 'Citas Atendidas',
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

    this.pieData.set({
      labels: patientsByGender.map((x) => x.label),
      datasets: [
        {
          data: patientsByGender.map((x) => x.value),
          backgroundColor: [
            documentStyle.getPropertyValue('--p-pink-500'),
            documentStyle.getPropertyValue('--p-blue-500'),
            documentStyle.getPropertyValue('--p-gray-500'),
            documentStyle.getPropertyValue('--p-green-500'),
            documentStyle.getPropertyValue('--p-orange-500'),
          ].slice(0, Math.max(patientsByGender.length, 1)),
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--p-pink-400'),
            documentStyle.getPropertyValue('--p-blue-400'),
            documentStyle.getPropertyValue('--p-gray-400'),
            documentStyle.getPropertyValue('--p-green-400'),
            documentStyle.getPropertyValue('--p-orange-400'),
          ].slice(0, Math.max(patientsByGender.length, 1)),
        },
      ],
    });

    this.doughnutData.set({
      labels: billingStatus.map((x) => x.label),
      datasets: [
        {
          data: billingStatus.map((x) => x.value),
          backgroundColor: [
            documentStyle.getPropertyValue('--p-green-500'),
            documentStyle.getPropertyValue('--p-orange-500'),
            documentStyle.getPropertyValue('--p-red-500'),
            documentStyle.getPropertyValue('--p-blue-500'),
            documentStyle.getPropertyValue('--p-gray-500'),
          ].slice(0, Math.max(billingStatus.length, 1)),
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--p-green-400'),
            documentStyle.getPropertyValue('--p-orange-400'),
            documentStyle.getPropertyValue('--p-red-400'),
            documentStyle.getPropertyValue('--p-blue-400'),
            documentStyle.getPropertyValue('--p-gray-400'),
          ].slice(0, Math.max(billingStatus.length, 1)),
        },
      ],
    });

    this.pieOptions.set({
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, color: textColor },
        },
      },
    });
  }
}
