import { Injectable } from '@angular/core';

type AppRole = 'ADMIN' | 'MEDICO' | 'PATIENT';

type JwtPayload = {
    exp?: number;
    sub?: string;
    roles?: string[];
    rol?: string | string[];
    name?: string;
    email?: string;
    [key: string]: unknown;
};

function mapBackendRoleToAppRole(role: string): string {
    const normalized = role.trim().toUpperCase();

    // Compatibilidad: algunos entornos todavía emiten DOCTOR en lugar de MEDICO.
    if (normalized === 'DOCTOR') return 'MEDICO';

    // Passthrough: ya están mapeados
    if (normalized === 'ADMIN' || normalized === 'MEDICO' || normalized === 'PATIENT') return normalized;

    // Enum RolUsuario de C#
    if (normalized === 'ADMINISTRADOR') return 'ADMIN';
    if (normalized === 'MEDICO' || normalized === 'MÉDICO') return 'MEDICO';
    if (normalized === 'PACIENTE') return 'PATIENT';

    return normalized;
}

function normalizeRoles(value: unknown): string[] {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    if (typeof value === 'string') return [value];
    return [];
}

const TOKEN_KEYS = ['access_token', 'token', 'jwt', 'auth_token'] as const;
const USER_LABEL_KEY = 'userLabel';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    getStoredUser(): { idUsuario: number; nombres: string; apellidos?: string; rol: string } | null {
        const raw = localStorage.getItem('usuario');
        if (!raw) return null;
        try {
            const parsed = JSON.parse(raw) as { idUsuario?: unknown; nombres?: unknown; apellidos?: unknown; rol?: unknown };
            const idUsuario = typeof parsed.idUsuario === 'number' ? parsed.idUsuario : null;
            const nombres = typeof parsed.nombres === 'string' ? parsed.nombres : '';
            const apellidos = typeof parsed.apellidos === 'string' ? parsed.apellidos : '';
            const rol = typeof parsed.rol === 'string' ? parsed.rol : '';

            if (!idUsuario) return null;
            return { idUsuario, nombres, apellidos: apellidos || undefined, rol };
        } catch {
            return null;
        }
    }

    getUserId(): number | null {
        const payload = this.getPayload();
        const sub = typeof payload?.sub === 'string' ? payload.sub.trim() : '';
        if (sub) {
            const parsed = Number(sub);
            if (Number.isInteger(parsed) && parsed > 0) return parsed;
        }

        return this.getStoredUser()?.idUsuario ?? null;
    }

    getStoredUserName(): string {
        const n = this.getStoredUser()?.nombres?.trim();
        return n || 'Usuario';
    }

    loginMock(role: AppRole, userLabel?: string): void {
        const defaultNameByRole: Record<AppRole, string> = {
            ADMIN: 'Admin Demo',
            MEDICO: 'Juan Perez',
            PATIENT: 'Maria Lopez',
        };

        const name = (userLabel ?? defaultNameByRole[role]).trim() || defaultNameByRole[role];

        const token = this.createMockJwt({
            roles: [role],
            name,
            exp: this.expInHours(8),
        });

        localStorage.setItem('token', token);
        localStorage.setItem(USER_LABEL_KEY, name);
    }

    logout(): void {
        for (const key of TOKEN_KEYS) localStorage.removeItem(key);
        localStorage.removeItem(USER_LABEL_KEY);
        localStorage.removeItem('usuario');
    }

    getToken(): string | null {
        for (const key of TOKEN_KEYS) {
            const raw = localStorage.getItem(key)?.trim();
            if (raw) return raw;
        }
        return null;
    }

    getUserLabel(): string {
        return localStorage.getItem(USER_LABEL_KEY) ?? 'Administrador';
    }

    getDisplayLabel(): string {
        const stored = this.getStoredUser();
        const nombres = (stored?.nombres ?? this.getName() ?? '').toString().trim();
        const apellidos = (stored?.apellidos ?? '').toString().trim();

        const primaryRole = this.getPrimaryAppRole();
        const roleLabel = primaryRole ? this.getRoleLabel(primaryRole) : '';

        const nombresTokens = nombres
            .split(/\s+/)
            .map((t) => t.trim())
            .reduce<string[]>((acc, t) => (t ? acc.concat(t) : acc), []);
        const apellidosTokens = apellidos
            .split(/\s+/)
            .map((t) => t.trim())
            .reduce<string[]>((acc, t) => (t ? acc.concat(t) : acc), []);

        const nombre1 = nombresTokens[0] ?? '';
        const apellidoPaterno = apellidosTokens[0] ?? (nombresTokens.length > 1 ? (nombresTokens.at(-1) ?? '') : '');
        const short = [nombre1, apellidoPaterno].filter(Boolean).join(' ').trim();
        if (short) return roleLabel ? `${roleLabel}: ${short}` : short;

        const fallbackName = nombresTokens.slice(0, 2).join(' ') || 'Usuario';
        return roleLabel ? `${roleLabel}: ${fallbackName}` : fallbackName;
    }

    getHomeRouteByRole(role: string | null | undefined): string {
        const normalizedRole = mapBackendRoleToAppRole((role ?? '').toString());

        if (normalizedRole === 'ADMIN') return '/admin-dashboard';
        if (normalizedRole === 'MEDICO') return '/weekly-agenda';
        if (normalizedRole === 'PATIENT') return '/appointments';

        return '/landing';
    }

    getHomeRouteForCurrentUser(): string {
        const role = this.getPrimaryAppRole();
        return this.getHomeRouteByRole(role);
    }

    getRoles(): string[] {
        const set = new Set<string>();

        // 1. FUENTE PRIMARIA: localStorage.usuario (escrito en cada login real)
        const stored = this.getStoredUser();
        if (stored?.rol) set.add(stored.rol);

        // 2. FUENTE SECUNDARIA: payload del JWT
        const payload = this.getPayload();
        if (payload) {
            for (const r of normalizeRoles(payload?.roles)) set.add(r);
            for (const r of normalizeRoles(payload?.rol)) set.add(r);
        }

        return [...set].map(mapBackendRoleToAppRole);
    }

    getPrimaryAppRole(): AppRole | null {
        const roles = this.getRoles();
        const first = roles[0];
        if (first === 'ADMIN' || first === 'MEDICO' || first === 'PATIENT') return first;
        return null;
    }

    private getName(): string {
        const payload = this.getPayload();
        const payloadName = typeof payload?.name === 'string' ? payload.name.trim() : '';
        if (payloadName) return payloadName;

        const stored = this.getUserLabel().trim();
        return stored;
    }

    private getRoleLabel(role: AppRole): string {
        const map: Record<AppRole, string> = {
            ADMIN: 'Administrador',
            MEDICO: 'Médico',
            PATIENT: 'Paciente',
        };

        return map[role];
    }

    private ensureMedicoPrefix(name: string): string {
        const normalized = name.trim();
        if (!normalized) return 'Dr.';
        return normalized.toLowerCase().startsWith('dr.') ? normalized : `Dr. ${normalized}`;
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        if (!token) return false;
        const payload = this.getPayload();
        if (!payload?.exp) return true;
        return Date.now() < payload.exp * 1000;
    }

    private getPayload(): JwtPayload | null {
        const token = this.getToken();
        if (!token) return null;

        const parts = token.split('.');
        if (parts.length < 2) return null;

        try {
            const json = this.base64UrlToUtf8(parts[1]);
            const payload = JSON.parse(json) as JwtPayload;
            return payload && typeof payload === 'object' ? payload : null;
        } catch {
            return null;
        }
    }

    private expInHours(hours: number): number {
        return Math.floor((Date.now() + hours * 60 * 60 * 1000) / 1000);
    }

    private createMockJwt(payload: JwtPayload): string {
        const header = { alg: 'none', typ: 'JWT' };
        const headerPart = this.utf8ToBase64Url(JSON.stringify(header));
        const payloadPart = this.utf8ToBase64Url(JSON.stringify(payload));
        return `${headerPart}.${payloadPart}.`;
    }

    private utf8ToBase64Url(input: string): string {
        const bytes = new TextEncoder().encode(input);
        const binary = Array.from(bytes, (b) => String.fromCodePoint(b)).join('');
        const base64 = btoa(binary);
        return base64.replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
    }

    private base64UrlToUtf8(input: string): string {
        const base64 = input.replaceAll('-', '+').replaceAll('_', '/');
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
        const binary = atob(padded);
        const bytes = Uint8Array.from(binary, (c) => c.codePointAt(0) ?? 0);
        return new TextDecoder().decode(bytes);
    }
}
