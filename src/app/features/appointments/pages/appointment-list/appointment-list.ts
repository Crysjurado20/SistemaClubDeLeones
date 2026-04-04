import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { Header } from "../../../../shared/ui/header/header";
import { AuthService } from '../../../../core/services/auth.service';

export interface CitaMedica {
    id: string;
    cedula: string;
    medico: string;
    especialidad: string;
    fecha: string;
    hora: string;
    unidadMedica: string;
    ubicacion: string;
}

@Component({
    selector: 'app-appointment-list',
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    AvatarModule,
    TooltipModule,
    Header
],
    templateUrl: './appointment-list.html',
    styleUrl: './appointment-list.scss'
})
export class AppointmentListComponent implements OnInit {
    nombrePaciente: string = 'Juan López';
    citas: CitaMedica[] = [];
    loading: boolean = true;

    get headerUserLabel(): string {
        return this.authService.getDisplayLabel();
    }

    @ViewChild('filter') filter!: ElementRef;

    constructor(private readonly authService: AuthService) {}

    ngOnInit() {
            this.citas = [
                { id: '1', cedula: '1804567890', medico: 'Dr. Vasconez Yepez Luis', especialidad: 'Cardiología', fecha: '2026-03-25', hora: '14:00', unidadMedica: 'Hospital Club de Leones', ubicacion: 'Av. Atahualpa y Av. Víctor Hugo' },
                { id: '2', cedula: '1804567890', medico: 'Dra. Astudillo Silva Marcia', especialidad: 'Cirugía Maxilofacial', fecha: '2026-04-02', hora: '08:30', unidadMedica: 'Clínica de Especialidades', ubicacion: 'Calle Sucre y Montalvo' }
            ];
            this.loading = false;
        }
    

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }
}