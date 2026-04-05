import { Link } from 'react-router-dom';

const c = {
    bg: '#07090F',
    surface: '#0F1320',
    surfaceAlt: '#141929',
    border: '#1E2A45',
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4338CA',
    accent: '#06B6D4',
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
    topbar: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.1rem 2.5rem',
        borderBottom: `1px solid ${c.border}`,
        background: 'rgba(7,9,15,0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    backLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        textDecoration: 'none',
        color: c.textMuted,
        fontSize: '0.85rem',
        fontWeight: 500,
        padding: '0.4rem 0.8rem',
        borderRadius: 8,
        border: `1px solid ${c.border}`,
        background: c.surface,
    },
    topbarTitle: {
        fontSize: '1rem',
        fontWeight: 700,
        color: c.text,
        letterSpacing: '-0.02em',
    },
    main: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2.5rem',
        gap: '1.5rem',
        textAlign: 'center',
    },
    iconWrap: {
        width: 72,
        height: 72,
        borderRadius: 20,
        background: `rgba(6,182,212,0.1)`,
        border: `1px solid rgba(6,182,212,0.25)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
    },
    badge: {
        display: 'inline-flex',
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
    title: {
        fontSize: '1.75rem',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        margin: 0,
    },
    sub: {
        fontSize: '0.95rem',
        color: c.textMuted,
        lineHeight: 1.7,
        maxWidth: 440,
        margin: 0,
    },
    recentLabel: {
        fontSize: '0.75rem',
        fontWeight: 600,
        color: c.textDim,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
    },
    placeholderGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 80px)',
        gap: '0.75rem',
    },
    placeholderThumb: (i: number): React.CSSProperties => ({
        width: 80,
        height: 80,
        borderRadius: 10,
        border: `1px dashed ${c.border}`,
        background: c.surfaceAlt,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.4rem',
        color: c.textDim,
    }),
    uploadZone: {
        width: '100%',
        maxWidth: 480,
        padding: '2.5rem',
        borderRadius: 16,
        border: `2px dashed ${c.border}`,
        background: c.surfaceAlt,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        color: c.textDim,
        fontSize: '0.9rem',
    },
    uploadIcon: {
        fontSize: '2.5rem',
    },
    uploadText: {
        fontWeight: 600,
        color: c.textMuted,
    },
    uploadSub: {
        fontSize: '0.8rem',
        color: c.textDim,
    },
    ctaBtn: {
        padding: '0.75rem 1.75rem',
        borderRadius: 10,
        background: `linear-gradient(135deg, ${c.accent}, #0891B2)`,
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.9rem',
        border: 'none',
        cursor: 'pointer',
        boxShadow: `0 0 20px rgba(6,182,212,0.3)`,
        opacity: 0.5,
    },
    hint: {
        fontSize: '0.78rem',
        color: c.textDim,
        fontStyle: 'italic',
    },
};

export function EmbedPage() {
    return (
        <div style={s.page}>
            <header style={s.topbar}>
                <Link to="/dashboard" style={s.backLink}>← Dashboard</Link>
                <span style={s.topbarTitle}>Embed Watermark</span>
            </header>

            <main style={s.main}>
                <div style={s.iconWrap}>➕</div>
                <span style={s.badge}>Coming soon</span>
                <h1 style={s.title}>Embed an invisible watermark</h1>
                <p style={s.sub}>
                    Upload your image and a watermark pattern. The mark will be encoded
                    invisibly — the output file looks identical to the original but carries
                    your ownership proof.
                </p>

                <div style={s.uploadZone}>
                    <span style={s.uploadIcon}>📂</span>
                    <span style={s.uploadText}>Drop your image here</span>
                    <span style={s.uploadSub}>PNG, JPEG, WebP, TIFF · up to 50 MB</span>
                </div>

                <div>
                    <div style={s.recentLabel}>Recently embedded</div>
                </div>
                <div style={s.placeholderGrid}>
                    {['🖼️', '📷', '🌆', '🎨'].map((icon, i) => (
                        <div key={i} style={s.placeholderThumb(i)}>{icon}</div>
                    ))}
                </div>

                <button style={s.ctaBtn} disabled>Embed watermark</button>
                <span style={s.hint}>Upload functionality will be wired up here.</span>
            </main>
        </div>
    );
}
