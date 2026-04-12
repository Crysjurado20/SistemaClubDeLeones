import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { Notfound } from './shared/ui/notfound/notfound';
import { AppLayout } from './shared/ui/layout/app.layout';
import { authChildGuard, authGuard } from './core/guards/auth.guard';

const ADMIN = 'ADMIN';
const MEDICO = 'MEDICO';
const PATIENT = 'PATIENT';

export const appRoutes: Routes = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' },

    { path: 'reports-dashboard', redirectTo: 'admin-dashboard', pathMatch: 'full' },

    {
        path: '',
        component: AppLayout,
        canActivateChild: [authChildGuard],
        children: [
            {
                path: 'admin-dashboard',
                loadComponent: () =>
                    import('./features/dashboard/pages/admin-dashboard/admin-dashboard').then(
                        (m) => m.AdminDashboardComponent,
                    ),
                data: { roles: [ADMIN] },
            },
            {
                path: 'doctors',
                loadComponent: () =>
                    import('./features/doctors/pages/doctors-crud/doctors-crud').then(
                        (m) => m.CrudDoctorsComponent,
                    ),
                data: { roles: [ADMIN] },
            },
            {
                path: 'patients',
                loadComponent: () =>
                    import('./features/patients/pages/crud-patients/crud-patients').then(
                        (m) => m.CrudPatientsComponent,
                    ),
                data: { roles: [ADMIN] },
            },
            {
                path: 'specialties',
                loadComponent: () =>
                    import('./features/specialties/pages/specialties-crud/specialties-crud').then(
                        (m) => m.CrudSpecialtiesComponent,
                    ),
                data: { roles: [ADMIN] },
            },
            {
                path: 'reports',
                loadComponent: () =>
                    import('./features/reports/pages/reports/reports').then((m) => m.ReportsComponent),
                data: { roles: [ADMIN] },
            },
        ],
    },
    {
        path: 'appointments',
        canActivate: [authGuard],
        data: { roles: [PATIENT] },
        loadComponent: () =>
            import('./features/appointments/pages/appointment-form/appointment-form').then(
                (m) => m.AppointmentsFormComponent,
            ),
    },

    {
        path: 'appointment-list',
        canActivate: [authGuard],
        data: { roles: [PATIENT] },
        loadComponent: () =>
            import('./features/appointments/pages/appointment-list/appointment-list').then(
                (m) => m.AppointmentListComponent,
            ),
    },
    {
        path: 'invoices-list',
        canActivate: [authGuard],
        data: { roles: [PATIENT] },
        loadComponent: () =>
            import('./features/invoices/pages/invoices-list/invoices-list').then(
                (m) => m.InvoicesListComponent,
            ),
    },
    {
        path: 'weekly-agenda',
        canActivate: [authGuard],
        data: { roles: [MEDICO] },
        loadComponent: () =>
            import('./features/agenda/pages/weekly-agenda/weekly-agenda').then(
                (m) => m.WeeklyAgendaComponent,
            ),
    },
    {
        path: 'agenda-config',
        canActivate: [authGuard],
        data: { roles: [MEDICO] },
        loadComponent: () =>
            import('./features/agenda/pages/agenda-config/agenda-config').then(
                (m) => m.AgendaConfigComponent,
            ),
    },
    {
        path: 'daily-appoiments-list',
        canActivate: [authGuard],
        data: { roles: [MEDICO] },
        loadComponent: () =>
            import('./features/agenda/pages/daily-appoiments-list/daily-appoiments-list').then(
                (m) => m.DailyAppoimentsListComponent,
            ),
    },
    {
        path: 'clinical-history-detail/:hcId',
        canActivate: [authGuard],
        data: { roles: [MEDICO] },
        loadComponent: () =>
            import('./features/clinical-history/pages/clinical-history-detail/clinical-history-detail').then(
                (m) => m.ClinicalHistoryDetailComponent,
            ),
    },
    {
        path: 'appointment-attention/:hcId',
        canActivate: [authGuard],
        data: { roles: [MEDICO] },
        loadComponent: () =>
            import('./features/agenda/pages/appointment-attention/appointment-attention').then(
                (m) => m.AppointmentAttentionComponent,
            ),
    },

    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.default),
    },

    { path: '**', redirectTo: '/notfound' },
];
