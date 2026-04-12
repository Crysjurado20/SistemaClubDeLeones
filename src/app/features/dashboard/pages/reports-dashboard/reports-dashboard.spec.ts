import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DashboardApiService, DashboardStatsResponse } from '../../services/dashboard-api.service';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard';

describe('AdminDashboardComponent', () => {
    let component: AdminDashboardComponent;
    let fixture: ComponentFixture<AdminDashboardComponent>;

    const dashboardResponse: DashboardStatsResponse = {
        citasPorEstado: [],
        especialidadesMasSolicitadas: [],
        ingresosMensuales: [],
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminDashboardComponent],
            providers: [
                {
                    provide: DashboardApiService,
                    useValue: {
                        getDashboardStats: () => of(dashboardResponse),
                        getDashboard: () => of(dashboardResponse),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
