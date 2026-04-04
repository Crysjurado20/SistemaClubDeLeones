import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule,RouterLink } from '@angular/router';
import { FieldsetModule } from 'primeng/fieldset';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

export interface Especialidad {
    name: string;
    code: string;
}

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
        RouterLink
    ],
    templateUrl: './selector-especialidad.html',
})
export class SelectorEspecialidadComponent {
    dropdownValues: Especialidad[] = [
        { name: 'Cirugía Maxilofacial', code: 'CM' },
        { name: 'Cardiología', code: 'CA' },
        { name: 'Odontología General', code: 'OD' }
    ];
    
    dropdownValue: Especialidad | null = null;
    
    isLoading: boolean = false;

    @Output() onSearch = new EventEmitter<Especialidad>();

    buscar() {
        if (!this.dropdownValue) {
            return;
        }

        this.isLoading = true;
        
        setTimeout(() => {
            this.isLoading = false;
            this.onSearch.emit(this.dropdownValue!);
        }, 800);
    }
}