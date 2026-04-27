import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchExtractions, type ExtractionResult } from '../services/extractionApi';
import { useBreakpoint } from '../hooks/useBreakpoint';

const c = {
    bg: '#07090F',
    surface: '#0F1320',
    surfaceAlt: '#141929',
    border: '#1E2A45',
    accent: '#06B6D4',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#F87171',
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    textDim: '#64748B',
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
    newBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.45rem 1rem',
        borderRadius: 8,
        border: 'none',
        background: `linear-gradient(135deg, ${c.success}, #059669)`,
        color: '#fff',
        fontSize: '0.82rem',
        fontWeight: 700,
        cursor: 'pointer',
        textDecoration: 'none',
    },
    main: {
        flex: 1,
        padding: '2.5rem',
        maxWidth: 1280,
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '2rem',
    },
    listHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
    },
    listTitle: { fontSize: '1rem', fontWeight: 700 },
    listCount: {
        fontSize: '0.8rem',
        color: c.textDim,
        background: c.surfaceAlt,
        border: `1px solid ${c.border}`,
        borderRadius: 100,
        padding: '0.2rem 0.7rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.25rem',
    },
    card: {
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column' as const,
    },
    cardImagesRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderBottom: `1px solid ${c.border}`,
    },
    cardImage: {
        display: 'block',
        width: '100%',
        aspectRatio: '4/3',
        objectFit: 'cover' as const,
        background: c.surfaceAlt,
    },
    cardImageDivider: {
        borderLeft: `1px solid ${c.border}`,
    },
    cardImageLabel: {
        padding: '0.3rem 0.6rem',
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
        color: c.textDim,
        background: c.surfaceAlt,
        borderBottom: `1px solid ${c.border}`,
        textAlign: 'center' as const,
    },
    cardBody: {
        padding: '0.85rem 1rem',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.5rem',
    },
    engravingInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
    },
    engravingThumb: {
        width: 32,
        height: 32,
        borderRadius: 6,
        objectFit: 'cover' as const,
        border: `1px solid ${c.border}`,
        flexShrink: 0,
        background: c.surfaceAlt,
    },
    engravingMeta: {
        display: 'flex',
        flexDirection: 'column' as const,
        minWidth: 0,
    },
    engravingName: {
        fontSize: '0.82rem',
        fontWeight: 600,
        color: c.text,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
    },
    watermarkThumb: {
        width: 28,
        height: 28,
        borderRadius: 5,
        objectFit: 'cover' as const,
        border: `1px solid ${c.border}`,
        flexShrink: 0,
        background: c.surfaceAlt,
    },
    watermarkLabel: {
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase' as const,
        color: c.textDim,
    },
    scoreRow: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.3rem',
        paddingTop: '0.4rem',
        borderTop: `1px solid rgba(255,255,255,0.05)`,
    },
    scoreLabelRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    scoreLabel: {
        fontSize: '0.7rem',
        color: c.textDim,
        fontWeight: 500,
        letterSpacing: '0.03em',
    },
    progressBar: {
        height: 3,
        borderRadius: 2,
        background: c.border,
        overflow: 'hidden',
    },

    emptyState: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '4rem 2rem',
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 16,
        textAlign: 'center' as const,
    },
    emptyIcon: { fontSize: '2.5rem' },
    emptyTitle: { fontSize: '1rem', fontWeight: 700 },
    emptyHint: { fontSize: '0.85rem', color: c.textMuted },
};

function scoreColor(pct: number) {
    return pct >= 85 ? c.success : pct >= 60 ? c.warning : c.error;
}

export function ExtractionsPage() {
    const { isMobile, isTablet } = useBreakpoint();
    const [extractions, setExtractions] = useState<ExtractionResult[]>([]);
    const [loading, setLoading]         = useState(true);

    useEffect(() => {
        fetchExtractions()
            .then(setExtractions)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={s.page}>
            <main style={{ ...s.main, padding: isMobile ? '1.25rem' : isTablet ? '1.75rem' : '2.5rem' }}>
                <div>
                    <div style={s.listHeader}>
                        <span style={s.listTitle}>Results</span>
                        {!loading && <span style={s.listCount}>{extractions.length} total</span>}
                        <Link to="/dashboard/extract" style={s.newBtn}>+ New extraction</Link>
                    </div>

                    {loading ? (
                        <div style={s.emptyState}>
                            <span style={s.emptyIcon}>⏳</span>
                            <span style={s.emptyTitle}>Loading…</span>
                        </div>
                    ) : extractions.length === 0 ? (
                        <div style={s.emptyState}>
                            <span style={s.emptyIcon}>🔍</span>
                            <span style={s.emptyTitle}>No extractions yet</span>
                            <span style={s.emptyHint}>
                                Go to Extract & Verify to run your first watermark extraction.
                            </span>
                        </div>
                    ) : (
                        <div style={s.grid}>
                            {extractions.map(ex => (
                                <div key={ex.id} style={s.card}>
                                    <div style={s.cardImagesRow}>
                                        <div>
                                            <div style={s.cardImageLabel}>Suspect</div>
                                            <img src={ex.suspect_url} alt="Suspect" style={s.cardImage} />
                                        </div>
                                        <div style={s.cardImageDivider}>
                                            <div style={s.cardImageLabel}>Extracted mark</div>
                                            <img src={ex.result_url} alt="Result" style={s.cardImage} />
                                        </div>
                                    </div>

                                    {ex.engraving && (
                                        <div style={s.cardBody}>
                                            <div style={s.engravingInfo}>
                                                <img
                                                    src={ex.engraving.engraved_url}
                                                    alt="Engraved"
                                                    style={s.engravingThumb}
                                                />
                                                <div style={s.engravingMeta}>
                                                    <span style={s.engravingName}>
                                                        {ex.engraving.image?.name ?? 'Image'}
                                                    </span>
                                                </div>
                                                {ex.engraving.watermark?.thumbnail_url && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: 'auto', flexShrink: 0 }}>
                                                        <span style={s.watermarkLabel}>Mark</span>
                                                        <img
                                                            src={ex.engraving.watermark.thumbnail_url}
                                                            alt={ex.engraving.watermark.name}
                                                            style={s.watermarkThumb}
                                                            title={ex.engraving.watermark.name}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            {ex.similarity_score != null && (() => {
                                                const pct = Math.round(ex.similarity_score! * 100);
                                                return (
                                                    <div style={s.scoreRow}>
                                                        <div style={s.scoreLabelRow}>
                                                            <span style={s.scoreLabel}>Similarity</span>
                                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: scoreColor(pct) }}>{pct}%</span>
                                                        </div>
                                                        <div style={s.progressBar}>
                                                            <div style={{ height: '100%', width: `${pct}%`, borderRadius: 2, background: scoreColor(pct) }} />
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
