import { BACKEND_URL } from '../config';

export interface UserImage {
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

export async function fetchImages(): Promise<UserImage[]> {
    const res = await fetch(`${BACKEND_URL}/api/images`, {
        headers: authHeaders(),
    });
    const body = await handleResponse<{ data: UserImage[] }>(res);
    return body.data;
}

export async function fetchImageCount(): Promise<number> {
    const res = await fetch(`${BACKEND_URL}/api/images/count`, {
        headers: authHeaders(),
    });
    const body = await handleResponse<{ count: number }>(res);
    return body.count;
}

export async function uploadImage(file: File, name: string): Promise<UserImage> {
    const form = new FormData();
    form.append('image', file);
    form.append('name', name.trim());
    const res = await fetch(`${BACKEND_URL}/api/images`, {
        method: 'POST',
        headers: authHeaders(),
        body: form,
    });
    const body = await handleResponse<{ data: UserImage }>(res);
    return body.data;
}

export async function deleteImage(id: string): Promise<void> {
    const res = await fetch(`${BACKEND_URL}/api/images/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
}
