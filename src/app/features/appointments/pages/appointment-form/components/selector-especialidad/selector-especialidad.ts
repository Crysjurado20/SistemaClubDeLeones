import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule,RouterLink } from '@angular/router';
import { FieldsetModule } from 'primeng/fieldset';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { PatientApiService, PatientSpecialtyOption } from '../../../../../../core/services/patient-api.service';
import { LoadingOverlay } from '../../../../../../shared/ui/loading-overlay/loading-overlay';

export type Especialidad = PatientSpecialtyOption;

@Component({
    selector: 'app-selector-especialidad',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        FieldsetModule,
        InputGroupModule,
        InputGroupAddonModule,
        SelectModule,
        ButtonModule,
        LoadingOverlay,
        RouterLink
    ],
    templateUrl: './selector-especialidad.html',
})
export class SelectorEspecialidadComponent implements OnInit {
    @Input() busy = false;
    dropdownValues: Especialidad[] = [];
    
    dropdownValue: Especialidad | null = null;
    
    isLoading: boolean = false;

    @Output() specialtySelected = new EventEmitter<Especialidad>();

    private readonly patientApi = inject(PatientApiService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly messageService = inject(MessageService);

    ngOnInit(): void {
        this.isLoading = true;
        this.patientApi
            .getSpecialties()
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                    this.cdr.markForCheck();
                }),
            )
            .subscribe({
                next: (items) => {
                    this.dropdownValues = items ?? [];
                    this.cdr.markForCheck();
                },
                error: (err) => {
                    console.error('Error cargando especialidades:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'No se pudieron cargar especialidades',
                        detail: 'Intenta nuevamente en unos segundos.',
                    });
                },
            });
    }

    buscar() {
        if (!this.dropdownValue) {
            return;
        }

        this.specialtySelected.emit(this.dropdownValue);
    }
}