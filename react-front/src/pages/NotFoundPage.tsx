import { Link } from 'react-router-dom';

const colors = {
    bg: '#07090F',
    surface: '#0F1320',
    border: '#1E2A45',
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4338CA',
    accent: '#06B6D4',
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    textDim: '#64748B',
};

const styles: Record<string, React.CSSProperties> = {
    page: {
        background: colors.bg,
        color: colors.text,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },

    // ── Navbar ──────────────────────────────────────────────────────────────
    nav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 6%',
        borderBottom: `1px solid ${colors.border}`,
        background: 'rgba(7, 9, 15, 0.85)',
        backdropFilter: 'blur(12px)',
    },
    navLogo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        textDecoration: 'none',
    },
    navLogoMark: {
        width: 34,
        height: 34,
        borderRadius: 8,
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        fontWeight: 700,
        color: '#fff',
    },
    navLogoText: {
        fontSize: '1.1rem',
        fontWeight: 700,
        color: colors.text,
        letterSpacing: '-0.02em',
    },
    navBack: {
        padding: '0.5rem 1.25rem',
        borderRadius: 8,
        border: `1px solid ${colors.border}`,
        background: 'transparent',
        color: colors.textMuted,
        fontWeight: 500,
        fontSize: '0.875rem',
        cursor: 'pointer',
        textDecoration: 'none',
    },

    // ── Body ─────────────────────────────────────────────────────────────────
    body: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 6%',
        position: 'relative' as const,
        overflow: 'hidden',
    },

    // Background glow blobs
    glowLeft: {
        position: 'absolute' as const,
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)`,
        top: '50%',
        left: '20%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none' as const,
    },
    glowRight: {
        position: 'absolute' as const,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)`,
        top: '40%',
        right: '20%',
        transform: 'translate(50%, -50%)',
        pointerEvents: 'none' as const,
    },

    content: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        textAlign: 'center' as const,
        gap: '0',
        position: 'relative' as const,
        zIndex: 1,
        maxWidth: 600,
    },

    // Visual area: big 404 with image metaphor
    visualWrap: {
        position: 'relative' as const,
        marginBottom: '2.5rem',
    },
    bigNum: {
        fontSize: 'clamp(7rem, 18vw, 12rem)',
        fontWeight: 900,
        letterSpacing: '-0.06em',
        lineHeight: 1,
        background: `linear-gradient(135deg, ${colors.primary}40, ${colors.accent}30)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        userSelect: 'none' as const,
        position: 'relative' as const,
    },
    brokenImageCard: {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 160,
        height: 120,
        borderRadius: 14,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        boxShadow: `0 16px 48px rgba(0,0,0,0.5)`,
    },
    brokenImageIcon: {
        fontSize: '2.2rem',
        filter: 'grayscale(1) opacity(0.6)',
    },
    brokenImageLabel: {
        fontSize: '0.7rem',
        color: colors.textDim,
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
        fontWeight: 600,
    },
    brokenBar: {
        width: 80,
        height: 4,
        borderRadius: 2,
        background: colors.border,
        overflow: 'hidden',
    },
    brokenBarFill: {
        width: '35%',
        height: '100%',
        background: `linear-gradient(90deg, #EF4444, #F97316)`,
        borderRadius: 2,
    },

    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.3rem 0.9rem',
        borderRadius: 100,
        background: `rgba(99,102,241,0.12)`,
        border: `1px solid rgba(99,102,241,0.3)`,
        color: colors.primaryLight,
        fontSize: '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase' as const,
        marginBottom: '1rem',
    },
    title: {
        fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        margin: '0 0 1rem',
    },
    sub: {
        fontSize: '1rem',
        color: colors.textMuted,
        lineHeight: 1.7,
        marginBottom: '2.5rem',
    },

    actions: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap' as const,
        marginBottom: '3rem',
    },
    btnPrimary: {
        padding: '0.8rem 2rem',
        borderRadius: 10,
        border: 'none',
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.95rem',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: `0 0 28px rgba(99,102,241,0.4)`,
        display: 'inline-block',
    },
    btnOutline: {
        padding: '0.8rem 2rem',
        borderRadius: 10,
        border: `1px solid ${colors.border}`,
        background: 'transparent',
        color: colors.text,
        fontWeight: 600,
        fontSize: '0.95rem',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-block',
    },

    quickLinks: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        flexWrap: 'wrap' as const,
        justifyContent: 'center',
    },
    quickLinksLabel: {
        fontSize: '0.82rem',
        color: colors.textDim,
        marginRight: '0.25rem',
    },
    quickLink: {
        fontSize: '0.82rem',
        color: colors.textMuted,
        textDecoration: 'none',
        padding: '0.25rem 0.7rem',
        borderRadius: 6,
        border: `1px solid ${colors.border}`,
        background: colors.surface,
        transition: 'border-color 0.2s',
    },

    // ── Footer ───────────────────────────────────────────────────────────────
    footer: {
        padding: '1.75rem 6%',
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'center',
        color: colors.textDim,
        fontSize: '0.82rem',
    },
};

export function NotFoundPage() {
    return (
        <div style={styles.page}>
            {/* ── Navbar ── */}
            <nav style={styles.nav}>
                <Link to="/" style={styles.navLogo}>
                    <div style={styles.navLogoMark}>W</div>
                    <span style={styles.navLogoText}>WaterMark</span>
                </Link>
                <Link to="/" style={styles.navBack}>← Back to home</Link>
            </nav>

            {/* ── Main body ── */}
            <div style={styles.body}>
                <div style={styles.glowLeft} />
                <div style={styles.glowRight} />

                <div style={styles.content}>
                    {/* Big 404 with floating broken-image card */}
                    <div style={styles.visualWrap}>
                        <div style={styles.bigNum}>404</div>
                        <div style={styles.brokenImageCard}>
                            <div style={styles.brokenImageIcon}>🖼️</div>
                            <div style={styles.brokenBar}>
                                <div style={styles.brokenBarFill} />
                            </div>
                            <div style={styles.brokenImageLabel}>Not found</div>
                        </div>
                    </div>

                    <div style={styles.badge}>Page missing</div>

                    <h1 style={styles.title}>We couldn't find this page</h1>

                    <p style={styles.sub}>
                        The page you're looking for doesn't exist or has been moved.
                        Don't worry, your watermarks are still safe. Head back home
                        and pick up where you left off.
                    </p>

                    <div style={styles.actions}>
                        <Link to="/" style={styles.btnPrimary}>Go home</Link>
                        <Link to="/dashboard" style={styles.btnOutline}>Open dashboard</Link>
                    </div>

                    <div style={styles.quickLinks}>
                        <span style={styles.quickLinksLabel}>Quick links:</span>
                        <Link to="/login" style={styles.quickLink}>Log in</Link>
                        <Link to="/register" style={styles.quickLink}>Register</Link>
                        <Link to="/dashboard" style={styles.quickLink}>Dashboard</Link>
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <footer style={styles.footer}>
                © 2026 WaterMark · Invisible watermarking for the modern web.
            </footer>
        </div>
    );
}
