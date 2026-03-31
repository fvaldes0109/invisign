export const WATERMARK_SERVICE_HOST = import.meta.env.VITE_WATERMARK_SERVICE_HOST || 'http://localhost';
export const WATERMARK_SERVICE_PORT = import.meta.env.VITE_WATERMARK_SERVICE_PORT || '8000';
export const WATERMARK_SERVICE_URL = `${WATERMARK_SERVICE_HOST}:${WATERMARK_SERVICE_PORT}`;

export const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST || 'http://localhost';
export const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || '8080';
export const BACKEND_URL = `${BACKEND_HOST}:${BACKEND_PORT}`;
