import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../services/authApi';

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
    success: '#10B981',
    warning: '#F59E0B',
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

    // ── Topbar ───────────────────────────────────────────────────────────────
    topbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.1rem 2.5rem',
        borderBottom: `1px solid ${c.border}`,
        background: 'rgba(7,9,15,0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    logoLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        textDecoration: 'none',
    },
    logoMark: {
        width: 32,
        height: 32,
        borderRadius: 8,
        background: `linear-gradient(135deg, ${c.primary}, ${c.accent})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: '0.9rem',
        color: '#fff',
    },
    logoText: {
        fontSize: '1.05rem',
        fontWeight: 700,
        color: c.text,
        letterSpacing: '-0.02em',
    },
    topbarRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    userPill: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.4rem 0.9rem',
        borderRadius: 100,
        background: c.surface,
        border: `1px solid ${c.border}`,
        fontSize: '0.82rem',
        color: c.textMuted,
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${c.primary}, ${c.accent})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.65rem',
        fontWeight: 700,
        color: '#fff',
    },
    logoutBtn: {
        padding: '0.45rem 1rem',
        borderRadius: 8,
        border: `1px solid ${c.border}`,
        background: 'transparent',
        color: c.textMuted,
        fontSize: '0.82rem',
        fontWeight: 500,
        cursor: 'pointer',
    },

    // ── Main content ─────────────────────────────────────────────────────────
    main: {
        flex: 1,
        padding: '2.5rem 2.5rem',
        maxWidth: 1280,
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
    },
    pageHeader: {
        marginBottom: '2.5rem',
    },
    pageLabel: {
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: c.primary,
        marginBottom: '0.4rem',
    },
    pageTitle: {
        fontSize: '1.75rem',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        margin: '0 0 0.4rem',
    },
    pageSub: {
        fontSize: '0.9rem',
        color: c.textMuted,
    },

    // ── Stats row ────────────────────────────────────────────────────────────
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '2.5rem',
    },
    statCard: {
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
    },
    statLabel: {
        fontSize: '0.75rem',
        color: c.textDim,
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: 800,
        letterSpacing: '-0.04em',
        color: c.text,
    },
    statSub: {
        fontSize: '0.78rem',
        color: c.textMuted,
    },

    // ── Cards grid ───────────────────────────────────────────────────────────
    cardsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
    },
    card: {
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: 18,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: c.text,
        transition: 'border-color 0.2s, transform 0.2s',
    },
    cardAccentBar: (color: string): React.CSSProperties => ({
        height: 3,
        background: color,
    }),
    cardBody: {
        padding: '1.5rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    cardIconWrap: (color: string): React.CSSProperties => ({
        width: 44,
        height: 44,
        borderRadius: 12,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.3rem',
        marginBottom: '1.1rem',
    }),
    cardTitle: {
        fontSize: '1.05rem',
        fontWeight: 700,
        marginBottom: '0.4rem',
    },
    cardDesc: {
        fontSize: '0.85rem',
        color: c.textMuted,
        lineHeight: 1.6,
        marginBottom: '1.4rem',
    },

    // ── Thumbnail strip ──────────────────────────────────────────────────────
    thumbStrip: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.5rem',
        marginBottom: '1.4rem',
    },
    thumb: (i: number): React.CSSProperties => ({
        aspectRatio: '1',
        borderRadius: 8,
        background: [
            `linear-gradient(135deg, #1a2040, #0d1530)`,
            `linear-gradient(135deg, #1a2840, #0a1a2e)`,
            `linear-gradient(135deg, #1e1a40, #120d30)`,
            `linear-gradient(135deg, #1a3040, #0d2030)`,
        ][i % 4],
        border: `1px solid ${c.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.1rem',
        color: c.textDim,
    }),
    thumbLabel: {
        fontSize: '0.7rem',
        color: c.textDim,
        marginBottom: '1rem',
        fontStyle: 'italic',
    },

    // ── Card CTA ─────────────────────────────────────────────────────────────
    cardCta: (color: string): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1rem',
        borderRadius: 10,
        background: `${color}12`,
        border: `1px solid ${color}28`,
        color,
        fontSize: '0.82rem',
        fontWeight: 600,
        marginTop: 'auto',
    }),
};

const stats = [
    { label: 'Total watermarks', value: '0', sub: 'Embed your first image' },
    { label: 'Extractions run', value: '0', sub: 'No extractions yet' },
    { label: 'Images protected', value: '0', sub: 'Upload to get started' },
];

const THUMB_ICONS = ['🖼️', '📷', '🌆', '🎨'];

function ThumbStrip() {
    return (
        <>
            <div style={s.thumbStrip}>
                {THUMB_ICONS.map((icon, i) => (
                    <div key={i} style={s.thumb(i)}>{icon}</div>
                ))}
            </div>
            <p style={s.thumbLabel}>4 most recent — placeholder</p>
        </>
    );
}

export function DashboardPage() {
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
        } finally {
            localStorage.removeItem('token');
            navigate('/login');
        }
    }

    return (
        <div style={s.page}>
            {/* ── Topbar ── */}
            <header style={s.topbar}>
                <Link to="/" style={s.logoLink}>
                    <div style={s.logoMark}>W</div>
                    <span style={s.logoText}>WaterMark</span>
                </Link>
                <div style={s.topbarRight}>
                    <div style={s.userPill}>
                        <div style={s.avatar}>U</div>
                        My account
                    </div>
                    <button style={s.logoutBtn} onClick={handleLogout}>Log out</button>
                </div>
            </header>

            {/* ── Main ── */}
            <main style={s.main}>
                <div style={s.pageHeader}>
                    <div style={s.pageLabel}>Overview</div>
                    <h1 style={s.pageTitle}>Dashboard</h1>
                    <p style={s.pageSub}>Manage your watermarks, protect new images, and verify ownership.</p>
                </div>

                {/* Stats */}
                <div style={s.statsRow}>
                    {stats.map(st => (
                        <div key={st.label} style={s.statCard}>
                            <span style={s.statLabel}>{st.label}</span>
                            <span style={s.statValue}>{st.value}</span>
                            <span style={s.statSub}>{st.sub}</span>
                        </div>
                    ))}
                </div>

                {/* Action cards */}
                <div style={s.cardsGrid}>

                    {/* 1 — My Watermarks */}
                    <Link to="/dashboard/watermarks" style={s.card}>
                        <div style={s.cardAccentBar(`linear-gradient(90deg, ${c.primary}, ${c.primaryLight})`)} />
                        <div style={s.cardBody}>
                            <div style={s.cardIconWrap(c.primary)}>🗂️</div>
                            <div style={s.cardTitle}>My Watermarks</div>
                            <div style={s.cardDesc}>
                                Browse and manage all your watermarked images. Review embedded
                                payloads, download protected files, or remove entries.
                            </div>
                            <ThumbStrip />
                            <div style={s.cardCta(c.primaryLight)}>
                                <span>View all watermarks</span>
                                <span>→</span>
                            </div>
                        </div>
                    </Link>

                    {/* 2 — Embed watermark */}
                    <Link to="/dashboard/embed" style={s.card}>
                        <div style={s.cardAccentBar(`linear-gradient(90deg, ${c.accent}, #38BDF8)`)} />
                        <div style={s.cardBody}>
                            <div style={s.cardIconWrap(c.accent)}>➕</div>
                            <div style={s.cardTitle}>Embed Watermark</div>
                            <div style={s.cardDesc}>
                                Upload an image and a watermark pattern. We'll invisibly encode
                                the mark and return a protected file that looks identical to the original.
                            </div>
                            <ThumbStrip />
                            <div style={s.cardCta(c.accent)}>
                                <span>Upload & embed</span>
                                <span>→</span>
                            </div>
                        </div>
                    </Link>

                    {/* 3 — Extract watermark */}
                    <Link to="/dashboard/extract" style={s.card}>
                        <div style={s.cardAccentBar(`linear-gradient(90deg, ${c.success}, #34D399)`)} />
                        <div style={s.cardBody}>
                            <div style={s.cardIconWrap(c.success)}>🔍</div>
                            <div style={s.cardTitle}>Extract & Verify</div>
                            <div style={s.cardDesc}>
                                Upload a suspected copy alongside the original. WaterMark will
                                extract the hidden payload to confirm ownership — even after
                                heavy edits or compression.
                            </div>
                            <div style={s.cardCta(c.success)}>
                                <span>Run extraction</span>
                                <span>→</span>
                            </div>
                        </div>
                    </Link>

                </div>
            </main>
        </div>
    );
}
