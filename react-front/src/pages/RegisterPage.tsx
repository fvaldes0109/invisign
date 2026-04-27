import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authApi';

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

const s: Record<string, React.CSSProperties> = {
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
        background: `radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%)`,
        bottom: '-10%',
        left: '-10%',
        pointerEvents: 'none',
    },
    leftGlow2: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%)`,
        top: '5%',
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
        background: `linear-gradient(135deg, ${c.accent}, ${c.primaryLight})`,
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
    stepList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.1rem',
    },
    stepItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.9rem',
    },
    stepNum: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${c.primary}, ${c.accent})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.72rem',
        fontWeight: 800,
        color: '#fff',
        flexShrink: 0,
        marginTop: 1,
    },
    stepText: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.15rem',
    },
    stepTitle: {
        fontSize: '0.875rem',
        fontWeight: 600,
        color: c.text,
    },
    stepDesc: {
        fontSize: '0.8rem',
        color: c.textMuted,
    },
    freeBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.8rem 1.1rem',
        borderRadius: 12,
        background: `rgba(16,185,129,0.08)`,
        border: `1px solid rgba(16,185,129,0.2)`,
        color: '#10B981',
        fontSize: '0.85rem',
        fontWeight: 600,
        position: 'relative',
        zIndex: 1,
    },

    // ── Right panel (form) ────────────────────────────────────────────────────
    right: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 4rem',
        overflowY: 'auto',
    },
    formWrap: {
        width: '100%',
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
    },
    formHeader: {
        marginBottom: '1.75rem',
    },
    formBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.25rem 0.8rem',
        borderRadius: 100,
        background: `rgba(6,182,212,0.1)`,
        border: `1px solid rgba(6,182,212,0.25)`,
        color: c.accent,
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
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        marginBottom: '1rem',
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
        marginBottom: '1rem',
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
        marginTop: '0.25rem',
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
        margin: '1.25rem 0',
    },
    terms: {
        fontSize: '0.75rem',
        color: c.textDim,
        textAlign: 'center' as const,
        marginTop: '1rem',
        lineHeight: 1.5,
    },
};

const steps = [
    {
        title: 'Create your account',
        desc: 'Free to start, no credit card required.',
    },
    {
        title: 'Upload and watermark',
        desc: 'Embed invisible marks into your images or video.',
    },
    {
        title: 'Verify ownership anytime',
        desc: 'Extract the mark from any copy to prove provenance.',
    },
];

export function RegisterPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { token } = await register(name, email, password, passwordConfirmation);
            localStorage.setItem('token', token);
            navigate('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
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
                            Start protecting your{' '}
                            <span style={s.leftTitleGrad}>creative work</span>
                        </h2>
                        <p style={s.leftSub}>
                            Join photographers and studios who trust Invisign
                            to guard their content with invisible, attack-resistant watermarks.
                        </p>
                    </div>

                    <div style={s.stepList}>
                        {steps.map((step, i) => (
                            <div key={step.title} style={s.stepItem}>
                                <div style={s.stepNum}>{i + 1}</div>
                                <div style={s.stepText}>
                                    <span style={s.stepTitle}>{step.title}</span>
                                    <span style={s.stepDesc}>{step.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={s.freeBadge}>
                        ✓ Free to start · No credit card required
                    </div>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div style={s.right}>
                <div style={s.formWrap}>
                    <div style={s.formHeader}>
                        <div style={s.formBadge}>Get started free</div>
                        <h1 style={s.formTitle}>Create account</h1>
                        <p style={s.formSub}>Fill in the details below to get started.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={s.formGroup}>
                            <label htmlFor="name" style={s.label}>Full name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Jane Smith"
                                style={s.input}
                            />
                        </div>

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

                        <div style={s.formRow}>
                            <div style={s.formGroup}>
                                <label htmlFor="password" style={s.label}>Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    style={s.input}
                                />
                            </div>
                            <div style={s.formGroup}>
                                <label htmlFor="password_confirmation" style={s.label}>Confirm</label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={e => setPasswordConfirmation(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    style={s.input}
                                />
                            </div>
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
                            {loading ? 'Creating account…' : 'Create account →'}
                        </button>
                    </form>

                    <p style={s.terms}>
                        By creating an account you agree to our Terms of Service and Privacy Policy.
                    </p>

                    <div style={s.divider} />

                    <p style={s.switchText}>
                        Already have an account?{' '}
                        <Link to="/login" style={s.switchLink}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
