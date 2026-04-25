import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authApi';

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
    error: '#F87171',
    errorBg: 'rgba(248,113,113,0.08)',
    errorBorder: 'rgba(248,113,113,0.25)',
};

type StyleMap = Record<string, React.CSSProperties | ((color: string) => React.CSSProperties)>;

const s = {
    page: {
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        background: c.bg,
        color: c.text,
    },

    // ── Left panel ──────────────────────────────────────────────────────────
    left: {
        background: c.surface,
        borderRight: `1px solid ${c.border}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
    },
    leftGlow: {
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)`,
        bottom: '-10%',
        left: '-10%',
        pointerEvents: 'none',
    },
    leftGlow2: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%)`,
        top: '10%',
        right: '-5%',
        pointerEvents: 'none',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        textDecoration: 'none',
        position: 'relative',
        zIndex: 1,
    },
    logoMark: {
        width: 36,
        height: 36,
        borderRadius: 9,
        background: `linear-gradient(135deg, ${c.primary}, ${c.accent})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: '1rem',
        color: '#fff',
    },
    logoText: {
        fontSize: '1.15rem',
        fontWeight: 700,
        color: c.text,
        letterSpacing: '-0.02em',
    },
    leftContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '2rem',
        position: 'relative',
        zIndex: 1,
    },
    leftTitle: {
        fontSize: 'clamp(1.8rem, 2.5vw, 2.6rem)',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        lineHeight: 1.2,
    },
    leftTitleGrad: {
        background: `linear-gradient(135deg, ${c.primaryLight}, ${c.accent})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    leftSub: {
        fontSize: '0.95rem',
        color: c.textMuted,
        lineHeight: 1.7,
        maxWidth: 360,
    },
    featureList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.875rem',
        color: c.textMuted,
    },
    featureDot: {
        width: 28,
        height: 28,
        borderRadius: 8,
        background: `rgba(99,102,241,0.12)`,
        border: `1px solid rgba(99,102,241,0.25)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        flexShrink: 0,
    },
    // Decorative card at the bottom of left panel
    demoCard: {
        background: c.surfaceAlt,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        padding: '1.2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        position: 'relative',
        zIndex: 1,
    },
    demoCardRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    demoCardLabel: { fontSize: '0.75rem', color: c.textDim },
    demoCardVal: (color: string): React.CSSProperties => ({
        fontSize: '0.75rem', fontWeight: 700, color,
    }),
    progressBar: {
        height: 3,
        borderRadius: 2,
        background: c.border,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        width: '94%',
        background: `linear-gradient(90deg, ${c.primary}, ${c.accent})`,
        borderRadius: 2,
    },

    // ── Right panel (form) ────────────────────────────────────────────────────
    right: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 4rem',
    },
    formWrap: {
        width: '100%',
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
    },
    formHeader: {
        marginBottom: '2rem',
    },
    formBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.25rem 0.8rem',
        borderRadius: 100,
        background: `rgba(99,102,241,0.1)`,
        border: `1px solid rgba(99,102,241,0.25)`,
        color: c.primaryLight,
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
        marginBottom: '1rem',
    },
    formTitle: {
        fontSize: '1.75rem',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        margin: '0 0 0.4rem',
    },
    formSub: {
        fontSize: '0.875rem',
        color: c.textMuted,
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        marginBottom: '1.1rem',
    },
    label: {
        fontSize: '0.8rem',
        fontWeight: 600,
        color: c.textMuted,
        letterSpacing: '0.02em',
    },
    input: {
        padding: '0.7rem 1rem',
        borderRadius: 10,
        border: `1px solid ${c.border}`,
        background: c.surfaceAlt,
        color: c.text,
        fontSize: '0.9rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        width: '100%',
        boxSizing: 'border-box' as const,
    },
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.75rem 1rem',
        borderRadius: 10,
        background: c.errorBg,
        border: `1px solid ${c.errorBorder}`,
        color: c.error,
        fontSize: '0.85rem',
        marginBottom: '1.1rem',
    },
    submitBtn: {
        width: '100%',
        padding: '0.8rem',
        borderRadius: 10,
        border: 'none',
        background: `linear-gradient(135deg, ${c.primary}, ${c.primaryDark})`,
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.95rem',
        cursor: 'pointer',
        boxShadow: `0 0 24px rgba(99,102,241,0.4)`,
        marginTop: '0.5rem',
        transition: 'opacity 0.2s',
    },
    submitBtnDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    switchText: {
        marginTop: '1.5rem',
        textAlign: 'center' as const,
        fontSize: '0.85rem',
        color: c.textMuted,
    },
    switchLink: {
        color: c.primaryLight,
        textDecoration: 'none',
        fontWeight: 600,
    },
    divider: {
        height: 1,
        background: c.border,
        margin: '1.5rem 0',
    },
} satisfies StyleMap;

const features = [
    { icon: '🔒', text: 'Invisible watermarks, zero visual impact' },
    { icon: '🛡️', text: 'Survives compression, cropping & edits' },
    { icon: '🎬', text: 'Works on images and video content' },
];

export function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { token } = await login(email, password);
            localStorage.setItem('token', token);
            navigate('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={s.page}>
            {/* ── Left branding panel ── */}
            <div style={s.left}>
                <div style={s.leftGlow} />
                <div style={s.leftGlow2} />

                <Link to="/" style={s.logo}>
                    <div style={s.logoMark}>W</div>
                    <span style={s.logoText}>Invisign</span>
                </Link>

                <div style={s.leftContent}>
                    <div>
                        <h2 style={s.leftTitle}>
                            Protect your work with{' '}
                            <span style={s.leftTitleGrad}>invisible marks</span>
                        </h2>
                        <p style={s.leftSub}>
                            Embed imperceptible copyright watermarks into images and video.
                            Prove ownership anywhere, anytime.
                        </p>
                    </div>

                    <div style={s.featureList}>
                        {features.map(f => (
                            <div key={f.text} style={s.featureItem}>
                                <div style={s.featureDot}>{f.icon}</div>
                                <span>{f.text}</span>
                            </div>
                        ))}
                    </div>

                    <div style={s.demoCard}>
                        <div style={s.demoCardRow}>
                            <span style={s.demoCardLabel}>Payload</span>
                            <span style={s.demoCardVal(c.primaryLight)}>owner:usr_9f3a</span>
                        </div>
                        <div style={s.demoCardRow}>
                            <span style={s.demoCardLabel}>Imperceptibility</span>
                            <span style={s.demoCardVal('#10B981')}>PSNR 48.3 dB</span>
                        </div>
                        <div>
                            <div style={{ ...s.demoCardRow, marginBottom: '0.4rem' }}>
                                <span style={s.demoCardLabel}>Robustness</span>
                                <span style={s.demoCardVal(c.accent)}>94 / 100</span>
                            </div>
                            <div style={s.progressBar}>
                                <div style={s.progressFill} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div style={s.right}>
                <div style={s.formWrap}>
                    <div style={s.formHeader}>
                        <div style={s.formBadge}>Welcome back</div>
                        <h1 style={s.formTitle}>Sign in</h1>
                        <p style={s.formSub}>Enter your credentials to access your dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={s.formGroup}>
                            <label htmlFor="email" style={s.label}>Email address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                style={s.input}
                            />
                        </div>

                        <div style={s.formGroup}>
                            <label htmlFor="password" style={s.label}>Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                style={s.input}
                            />
                        </div>

                        {error && (
                            <div style={s.errorBox}>
                                <span>⚠</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ ...s.submitBtn, ...(loading ? s.submitBtnDisabled : {}) }}
                        >
                            {loading ? 'Signing in…' : 'Sign in →'}
                        </button>
                    </form>

                    <div style={s.divider} />

                    <p style={s.switchText}>
                        Don't have an account?{' '}
                        <Link to="/register" style={s.switchLink}>Create one free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
