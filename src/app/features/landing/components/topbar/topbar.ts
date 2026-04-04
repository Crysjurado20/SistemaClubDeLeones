import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule],
    templateUrl: './topbar.html',
    styleUrl: './topbar.scss'
})
export class Topbar {
    constructor(public router: Router) {}
}