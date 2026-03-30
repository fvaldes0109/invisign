export const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost';
export const API_PORT = import.meta.env.VITE_API_PORT || '8000';
export const API_BASE_URL = `${API_HOST}:${API_PORT}`;

export const LARAVEL_HOST = import.meta.env.VITE_LARAVEL_HOST || 'http://localhost';
export const LARAVEL_PORT = import.meta.env.VITE_LARAVEL_PORT || '8080';
export const LARAVEL_BASE_URL = `${LARAVEL_HOST}:${LARAVEL_PORT}`;
