import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchEngravings, deleteEngraving, type Engraving } from '../services/engravingApi';

const c = {
    bg: '#07090F',
    surface: '#0F1320',
    surfaceAlt: '#141929',
    border: '#1E2A45',
    accent: '#06B6D4',
    accentDark: '#0891B2',
    primary: '#6366F1',
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
    main: {
        flex: 1,
        padding: '2.5rem',
        maxWidth: 1280,
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    pageHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap' as const,
        gap: '1rem',
    },
    pageTitle: {
        fontSize: '1.4rem',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        margin: 0,
    },
    filtersRow: {
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap' as const,
        alignItems: 'center',
    },
    filterLabel: {
        fontSize: '0.78rem',
        color: c.textDim,
        fontWeight: 600,
    },
    filterChip: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.3rem 0.75rem',
        borderRadius: 100,
        background: `rgba(6,182,212,0.12)`,
        border: `1px solid rgba(6,182,212,0.3)`,
        color: c.accent,
        fontSize: '0.78rem',
        fontWeight: 600,
    },
    filterChipClose: {
        cursor: 'pointer',
        fontSize: '0.7rem',
        opacity: 0.7,
        background: 'none',
        border: 'none',
        color: c.accent,
        padding: 0,
        lineHeight: 1,
    },
    listHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
    },
    listTitle: {
        fontSize: '1rem',
        fontWeight: 700,
    },
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.25rem',
    },
    card: {
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        display: 'flex',
        flexDirection: 'column' as const,
    },
    cardThumb: {
        display: 'block',
        width: '100%',
        aspectRatio: '4/3',
        objectFit: 'cover' as const,
        background: c.surfaceAlt,
    },
    cardInfo: {
        padding: '0.75rem 1rem',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.2rem',
    },
    cardMeta: {
        fontSize: '0.7rem',
        color: c.textDim,
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase' as const,
    },
    cardName: {
        fontSize: '0.85rem',
        fontWeight: 600,
        color: c.text,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
    },
    cardSub: {
        fontSize: '0.75rem',
        color: c.textMuted,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
    },
    wmBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        marginTop: '0.4rem',
        padding: '0.35rem 0.6rem',
        borderRadius: 8,
        background: c.surfaceAlt,
        border: `1px solid ${c.border}`,
    },
    wmBadgeThumb: {
        width: 22,
        height: 22,
        borderRadius: 4,
        objectFit: 'cover' as const,
        flexShrink: 0,
        background: c.border,
        display: 'block',
    },
    wmBadgeLabel: {
        fontSize: '0.68rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase' as const,
        color: c.accent,
        flexShrink: 0,
    },
    wmBadgeName: {
        fontSize: '0.78rem',
        fontWeight: 500,
        color: c.textMuted,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
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
    cardActions: {
        padding: '0.5rem 0.75rem',
        borderTop: `1px solid ${c.border}`,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    deleteBtn: {
        padding: '0.3rem 0.75rem',
        borderRadius: 7,
        border: '1px solid rgba(248,113,113,0.3)',
        background: 'rgba(248,113,113,0.08)',
        color: '#F87171',
        fontSize: '0.75rem',
        fontWeight: 600,
        cursor: 'pointer',
    },
    deleteBtnDisabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
    },
};

export function EngravingsPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const imageId     = searchParams.get('image_id')     ?? undefined;
    const watermarkId = searchParams.get('watermark_id') ?? undefined;

    const [engravings, setEngravings] = useState<Engraving[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetchEngravings({ image_id: imageId, watermark_id: watermarkId })
            .then(setEngravings)
            .finally(() => setLoading(false));
    }, [imageId, watermarkId]);

    async function handleDelete(e: React.MouseEvent, id: string) {
        e.stopPropagation();
        setDeletingId(id);
        try {
            await deleteEngraving(id);
            setEngravings(prev => prev.filter(en => en.id !== id));
        } catch {
            // silently keep item on failure
        } finally {
            setDeletingId(null);
        }
    }

    function clearFilter(key: 'image_id' | 'watermark_id') {
        const next = new URLSearchParams(searchParams);
        next.delete(key);
        setSearchParams(next);
    }

    function openEngraving(e: Engraving) {
        navigate(`/dashboard/engravings/${e.id}`, {
            state: {
                engraving: e,
                image:     e.image,
                watermark: e.watermark,
            },
        });
    }

    const hasFilters = imageId || watermarkId;

    return (
        <div style={s.page}>


            <main style={s.main}>
                <div style={s.pageHeader}>
                    <h1 style={s.pageTitle}>Engravings</h1>

                    {hasFilters && (
                        <div style={s.filtersRow}>
                            <span style={s.filterLabel}>Filters:</span>
                            {imageId && (
                                <span style={s.filterChip}>
                                    image: {imageId.slice(0, 8)}…
                                    <button style={s.filterChipClose} onClick={() => clearFilter('image_id')}>✕</button>
                                </span>
                            )}
                            {watermarkId && (
                                <span style={s.filterChip}>
                                    watermark: {watermarkId.slice(0, 8)}…
                                    <button style={s.filterChipClose} onClick={() => clearFilter('watermark_id')}>✕</button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div>
                    <div style={s.listHeader}>
                        <span style={s.listTitle}>Results</span>
                        {!loading && <span style={s.listCount}>{engravings.length} total</span>}
                    </div>

                    {loading ? (
                        <div style={s.emptyState}>
                            <span style={s.emptyIcon}>⏳</span>
                            <span style={s.emptyTitle}>Loading…</span>
                        </div>
                    ) : engravings.length === 0 ? (
                        <div style={s.emptyState}>
                            <span style={s.emptyIcon}>🖨️</span>
                            <span style={s.emptyTitle}>No engravings yet</span>
                            <span style={s.emptyHint}>
                                {hasFilters
                                    ? 'No engravings match the current filters.'
                                    : 'Go to My Images and engrave an image with a watermark.'}
                            </span>
                        </div>
                    ) : (
                        <div style={s.grid}>
                            {engravings.map(e => (
                                <div key={e.id} style={s.card} onClick={() => openEngraving(e)}>
                                    <img
                                        src={e.engraved_url}
                                        alt="Engraved image"
                                        style={s.cardThumb}
                                    />
                                    <div style={s.cardInfo}>
                                        <span style={s.cardMeta}>Image</span>
                                        <span style={s.cardName} title={e.image?.name}>{e.image?.name ?? e.image_id}</span>
                                        {e.alpha != null && (
                                            <span style={{
                                                fontSize: '0.7rem',
                                                color: c.textDim,
                                                fontWeight: 500,
                                            }}>
                                                α = {e.alpha.toFixed(5)}
                                            </span>
                                        )}
                                        <div style={s.wmBadge}>
                                            {e.watermark?.thumbnail_url && (
                                                <img
                                                    src={e.watermark.thumbnail_url}
                                                    alt={e.watermark.name}
                                                    style={s.wmBadgeThumb}
                                                />
                                            )}
                                            <span style={s.wmBadgeLabel}>Mark</span>
                                            <span style={s.wmBadgeName} title={e.watermark?.name}>
                                                {e.watermark?.name ?? e.watermark_id}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={s.cardActions}>
                                        <button
                                            style={{
                                                ...s.deleteBtn,
                                                ...(deletingId === e.id ? s.deleteBtnDisabled : {}),
                                            }}
                                            disabled={deletingId === e.id}
                                            onClick={ev => handleDelete(ev, e.id)}
                                        >
                                            {deletingId === e.id ? '…' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
