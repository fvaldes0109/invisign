import { BACKEND_URL } from '../config';

export type AttackType = 'rotate' | 'mirror' | 'noise' | 'brightness' | 'compression';

export interface AttackTestParams {
    angle?: number;
    std?: number;
    factor?: number;
    quality?: number;
}

export interface AttackTestResult {
    id: string;
    engraving_id: string;
    attack_type: AttackType;
    attacked_image_url: string;
    result_url: string;
    similarity_score?: number | null;
    engraving?: {
        id: string;
        engraved_url: string;
        image?: { id: string; name: string; thumbnail_url: string };
        watermark?: { id: string; name: string; thumbnail_url: string };
    };
}

function authHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json() as Promise<T>;
}

export async function runAttackTest(
    engravingId: string,
    attackType: AttackType,
    params: AttackTestParams = {},
): Promise<AttackTestResult> {
    const res = await fetch(`${BACKEND_URL}/api/attack-tests`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ engraving_id: engravingId, attack_type: attackType, params }),
    });
    const body = await handleResponse<{ data: AttackTestResult }>(res);
    return body.data;
}

export async function fetchAttackTests(engravingId?: string): Promise<AttackTestResult[]> {
    const qs = engravingId ? `?engraving_id=${engravingId}` : '';
    const res = await fetch(`${BACKEND_URL}/api/attack-tests${qs}`, {
        headers: authHeaders(),
    });
    const body = await handleResponse<{ data: AttackTestResult[] }>(res);
    return body.data;
}
