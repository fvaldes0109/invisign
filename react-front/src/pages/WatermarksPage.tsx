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
        background: `rgba(99,102,241,0.1)`,
        border: `1px solid rgba(99,102,241,0.25)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
    },
    badge: {
        display: 'inline-flex',
        padding: '0.3rem 0.9rem',
        borderRadius: 100,
        background: `rgba(99,102,241,0.1)`,
        border: `1px solid rgba(99,102,241,0.25)`,
        color: c.primaryLight,
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
        maxWidth: 420,
        margin: 0,
    },
    placeholderGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 80px)',
        gap: '0.75rem',
        marginTop: '0.5rem',
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
    ctaLink: {
        padding: '0.75rem 1.75rem',
        borderRadius: 10,
        background: `linear-gradient(135deg, ${c.primary}, ${c.primaryDark})`,
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.9rem',
        textDecoration: 'none',
        boxShadow: `0 0 20px rgba(99,102,241,0.35)`,
    },
};

export function WatermarksPage() {
    return (
        <div style={s.page}>
            <header style={s.topbar}>
                <Link to="/dashboard" style={s.backLink}>← Dashboard</Link>
                <span style={s.topbarTitle}>My Watermarks</span>
            </header>

            <main style={s.main}>
                <div style={s.iconWrap}>🗂️</div>
                <span style={s.badge}>Coming soon</span>
                <h1 style={s.title}>Your watermarked library</h1>
                <p style={s.sub}>
                    All your protected images will appear here. Browse embedded payloads,
                    download files, and manage your watermark history.
                </p>
                <div style={s.placeholderGrid}>
                    {['🖼️', '📷', '🌆', '🎨'].map((icon, i) => (
                        <div key={i} style={s.placeholderThumb(i)}>{icon}</div>
                    ))}
                </div>
                <Link to="/dashboard/embed" style={s.ctaLink}>
                    Embed your first watermark →
                </Link>
            </main>
        </div>
    );
}
