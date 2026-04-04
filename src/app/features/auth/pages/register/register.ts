import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FluidModule } from 'primeng/fluid';
import { Header } from "../../../../shared/ui/header/header";

@Component({
    selector: 'app-register-form',
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    SelectModule,
    DatePickerModule,
    InputGroupModule,
    InputGroupAddonModule,
    FluidModule,
    Header
],
    templateUrl: './register.html'
})
export class Register {
    
    usuario = {
        cedula: '',
        primerNombre: '',
        segundoNombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        fechaNacimiento: null,
        genero: null,
        direccion: '',
        telefono: '',
        correo: '',
        terminos: false
    };

    opcionesGenero = [
        { name: 'Femenino', code: 'F' },
        { name: 'Masculino', code: 'M' },
        { name: 'Otro', code: 'O' }
    ];

    registrar() {
        console.log('Datos listos para enviar al backend:', this.usuario);
    }
}