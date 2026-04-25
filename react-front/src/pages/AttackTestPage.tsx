import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Engraving } from '../services/engravingApi';
import type { UserImage } from '../services/imageApi';
import type { Watermark } from '../services/watermarkApi';
import {
    runAttackTest,
    type AttackTestParams,
    type AttackTestResult,
    type AttackType,
} from '../services/attackTestApi';

interface LocationState {
    engraving: Engraving;
    image: UserImage;
    watermark: Watermark;
}

interface AttackDef {
    id: AttackType;
    label: string;
    description: string;
    param?: { key: keyof AttackTestParams; label: string; min: number; max: number; step: number; default: number };
}

const ATTACKS: AttackDef[] = [
    {
        id: 'rotate',
        label: 'Rotate',
        description: 'Rotate the image 90° clockwise.',
        param: { key: 'angle', label: 'Angle (°)', min: 90, max: 270, step: 90, default: 90 },
    },
    {
        id: 'mirror',
        label: 'Mirror',
        description: 'Flip the image horizontally.',
    },
    {
        id: 'noise',
        label: 'Gaussian Noise',
        description: 'Add random pixel noise.',
        param: { key: 'std', label: 'Std dev', min: 5, max: 80, step: 5, default: 25 },
    },
    {
        id: 'brightness',
        label: 'Brightness',
        description: 'Multiply pixel values by a factor.',
        param: { key: 'factor', label: 'Factor', min: 0.5, max: 2.0, step: 0.1, default: 1.3 },
    },
    {
        id: 'compression',
        label: 'JPEG Compression',
        description: 'Re-encode at low JPEG quality.',
        param: { key: 'quality', label: 'Quality (1–100)', min: 1, max: 100, step: 1, default: 20 },
    },
];

const c = {
    bg: '#07090F',
    surface: '#0F1320',
    surfaceAlt: '#141929',
    border: '#1E2A45',
    accent: '#06B6D4',
    accentDark: '#0891B2',
    accentBg: 'rgba(6,182,212,0.08)',
    accentBorder: 'rgba(6,182,212,0.25)',
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    textDim: '#64748B',
    error: '#F87171',
    errorBg: 'rgba(248,113,113,0.08)',
    errorBorder: 'rgba(248,113,113,0.25)',
    warning: '#FBBF24',
    success: '#10B981',
};

const s: Record<string, React.CSSProperties> = {
    page: {
        minHeight: '100vh',
        background: c.bg,
        color: c.text,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        flex: 1,
        padding: '2.5rem',
        maxWidth: 960,
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    badge: {
        display: 'inline-flex',
        alignSelf: 'flex-start',
        padding: '0.3rem 0.9rem',
        borderRadius: 100,
        background: c.accentBg,
        border: `1px solid ${c.accentBorder}`,
        color: c.accent,
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
    },
    pageTitle: {
        fontSize: '1.6rem',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        margin: 0,
    },
    pageSub: { fontSize: '0.88rem', color: c.textMuted, margin: 0 },

    section: {
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 16,
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1rem',
    },
    sectionTitle: {
        fontSize: '0.95rem',
        fontWeight: 700,
        color: c.text,
        margin: 0,
    },

    attackGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '0.75rem',
    },
    attackCard: {
        padding: '1rem',
        borderRadius: 12,
        border: `1px solid ${c.border}`,
        background: c.surfaceAlt,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.3rem',
        transition: 'border-color 0.15s, background 0.15s',
    },
    attackCardActive: {
        border: `1px solid ${c.accent}`,
        background: c.accentBg,
    },
    attackLabel: { fontSize: '0.9rem', fontWeight: 700, color: c.text },
    attackDesc: { fontSize: '0.75rem', color: c.textMuted },

    paramRow: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.5rem',
        padding: '1rem',
        borderRadius: 10,
        background: c.surfaceAlt,
        border: `1px solid ${c.border}`,
    },
    paramLabel: { fontSize: '0.8rem', fontWeight: 600, color: c.textMuted },
    paramValue: { fontSize: '0.9rem', fontWeight: 700, color: c.accent },
    slider: { width: '100%', accentColor: c.accent },

    runBtn: {
        padding: '0.75rem 2rem',
        borderRadius: 10,
        border: 'none',
        background: `linear-gradient(135deg, ${c.accent}, ${c.accentDark})`,
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.9rem',
        cursor: 'pointer',
        boxShadow: `0 0 20px rgba(6,182,212,0.3)`,
        alignSelf: 'flex-start',
    },
    runBtnDisabled: { opacity: 0.45, cursor: 'not-allowed' },

    errorBox: {
        padding: '0.85rem 1rem',
        borderRadius: 10,
        background: c.errorBg,
        border: `1px solid ${c.errorBorder}`,
        color: c.error,
        fontSize: '0.85rem',
    },

    resultGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    resultCard: {
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column' as const,
    },
    resultImg: {
        display: 'block',
        width: '100%',
        aspectRatio: '1',
        objectFit: 'contain' as const,
        background: c.surfaceAlt,
    },
    resultInfo: {
        padding: '0.75rem 1rem',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.35rem',
    },
    resultLabel: {
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
        color: c.accent,
    },
    downloadLink: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: c.accent,
        textDecoration: 'none',
    },

    scoreRow: {
        padding: '0.6rem 1rem',
        borderTop: `1px solid ${c.border}`,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.4rem',
    },
    scoreLabelRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    scoreLabel: {
        fontSize: '0.7rem',
        color: c.textMuted,
        fontWeight: 500,
        letterSpacing: '0.03em',
    },
    progressBar: {
        height: 4,
        borderRadius: 2,
        background: c.border,
        overflow: 'hidden',
    },

    backBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.6rem 1.2rem',
        borderRadius: 8,
        border: `1px solid ${c.border}`,
        background: 'transparent',
        color: c.textMuted,
        fontSize: '0.85rem',
        fontWeight: 600,
        cursor: 'pointer',
    },

    engravingPreview: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
    },
    previewThumb: {
        width: 64,
        height: 64,
        borderRadius: 8,
        objectFit: 'cover' as const,
        border: `1px solid ${c.border}`,
        background: c.surfaceAlt,
    },
    previewMeta: { display: 'flex', flexDirection: 'column' as const, gap: '0.2rem' },
    previewName: { fontSize: '0.95rem', fontWeight: 700, color: c.text },
    previewSub: { fontSize: '0.8rem', color: c.textMuted },
};

function scoreColor(pct: number) {
    return pct >= 85 ? c.success : pct >= 60 ? c.warning : c.error;
}

export function AttackTestPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState | null;

    const [selectedAttack, setSelectedAttack] = useState<AttackType>('rotate');
    const [paramValue, setParamValue] = useState<number>(90);
    const [running, setRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AttackTestResult | null>(null);

    const attackDef = ATTACKS.find(a => a.id === selectedAttack)!;

    useEffect(() => {
        if (!state?.engraving) {
            navigate('/dashboard/engravings', { replace: true });
        }
    }, [state, navigate]);

    useEffect(() => {
        if (attackDef.param) {
            setParamValue(attackDef.param.default);
        }
        setResult(null);
        setError(null);
    }, [selectedAttack]);

    if (!state?.engraving) return null;

    const { engraving, image, watermark } = state;

    async function handleRun() {
        setRunning(true);
        setError(null);
        setResult(null);
        try {
            const params: AttackTestParams = {};
            if (attackDef.param) {
                params[attackDef.param.key] = paramValue as never;
            }
            const res = await runAttackTest(engraving.id, selectedAttack, params);
            setResult(res);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Something went wrong');
        } finally {
            setRunning(false);
        }
    }

    return (
        <div style={s.page}>
            <main style={s.main}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={s.badge}>Robustness test</span>
                    <h1 style={s.pageTitle}>Attack test</h1>
                    <p style={s.pageSub}>
                        Apply a transformation attack to the engraved image and check whether the watermark can still be extracted.
                    </p>
                </div>

                <button style={s.backBtn} onClick={() => navigate(-1)}>
                    ← Back to engraving
                </button>

                {/* Engraving preview */}
                <div style={s.section}>
                    <p style={s.sectionTitle}>Engraved image</p>
                    <div style={s.engravingPreview}>
                        <img src={engraving.engraved_url} alt="engraved" style={s.previewThumb} />
                        <div style={s.previewMeta}>
                            <span style={s.previewName}>{image.name}</span>
                            <span style={s.previewSub}>Watermark: {watermark.name}</span>
                        </div>
                    </div>
                </div>

                {/* Attack selector */}
                <div style={s.section}>
                    <p style={s.sectionTitle}>Select attack</p>
                    <div style={s.attackGrid}>
                        {ATTACKS.map(attack => (
                            <div
                                key={attack.id}
                                style={{
                                    ...s.attackCard,
                                    ...(selectedAttack === attack.id ? s.attackCardActive : {}),
                                }}
                                onClick={() => setSelectedAttack(attack.id)}
                            >
                                <span style={s.attackLabel}>{attack.label}</span>
                                <span style={s.attackDesc}>{attack.description}</span>
                            </div>
                        ))}
                    </div>

                    {attackDef.param && (
                        <div style={s.paramRow}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={s.paramLabel}>{attackDef.param.label}</span>
                                <span style={s.paramValue}>{paramValue}</span>
                            </div>
                            <input
                                type="range"
                                style={s.slider}
                                min={attackDef.param.min}
                                max={attackDef.param.max}
                                step={attackDef.param.step}
                                value={paramValue}
                                onChange={e => setParamValue(Number(e.target.value))}
                            />
                        </div>
                    )}

                    <button
                        style={{ ...s.runBtn, ...(running ? s.runBtnDisabled : {}) }}
                        disabled={running}
                        onClick={handleRun}
                    >
                        {running ? 'Running…' : 'Run attack test'}
                    </button>
                </div>

                {error && <div style={s.errorBox}>{error}</div>}

                {result && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ ...s.sectionTitle, margin: 0 }}>Results</p>
                        <div style={s.resultGrid}>
                            <div style={s.resultCard}>
                                <img src={result.attacked_image_url} alt="Attacked image" style={s.resultImg} />
                                <div style={s.resultInfo}>
                                    <span style={s.resultLabel}>Attacked image</span>
                                    <a href={result.attacked_image_url} download style={s.downloadLink}>
                                        ↓ Download
                                    </a>
                                </div>
                            </div>
                            <div style={s.resultCard}>
                                <img src={result.result_url} alt="Extracted watermark" style={s.resultImg} />
                                <div style={s.resultInfo}>
                                    <span style={s.resultLabel}>Extracted watermark</span>
                                    <a href={result.result_url} download style={s.downloadLink}>
                                        ↓ Download
                                    </a>
                                </div>
                                {result.similarity_score != null && (() => {
                                    const pct = Math.round(result.similarity_score! * 100);
                                    return (
                                        <div style={s.scoreRow}>
                                            <div style={s.scoreLabelRow}>
                                                <span style={s.scoreLabel}>Similarity (NCC)</span>
                                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: scoreColor(pct) }}>{pct}%</span>
                                            </div>
                                            <div style={s.progressBar}>
                                                <div style={{ height: '100%', width: `${pct}%`, borderRadius: 2, background: scoreColor(pct) }} />
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
