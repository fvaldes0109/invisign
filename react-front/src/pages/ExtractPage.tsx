import { Link } from 'react-router-dom';

const c = {
    bg: '#07090F',
    surface: '#0F1320',
    surfaceAlt: '#141929',
    border: '#1E2A45',
    primary: '#6366F1',
    primaryLight: '#818CF8',
    accent: '#06B6D4',
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    textDim: '#64748B',
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
        background: `rgba(16,185,129,0.1)`,
        border: `1px solid rgba(16,185,129,0.25)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
    },
    badge: {
        display: 'inline-flex',
        padding: '0.3rem 0.9rem',
        borderRadius: 100,
        background: `rgba(16,185,129,0.1)`,
        border: `1px solid rgba(16,185,129,0.25)`,
        color: c.success,
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
        maxWidth: 460,
        margin: 0,
    },
    uploadRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        width: '100%',
        maxWidth: 560,
    },
    uploadZone: {
        padding: '1.75rem 1.25rem',
        borderRadius: 14,
        border: `2px dashed ${c.border}`,
        background: c.surfaceAlt,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        color: c.textDim,
    },
    uploadIcon: { fontSize: '1.8rem' },
    uploadLabel: {
        fontSize: '0.78rem',
        fontWeight: 700,
        color: c.textMuted,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.04em',
    },
    uploadSub: { fontSize: '0.72rem', color: c.textDim },
    resultBox: {
        width: '100%',
        maxWidth: 560,
        padding: '1.25rem 1.5rem',
        borderRadius: 14,
        background: c.surface,
        border: `1px solid ${c.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        textAlign: 'left',
    },
    resultLabel: {
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
        color: c.textDim,
    },
    resultRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.85rem',
    },
    resultKey: { color: c.textMuted },
    resultVal: (color: string): React.CSSProperties => ({
        fontWeight: 700,
        color,
        fontFamily: 'monospace',
    }),
    ctaBtn: {
        padding: '0.75rem 1.75rem',
        borderRadius: 10,
        background: `linear-gradient(135deg, ${c.success}, #059669)`,
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.9rem',
        border: 'none',
        cursor: 'pointer',
        boxShadow: `0 0 20px rgba(16,185,129,0.3)`,
        opacity: 0.5,
    },
    hint: {
        fontSize: '0.78rem',
        color: c.textDim,
        fontStyle: 'italic',
    },
};

export function ExtractPage() {
    return (
        <div style={s.page}>
            <header style={s.topbar}>
                <Link to="/dashboard" style={s.backLink}>← Dashboard</Link>
                <span style={s.topbarTitle}>Extract & Verify</span>
            </header>

            <main style={s.main}>
                <div style={s.iconWrap}>🔍</div>
                <span style={s.badge}>Coming soon</span>
                <h1 style={s.title}>Extract & verify ownership</h1>
                <p style={s.sub}>
                    Upload a suspected copy alongside the original image and watermark pattern.
                    WaterMark will extract the hidden payload to confirm ownership — even after
                    heavy compression, cropping, or colour edits.
                </p>

                <div style={s.uploadRow}>
                    <div style={s.uploadZone}>
                        <span style={s.uploadIcon}>📄</span>
                        <span style={s.uploadLabel}>Original image</span>
                        <span style={s.uploadSub}>The clean source file</span>
                    </div>
                    <div style={s.uploadZone}>
                        <span style={s.uploadIcon}>🔎</span>
                        <span style={s.uploadLabel}>Suspected copy</span>
                        <span style={s.uploadSub}>The file to analyse</span>
                    </div>
                </div>

                {/* Placeholder result panel */}
                <div style={s.resultBox}>
                    <span style={s.resultLabel}>Extraction result — placeholder</span>
                    <div style={s.resultRow}>
                        <span style={s.resultKey}>Owner payload</span>
                        <span style={s.resultVal(c.primaryLight)}>—</span>
                    </div>
                    <div style={s.resultRow}>
                        <span style={s.resultKey}>Timestamp</span>
                        <span style={s.resultVal(c.accent)}>—</span>
                    </div>
                    <div style={s.resultRow}>
                        <span style={s.resultKey}>Match confidence</span>
                        <span style={s.resultVal(c.success)}>—</span>
                    </div>
                </div>

                <button style={s.ctaBtn} disabled>Run extraction</button>
                <span style={s.hint}>Upload functionality will be wired up here.</span>
            </main>
        </div>
    );
}
