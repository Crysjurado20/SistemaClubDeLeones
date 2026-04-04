import { Injectable } from '@angular/core';

type AppRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

type JwtPayload = {
  exp?: number;
  roles?: string[];
  name?: string;
  email?: string;
  [key: string]: unknown;
};

const TOKEN_KEYS = ['access_token', 'token', 'jwt', 'auth_token'] as const;
const USER_LABEL_KEY = 'userLabel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  loginMock(role: AppRole, userLabel?: string): void {
    const defaultNameByRole: Record<AppRole, string> = {
      ADMIN: 'Admin Demo',
      DOCTOR: 'Juan Perez',
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
    const name = this.getName();
    const role = this.getPrimaryRole();
    const roleLabel = role ? this.getRoleLabel(role) : null;

    if (!name) return 'Usuario';

    const baseName = name.includes('·') ? name.split('·')[0].trim() : name.trim();

    if (!roleLabel) return baseName;

    const normalizedName = role === 'DOCTOR' ? this.ensureDoctorPrefix(baseName) : baseName;
    return `${normalizedName} · ${roleLabel}`;
  }

  getRoles(): string[] {
    const payload = this.getPayload();
    const roles = payload?.roles ?? [];
    return roles.map((r) => r.trim()).filter(Boolean).map((r) => r.toUpperCase());
  }

  private getPrimaryRole(): AppRole | null {
    const roles = this.getRoles();
    const first = roles[0];
    if (first === 'ADMIN' || first === 'DOCTOR' || first === 'PATIENT') return first;
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
      DOCTOR: 'Doctor',
      PATIENT: 'Paciente',
    };

    return map[role];
  }

  private ensureDoctorPrefix(name: string): string {
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
