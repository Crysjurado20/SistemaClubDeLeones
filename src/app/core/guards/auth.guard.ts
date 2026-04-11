import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivateChildFn,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';

type JwtPayload = {
    exp?: number;
    role?: string | string[];
    roles?: string | string[];
    authorities?: string | string[];
    rol?: string | string[];
    [key: string]: unknown;
};

type AuthState =
    | { kind: 'anonymous' }
    | { kind: 'authenticated'; token: string; payload: JwtPayload | null; roles: string[] };

const TOKEN_KEYS = ['access_token', 'token', 'jwt', 'auth_token'];

function getTokenFromStorage(): string | null {
    for (const key of TOKEN_KEYS) {
        const raw = localStorage.getItem(key)?.trim();
        if (raw) return raw;
    }
    return null;
}



function base64UrlToUtf8(input: string): string {
    const base64 = input.replaceAll('-', '+').replaceAll('_', '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.codePointAt(0) ?? 0);
    return new TextDecoder().decode(bytes);
}

function parseJwtPayload(token: string): JwtPayload | null {
    const parts = token.split('.');
    if (parts.length < 2) return null;

    try {
        const json = base64UrlToUtf8(parts[1]);
        const payload = JSON.parse(json) as JwtPayload;
        return payload && typeof payload === 'object' ? payload : null;
    } catch {
        return null;
    }
}

function normalizeRoles(value: unknown): string[] {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    if (typeof value === 'string') return [value];
    return [];
}

function mapBackendRoleToAppRole(role: string): string {
    const normalized = role.trim().toUpperCase();

    if (normalized === 'ADMINISTRADOR') return 'ADMIN';
    if (normalized === 'MEDICO' || normalized === 'MÉDICO') return 'DOCTOR';
    if (normalized === 'PACIENTE') return 'PATIENT';

    return normalized;
}

function getRolesFromStoredUser(): string[] {
    const raw = localStorage.getItem('usuario');
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw) as { rol?: unknown };
        const rol = typeof parsed.rol === 'string' ? parsed.rol.trim() : '';
        return rol ? [rol] : [];
    } catch {
        return [];
    }
}

function getRolesFromPayload(payload: JwtPayload | null): string[] {
    if (!payload) return [];

    const roles = new Set<string>();
    for (const r of normalizeRoles(payload.roles)) roles.add(r);
    for (const r of normalizeRoles(payload.role)) roles.add(r);
    for (const r of normalizeRoles(payload.authorities)) roles.add(r);
    for (const r of normalizeRoles(payload.rol)) roles.add(r);

    // Fallback: si el token no incluye roles (o no se pueden leer),
    // usamos el rol persistido en el login para no mandar al usuario a Access.
    if (roles.size === 0) {
        for (const r of getRolesFromStoredUser()) roles.add(r);
    }

    return [...roles]
        .map((r) => r.trim())
        .filter(Boolean)
        .map(mapBackendRoleToAppRole);
}

function isExpired(payload: JwtPayload | null): boolean {
    const exp = payload?.exp;
    if (typeof exp !== 'number') return false;
    return Date.now() >= exp * 1000;
}

function getAuthState(): AuthState {
    const token = getTokenFromStorage();
    if (!token) return { kind: 'anonymous' };

    const payload = parseJwtPayload(token);
    if (isExpired(payload)) return { kind: 'anonymous' };

    return {
        kind: 'authenticated',
        token,
        payload,
        roles: getRolesFromPayload(payload),
    };
}

function getAllowedRoles(route: ActivatedRouteSnapshot): string[] {
    const data = route.data as { roles?: unknown };
    const roles = normalizeRoles(data?.roles).map((r) => r.toUpperCase());
    return roles;
}

function isAuthorized(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const router = inject(Router);
    const auth = getAuthState();

    const requiredRoles = getAllowedRoles(route);

    if (auth.kind === 'anonymous') {
        return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
    }

    if (!requiredRoles.length) return true;

    const userRoles = auth.roles;
    if (!userRoles.length) return router.createUrlTree(['/auth/access']);

    const ok = requiredRoles.some((rr) => userRoles.includes(rr));
    return ok ? true : router.createUrlTree(['/auth/access']);
}

export const authGuard: CanActivateFn = (route, state) => isAuthorized(route, state);

export const authChildGuard: CanActivateChildFn = (childRoute, state) =>
    isAuthorized(childRoute, state);
