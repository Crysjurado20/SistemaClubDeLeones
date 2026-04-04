import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  services = [
    { name: 'Emergencias', icon: 'img/iconosServices/Emergencia.png' },
    { name: 'Consulta externa', icon: 'img/iconosServices/Consulta%20externa.png' },
    { name: 'Especialidades odontológicas', icon: 'img/iconosServices/Centro%20Odontologico.png' },
    { name: 'Óptica', icon: 'img/iconosServices/Optica.png' },
    { name: 'Farmacia', icon: 'img/iconosServices/Farmacia.png' },
    { name: 'Laboratorio', icon: 'img/iconosServices/Laboratorio.png' },
    { name: 'Rayos X', icon: 'img/iconosServices/Rayos%20X.png' },
    { name: 'Ecos', icon: 'img/iconosServices/Ecos.png' },
    { name: 'Centro Quirúrgico', icon: 'img/iconosServices/Centro%20Quir%C3%BArgico.png' },
    { name: 'Rehabilitación', icon: 'img/iconosServices/Rehabilitacion.png' },
    { name: 'Hospitalización', icon: 'img/iconosServices/Hospitalizacion.png' },
    { name: 'Materno Infantil', icon: 'img/iconosServices/Materno%20Infantil.png' },
  ];
}
