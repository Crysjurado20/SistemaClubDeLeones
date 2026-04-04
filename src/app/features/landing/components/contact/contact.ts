import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  selector: 'app-contact',
  imports: [ButtonModule, InputTextModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {}
