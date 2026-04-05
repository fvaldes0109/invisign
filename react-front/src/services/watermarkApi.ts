import { BACKEND_URL } from '../config';

export interface Watermark {
    id: string;
    name: string;
    image_url: string;
    thumbnail_url: string;
}

function authHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json() as Promise<T>;
}

export async function fetchWatermarks(): Promise<Watermark[]> {
    const res = await fetch(`${BACKEND_URL}/api/watermarks`, {
        headers: authHeaders(),
    });
    const body = await handleResponse<{ data: Watermark[] }>(res);
    return body.data;
}

export async function fetchWatermarkCount(): Promise<number> {
    const res = await fetch(`${BACKEND_URL}/api/watermarks/count`, {
        headers: authHeaders(),
    });
    const body = await handleResponse<{ count: number }>(res);
    return body.count;
}

export async function uploadWatermark(file: File, name: string): Promise<Watermark> {
    const form = new FormData();
    form.append('image', file);
    form.append('name', name.trim());
    const res = await fetch(`${BACKEND_URL}/api/watermarks`, {
        method: 'POST',
        headers: authHeaders(),
        body: form,
    });
    const body = await handleResponse<{ data: Watermark }>(res);
    return body.data;
}

export async function deleteWatermark(id: string): Promise<void> {
    const res = await fetch(`${BACKEND_URL}/api/watermarks/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
}
