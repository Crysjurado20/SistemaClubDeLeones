import { Component } from '@angular/core';
import { Topbar } from './components/topbar/topbar';
import { Hero } from './components/hero/hero';
import { Services } from './components/services/services';
import { Contact } from './components/contact/contact';
import { Footer } from './components/footer/footer';
import { About } from "./components/about/about";

@Component({
  selector: 'app-landing',
  imports: [Topbar, Hero, Services, About, Contact, Footer],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {}
