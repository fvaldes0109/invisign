import { BACKEND_URL } from '../config';

export interface EngravingRelated {
    id: string;
    name: string;
    image_url: string;
    thumbnail_url: string;
}

export interface Engraving {
    id: string;
    image_id: string;
    watermark_id: string;
    engraved_url: string;
    image?: EngravingRelated;
    watermark?: EngravingRelated;
}

function authHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json() as Promise<T>;
}

export async function fetchEngravings(filters?: { image_id?: string; watermark_id?: string }): Promise<Engraving[]> {
    const params = new URLSearchParams();
    if (filters?.image_id) params.set('image_id', filters.image_id);
    if (filters?.watermark_id) params.set('watermark_id', filters.watermark_id);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${BACKEND_URL}/api/engravings${qs}`, {
        headers: authHeaders(),
    });
    const body = await handleResponse<{ data: Engraving[] }>(res);
    return body.data;
}

export async function createEngraving(imageId: string, watermarkId: string): Promise<Engraving> {
    const res = await fetch(`${BACKEND_URL}/api/engravings`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_id: imageId, watermark_id: watermarkId }),
    });
    const body = await handleResponse<{ data: Engraving }>(res);
    return body.data;
}
