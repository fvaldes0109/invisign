import { useLocation, useNavigate } from 'react-router-dom';
import { deleteEngraving, type Engraving } from '../services/engravingApi';
import type { UserImage } from '../services/imageApi';
import type { Watermark } from '../services/watermarkApi';
import { useEffect, useState } from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface LocationState {
    engraving: Engraving;
    image: UserImage;
    watermark: Watermark;
}

const c = {
    bg: '#07090F',
    surface: '#0F1320',
    surfaceAlt: '#141929',
    border: '#1E2A45',
    accent: '#06B6D4',
    accentDark: '#0891B2',
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
        maxWidth: 1100,
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
        background: `rgba(6,182,212,0.1)`,
        border: `1px solid rgba(6,182,212,0.25)`,
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
    pageSub: {
        fontSize: '0.88rem',
        color: c.textMuted,
        margin: 0,
    },
    resultCard: {
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 18,
        overflow: 'hidden',
    },
    resultImg: {
        display: 'block',
        width: '100%',
        maxHeight: '65vh',
        objectFit: 'contain' as const,
        background: c.surfaceAlt,
    },
    sourcesRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    sourceCard: {
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column' as const,
    },
    sourceImg: {
        display: 'block',
        width: '100%',
        aspectRatio: '16/9',
        objectFit: 'cover' as const,
    },
    sourceInfo: {
        padding: '0.75rem 1rem',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.2rem',
    },
    sourceLabel: {
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
        color: c.accent,
    },
    sourceName: {
        fontSize: '0.88rem',
        fontWeight: 600,
        color: c.text,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
    },
    downloadBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.7rem 1.5rem',
        borderRadius: 10,
        border: 'none',
        background: `linear-gradient(135deg, ${c.accent}, ${c.accentDark})`,
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.9rem',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: `0 0 20px rgba(6,182,212,0.3)`,
        alignSelf: 'flex-start',
    },
    actionsRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap' as const,
    },
    attackBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.7rem 1.5rem',
        borderRadius: 10,
        border: `1px solid rgba(6,182,212,0.35)`,
        background: 'rgba(6,182,212,0.08)',
        color: c.accent,
        fontWeight: 700,
        fontSize: '0.9rem',
        cursor: 'pointer',
        alignSelf: 'flex-start',
    },
    deleteBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.7rem 1.5rem',
        borderRadius: 10,
        border: '1px solid rgba(248,113,113,0.35)',
        background: 'rgba(248,113,113,0.08)',
        color: '#F87171',
        fontWeight: 700,
        fontSize: '0.9rem',
        cursor: 'pointer',
        alignSelf: 'flex-start',
    },
    deleteBtnDisabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
    },
};

export function EngravingResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isMobile, isTablet } = useBreakpoint();
    const state = location.state as LocationState | null;
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!state?.engraving) {
            navigate('/dashboard/images', { replace: true });
        }
    }, [state, navigate]);

    if (!state?.engraving) return null;

    const { engraving, image, watermark } = state;

    async function handleDelete() {
        setDeleting(true);
        try {
            await deleteEngraving(engraving.id);
            navigate('/dashboard/engravings', { replace: true });
        } catch {
            setDeleting(false);
        }
    }

    return (
        <div style={s.page}>
            <main style={{ ...s.main, padding: isMobile ? '1.25rem' : isTablet ? '1.75rem' : '2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={s.badge}>Watermark embedded</span>
                    <h1 style={s.pageTitle}>{image.name}</h1>
                    <p style={s.pageSub}>
                        The watermark <strong style={{ color: c.text }}>{watermark.name}</strong> has been invisibly embedded. The result looks identical to the original.
                    </p>
                </div>

                <div style={s.resultCard}>
                    <img
                        src={engraving.engraved_url}
                        alt="Engraved result"
                        style={s.resultImg}
                    />
                </div>

                <div style={s.actionsRow}>
                    <a
                        href={engraving.engraved_url}
                        download
                        style={s.downloadBtn}
                    >
                        ↓ Download engraved image
                    </a>
                    <button
                        style={s.attackBtn}
                        onClick={() =>
                            navigate(`/dashboard/engravings/${engraving.id}/attack-test`, {
                                state: { engraving, image, watermark },
                            })
                        }
                    >
                        Test attacks
                    </button>
                    <button
                        style={{
                            ...s.deleteBtn,
                            ...(deleting ? s.deleteBtnDisabled : {}),
                        }}
                        disabled={deleting}
                        onClick={handleDelete}
                    >
                        {deleting ? '…' : 'Delete engraving'}
                    </button>
                </div>

                <div style={{ ...s.sourcesRow, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                    <div style={s.sourceCard}>
                        <img src={image.image_url} alt={image.name} style={s.sourceImg} />
                        <div style={s.sourceInfo}>
                            <span style={s.sourceLabel}>Original image</span>
                            <span style={s.sourceName} title={image.name}>{image.name}</span>
                        </div>
                    </div>
                    <div style={s.sourceCard}>
                        <img src={watermark.image_url} alt={watermark.name} style={s.sourceImg} />
                        <div style={s.sourceInfo}>
                            <span style={s.sourceLabel}>Watermark used</span>
                            <span style={s.sourceName} title={watermark.name}>{watermark.name}</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
