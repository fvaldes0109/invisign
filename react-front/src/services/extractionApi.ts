import { BACKEND_URL } from '../config';

export interface ExtractionEngraving {
    id: string;
    engraved_url: string;
    image?: { id: string; name: string; thumbnail_url: string };
    watermark?: { id: string; name: string; thumbnail_url: string };
}

export interface ExtractionResult {
    id: string;
    engraving_id: string;
    suspect_url: string;
    result_url: string;
    similarity_score?: number | null;
    engraving?: ExtractionEngraving;
}

function authHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json() as Promise<T>;
}

export async function fetchExtractions(): Promise<ExtractionResult[]> {
    const res = await fetch(`${BACKEND_URL}/api/extractions`, {
        headers: authHeaders(),
    });
    const body = await handleResponse<{ data: ExtractionResult[] }>(res);
    return body.data;
}

export async function fetchExtractionCount(): Promise<number> {
    const res = await fetch(`${BACKEND_URL}/api/extractions/count`, {
        headers: authHeaders(),
    });
    const body = await handleResponse<{ data: number }>(res);
    return body.data;
}

export async function fetchExtraction(id: string): Promise<ExtractionResult> {
    const res = await fetch(`${BACKEND_URL}/api/extractions/${id}`, {
        headers: authHeaders(),
    });
    const body = await handleResponse<{ data: ExtractionResult }>(res);
    return body.data;
}

export async function runExtraction(engravingId: string, suspectImage: File): Promise<ExtractionResult> {
    const form = new FormData();
    form.append('engraving_id', engravingId);
    form.append('suspect_image', suspectImage);

    const res = await fetch(`${BACKEND_URL}/api/extractions`, {
        method: 'POST',
        headers: authHeaders(),
        body: form,
    });

    const body = await handleResponse<{ data: ExtractionResult }>(res);
    return body.data;
}
