import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-footer',
  template: `<div class="layout-footer">
    Todos los derechos reservados © 2024. Diseñado por
    <a
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      class="text-primary font-bold hover:underline"
      >CLUB DE LEONES</a
    >
  </div>`,
})
export class AppFooter {}
