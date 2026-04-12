import { Routes } from '@angular/router';
import { Access } from './pages/access/access';
import { Error } from './pages/error/error';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ResetPassword } from './pages/reset-password/reset-password';

export default [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'olvide-mi-contrasena', component: ForgotPassword },
    { path: 'recuperar-contrasena', component: ResetPassword },
    { path: 'login', component: Login },
    { path: 'register', component: Register }
] as Routes;
