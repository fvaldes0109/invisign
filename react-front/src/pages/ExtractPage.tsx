import { useEffect, useRef, useState } from 'react';
import { fetchEngravings, type Engraving } from '../services/engravingApi';
import { runExtraction, type ExtractionResult } from '../services/extractionApi';
import { useBreakpoint } from '../hooks/useBreakpoint';

const c = {
    bg: '#07090F',
    surface: '#0F1320',
    surfaceAlt: '#141929',
    border: '#1E2A45',
    primary: '#6366F1',
    accent: '#06B6D4',
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    textDim: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#F87171',
    errorBg: 'rgba(248,113,113,0.08)',
    errorBorder: 'rgba(248,113,113,0.25)',
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
        maxWidth: 860,
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    pageHeader: { marginBottom: '0.5rem' },
    pageLabel: {
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        color: c.success,
        marginBottom: '0.4rem',
    },
    pageTitle: {
        fontSize: '1.6rem',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        margin: '0 0 0.4rem',
    },
    pageSub: { fontSize: '0.9rem', color: c.textMuted, margin: 0 },

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
    sectionSub: {
        fontSize: '0.82rem',
        color: c.textMuted,
        marginTop: '-0.5rem',
    },

    // Engraving picker
    engravingGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '0.75rem',
        maxHeight: 320,
        overflowY: 'auto' as const,
        paddingRight: '0.25rem',
    },
    engravingItem: {
        borderRadius: 10,
        overflow: 'hidden',
        border: `2px solid ${c.border}`,
        cursor: 'pointer',
        background: c.surfaceAlt,
        display: 'flex',
        flexDirection: 'column' as const,
    },
    engravingItemSelected: {
        borderColor: c.success,
        boxShadow: `0 0 0 2px rgba(16,185,129,0.25)`,
    },
    engravingThumb: {
        width: '100%',
        aspectRatio: '4/3',
        objectFit: 'cover' as const,
        display: 'block',
    },
    engravingFooter: {
        display: 'flex',
        alignItems: 'center',
        padding: '0.4rem 0.6rem',
        gap: '0.35rem',
        minWidth: 0,
    },
    engravingLabel: {
        fontSize: '0.72rem',
        fontWeight: 600,
        color: c.textMuted,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
        flex: 1,
        minWidth: 0,
    },
    watermarkThumb: {
        width: 20,
        height: 20,
        borderRadius: 4,
        objectFit: 'cover' as const,
        border: `1px solid ${c.border}`,
        flexShrink: 0,
    },

    // File upload
    uploadZone: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.25rem',
        borderRadius: 10,
        border: `1px dashed ${c.border}`,
        background: c.surfaceAlt,
        cursor: 'pointer',
    },
    uploadIcon: { fontSize: '1.5rem', flexShrink: 0 },
    uploadText: { fontSize: '0.875rem', color: c.textMuted },
    uploadFilename: { fontSize: '0.875rem', color: c.text, fontWeight: 500 },

    // Action row
    actionRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap' as const,
    },
    runBtn: {
        padding: '0.7rem 1.75rem',
        borderRadius: 10,
        border: 'none',
        background: `linear-gradient(135deg, ${c.success}, #059669)`,
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.9rem',
        cursor: 'pointer',
        boxShadow: `0 0 20px rgba(16,185,129,0.3)`,
    },
    runBtnDisabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
    },
    errorBox: {
        padding: '0.65rem 1rem',
        borderRadius: 8,
        background: c.errorBg,
        border: `1px solid ${c.errorBorder}`,
        color: c.error,
        fontSize: '0.82rem',
    },

    // Result
    resultSection: {
        background: c.surface,
        border: `1px solid rgba(16,185,129,0.3)`,
        borderRadius: 16,
        overflow: 'hidden',
    },
    resultHeader: {
        padding: '1rem 1.5rem',
        borderBottom: `1px solid rgba(16,185,129,0.2)`,
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
    },
    resultBadge: {
        display: 'inline-flex',
        padding: '0.2rem 0.7rem',
        borderRadius: 100,
        background: `rgba(16,185,129,0.1)`,
        border: `1px solid rgba(16,185,129,0.3)`,
        color: c.success,
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
    },
    resultTitle: { fontSize: '0.95rem', fontWeight: 700 },
    resultImg: {
        display: 'block',
        width: '100%',
        maxHeight: 400,
        objectFit: 'contain' as const,
        background: c.surfaceAlt,
    },
    resultFooter: {
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    downloadBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.55rem 1.25rem',
        borderRadius: 9,
        border: 'none',
        background: `linear-gradient(135deg, ${c.success}, #059669)`,
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.85rem',
        cursor: 'pointer',
        textDecoration: 'none',
    },

    // Similarity score
    scoreRow: {
        padding: '1rem 1.5rem',
        borderTop: `1px solid rgba(16,185,129,0.15)`,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.5rem',
    },
    scoreLabelRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    scoreLabel: {
        fontSize: '0.78rem',
        color: c.textMuted,
        fontWeight: 500,
    },
    progressBar: {
        height: 5,
        borderRadius: 3,
        background: c.border,
        overflow: 'hidden',
    },

    emptyState: {
        textAlign: 'center' as const,
        padding: '2rem',
        color: c.textDim,
        fontSize: '0.875rem',
    },
};

function scoreColor(pct: number) {
    return pct >= 85 ? c.success : pct >= 60 ? c.warning : c.error;
}

function scoreBarBg(pct: number) {
    return pct >= 85
        ? `linear-gradient(90deg, ${c.success}, #059669)`
        : pct >= 60
        ? `linear-gradient(90deg, ${c.warning}, #D97706)`
        : `linear-gradient(90deg, ${c.error}, #EF4444)`;
}

export function ExtractPage() {
    const { isMobile, isTablet } = useBreakpoint();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [engravings, setEngravings]           = useState<Engraving[]>([]);
    const [loadingEngravings, setLoadingEngravings] = useState(true);
    const [selectedEngraving, setSelectedEngraving] = useState<Engraving | null>(null);
    const [suspectFile, setSuspectFile]         = useState<File | null>(null);
    const [running, setRunning]                 = useState(false);
    const [error, setError]                     = useState('');
    const [result, setResult]                   = useState<ExtractionResult | null>(null);

    useEffect(() => {
        fetchEngravings()
            .then(setEngravings)
            .finally(() => setLoadingEngravings(false));
    }, []);

    async function handleRun() {
        if (!selectedEngraving || !suspectFile) return;
        setRunning(true);
        setError('');
        setResult(null);
        try {
            const res = await runExtraction(selectedEngraving.id, suspectFile);
            setResult(res);
        } catch {
            setError('Extraction failed. Please try again.');
        } finally {
            setRunning(false);
        }
    }

    const canRun = !!selectedEngraving && !!suspectFile && !running;

    return (
        <div style={s.page}>
            <main style={{ ...s.main, padding: isMobile ? '1.25rem' : isTablet ? '1.75rem' : '2.5rem' }}>
                <div style={s.pageHeader}>
                    <div style={s.pageLabel}>Watermark extraction</div>
                    <h1 style={s.pageTitle}>Extract & verify ownership</h1>
                    <p style={s.pageSub}>
                        Select one of your engravings, then upload a suspected copy.
                        WaterMark will attempt to extract the hidden watermark from it.
                    </p>
                </div>

                {/* Step 1 — pick an engraving */}
                <div style={s.section}>
                    <p style={s.sectionTitle}>1. Select the original engraving</p>
                    <p style={s.sectionSub}>
                        Choose the engraving that corresponds to the image you want to verify.
                    </p>

                    {loadingEngravings ? (
                        <div style={s.emptyState}>Loading engravings…</div>
                    ) : engravings.length === 0 ? (
                        <div style={s.emptyState}>
                            No engravings yet. Go to My Images to engrave an image first.
                        </div>
                    ) : (
                        <div style={s.engravingGrid}>
                            {engravings.map(e => (
                                <div
                                    key={e.id}
                                    style={{
                                        ...s.engravingItem,
                                        ...(selectedEngraving?.id === e.id ? s.engravingItemSelected : {}),
                                    }}
                                    onClick={() => setSelectedEngraving(e)}
                                >
                                    <img
                                        src={e.engraved_url}
                                        alt="engraved"
                                        style={s.engravingThumb}
                                    />
                                    <div style={s.engravingFooter}>
                                        <span style={s.engravingLabel} title={e.image?.name}>
                                            {e.image?.name ?? e.image_id}
                                        </span>
                                        {e.watermark?.thumbnail_url && (
                                            <img
                                                src={e.watermark.thumbnail_url}
                                                alt={e.watermark.name}
                                                title={e.watermark.name}
                                                style={s.watermarkThumb}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Step 2 — upload suspect image */}
                <div style={s.section}>
                    <p style={s.sectionTitle}>2. Upload the suspected copy</p>
                    <p style={s.sectionSub}>
                        The image you believe may contain the embedded watermark.
                    </p>

                    <div style={s.uploadZone} onClick={() => fileInputRef.current?.click()}>
                        <span style={s.uploadIcon}>🔎</span>
                        {suspectFile
                            ? <span style={s.uploadFilename}>{suspectFile.name}</span>
                            : <span style={s.uploadText}>Click to select an image, JPEG, PNG, WebP</span>
                        }
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        style={{ display: 'none' }}
                        onChange={e => setSuspectFile(e.target.files?.[0] ?? null)}
                    />
                </div>

                {/* Run */}
                <div style={s.actionRow}>
                    <button
                        style={{ ...s.runBtn, ...(!canRun ? s.runBtnDisabled : {}) }}
                        disabled={!canRun}
                        onClick={handleRun}
                    >
                        {running ? 'Running extraction…' : 'Run extraction'}
                    </button>
                    {error && <span style={s.errorBox}>⚠ {error}</span>}
                </div>

                {/* Result */}
                {result && (
                    <div style={s.resultSection}>
                        <div style={s.resultHeader}>
                            <span style={s.resultBadge}>Result</span>
                            <span style={s.resultTitle}>Extracted watermark</span>
                        </div>
                        <img src={result.result_url} alt="Extracted watermark" style={s.resultImg} />
                        {result.similarity_score != null && (() => {
                            const pct = Math.round(result.similarity_score! * 100);
                            return (
                                <div style={s.scoreRow}>
                                    <div style={s.scoreLabelRow}>
                                        <span style={s.scoreLabel}>Similarity (NCC)</span>
                                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: scoreColor(pct) }}>
                                            {pct}%
                                        </span>
                                    </div>
                                    <div style={s.progressBar}>
                                        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: scoreBarBg(pct), transition: 'width 0.8s ease' }} />
                                    </div>
                                </div>
                            );
                        })()}
                        <div style={s.resultFooter}>
                            <a href={result.result_url} download style={s.downloadBtn}>
                                ↓ Download
                            </a>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
