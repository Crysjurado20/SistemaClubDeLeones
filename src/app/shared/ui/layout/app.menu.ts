import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `<ul class="layout-menu">
    @for (item of model; track item.label) {
      @if (!item.separator) {
        <li app-menuitem [item]="item" [root]="true"></li>
      } @else {
        <li class="menu-separator"></li>
      }
    }
  </ul> `,
})
export class AppMenu implements OnInit {
  model: MenuItem[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'Inicio',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/reports-dashboard'] }],
      },
      {
        label: 'Gestión Médica',
        icon: 'pi pi-fw pi-briefcase',
        items: [
          {
            label: 'Especialidades',
            icon: 'pi pi-fw pi-sitemap',
            routerLink: ['/specialties'],
          },
          {
            label: 'Doctores',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: ['/doctors'],
          },
          {
            label: 'Pacientes',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/patients'],
          },
        ],
      },
      {
        label: 'Administración',
        items: [  
          {
            label: 'Reportes',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: ['/reports'],
          },
        ],
      },
    ];
  }
}
