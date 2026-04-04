import { Routes } from '@angular/router';
import { Access } from './pages/access/access';
import { Error } from './pages/error/error';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export default [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'register', component: Register}
] as Routes;
