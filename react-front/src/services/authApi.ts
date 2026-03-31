import { BACKEND_URL } from '../config';

const BASE = `${BACKEND_URL}/api/auth`;

export interface AuthUser {
    id: number;
    name: string;
    email: string;
}

export interface AuthResponse {
    user: AuthUser;
    token: string;
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        const message =
            data?.message ||
            Object.values(data?.errors ?? {})[0]?.[0] ||
            'Request failed';
        throw new Error(message as string);
    }

    return data as T;
}

function authHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function register(name: string, email: string, password: string, password_confirmation: string) {
    return request<AuthResponse>('/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, password_confirmation }),
    });
}

export function login(email: string, password: string) {
    return request<AuthResponse>('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export function logout() {
    return request<{ message: string }>('/logout', {
        method: 'POST',
        headers: authHeaders(),
    });
}

export function me() {
    return request<AuthUser>('/me', {
        method: 'GET',
        headers: authHeaders(),
    });
}
