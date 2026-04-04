import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

const TOKEN_KEYS = ['access_token', 'token', 'jwt', 'auth_token'];

function getTokenFromStorage(): string | null {
  for (const key of TOKEN_KEYS) {
    const raw = localStorage.getItem(key)?.trim();
    if (raw) return raw;
  }
  return null;
}

function shouldSkipAuthHeader(req: HttpRequest<unknown>): boolean {
  if (req.url.includes('/assets/') || req.url.includes('/img/')) return true;
  if (req.headers.has('Authorization')) return true;
  return false;
}

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const token = getTokenFromStorage();

  const request =
    token && !shouldSkipAuthHeader(req)
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(request).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          for (const key of TOKEN_KEYS) localStorage.removeItem(key);
          void router.navigate(['/auth/login']);
        }

        if (err.status === 403) {
          void router.navigate(['/auth/access']);
        }
      }

      return throwError(() => err);
    }),
  );
};
