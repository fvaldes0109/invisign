import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const colors = {
    bg: '#07090F',
    surface: '#0F1320',
    surfaceAlt: '#141929',
    border: '#1E2A45',
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4338CA',
    accent: '#06B6D4',
    accentDim: '#0891B2',
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    textDim: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
};

type StyleFunction =
    | ((color: string) => React.CSSProperties)
    | ((from: string, to: string) => React.CSSProperties)
    | ((pct: number, color: string) => React.CSSProperties)
    | ((pass: boolean) => React.CSSProperties);

type StyleMap = Record<string, React.CSSProperties | StyleFunction>;

const styles = {
    page: {
        background: colors.bg,
        color: colors.text,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        minHeight: '100vh',
        lineHeight: 1.6,
    },

    // ── Navbar ──────────────────────────────────────────────────────────────
    nav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 6%',
        borderBottom: `1px solid ${colors.border}`,
        position: 'sticky' as const,
        top: 0,
        background: 'rgba(7, 9, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
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
    navLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
    },
    navLink: {
        color: colors.textMuted,
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: 500,
        transition: 'color 0.2s',
    },
    navCta: {
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center',
    },
    btnOutline: {
        padding: '0.5rem 1.25rem',
        borderRadius: 8,
        border: `1px solid ${colors.border}`,
        background: 'transparent',
        color: colors.textMuted,
        fontWeight: 500,
        fontSize: '0.875rem',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'border-color 0.2s, color 0.2s',
    },
    btnPrimary: {
        padding: '0.5rem 1.25rem',
        borderRadius: 8,
        border: 'none',
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
        color: '#fff',
        fontWeight: 600,
        fontSize: '0.875rem',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: `0 0 20px rgba(99,102,241,0.4)`,
        transition: 'opacity 0.2s, box-shadow 0.2s',
    },

    // ── Hero ────────────────────────────────────────────────────────────────
    hero: {
        padding: '6rem 6% 5rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        maxWidth: 1280,
        margin: '0 auto',
    },
    heroBadge: {
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
        marginBottom: '1.5rem',
    },
    heroDot: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: colors.primary,
        display: 'inline-block',
    },
    heroTitle: {
        fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
        fontWeight: 800,
        lineHeight: 1.15,
        letterSpacing: '-0.03em',
        margin: '0 0 1.5rem',
    },
    heroTitleGrad: {
        background: `linear-gradient(135deg, ${colors.primaryLight}, ${colors.accent})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    heroSub: {
        fontSize: '1.05rem',
        color: colors.textMuted,
        marginBottom: '2.5rem',
        maxWidth: 500,
    },
    heroActions: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap' as const,
    },
    btnHeroPrimary: {
        padding: '0.85rem 2rem',
        borderRadius: 10,
        border: 'none',
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.95rem',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: `0 0 32px rgba(99,102,241,0.5)`,
        display: 'inline-block',
    },
    btnHeroSecondary: {
        padding: '0.85rem 2rem',
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
    heroStats: {
        display: 'flex',
        gap: '2rem',
        marginTop: '3rem',
        paddingTop: '2rem',
        borderTop: `1px solid ${colors.border}`,
    },
    heroStat: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.2rem',
    },
    heroStatValue: {
        fontSize: '1.6rem',
        fontWeight: 800,
        color: colors.text,
        letterSpacing: '-0.03em',
    },
    heroStatLabel: {
        fontSize: '0.78rem',
        color: colors.textMuted,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
    },

    // ── Hero Visual ─────────────────────────────────────────────────────────
    heroVisual: {
        position: 'relative' as const,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroCard: {
        width: '100%',
        maxWidth: 440,
        borderRadius: 20,
        border: `1px solid ${colors.border}`,
        background: colors.surface,
        overflow: 'hidden',
        boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)`,
    },
    heroCardBar: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.9rem 1.2rem',
        borderBottom: `1px solid ${colors.border}`,
        background: colors.surfaceAlt,
    },
    heroCardDot: (c: string): React.CSSProperties => ({
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: c,
    }),
    heroCardTitle: {
        marginLeft: '0.4rem',
        fontSize: '0.78rem',
        color: colors.textMuted,
        fontWeight: 500,
    },
    heroImageWrap: {
        position: 'relative' as const,
        background: `linear-gradient(135deg, #1a1f35 0%, #0d1220 100%)`,
        height: 220,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    heroImagePlaceholder: {
        width: '85%',
        height: '80%',
        borderRadius: 8,
        background: `linear-gradient(135deg, #1e2a45, #2a3a5c)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative' as const,
        overflow: 'hidden',
    },
    watermarkGrid: {
        position: 'absolute' as const,
        inset: 0,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(99,102,241,0.06) 28px, rgba(99,102,241,0.06) 29px), repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(99,102,241,0.06) 28px, rgba(99,102,241,0.06) 29px)`,
    },
    heroImageIcon: {
        fontSize: '2.5rem',
        position: 'relative' as const,
        zIndex: 1,
    },
    watermarkBadge: {
        position: 'absolute' as const,
        bottom: 10,
        right: 10,
        padding: '0.3rem 0.7rem',
        borderRadius: 6,
        background: `rgba(6,182,212,0.15)`,
        border: `1px solid rgba(6,182,212,0.35)`,
        color: colors.accent,
        fontSize: '0.68rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
    },
    heroCardBody: {
        padding: '1.2rem',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.8rem',
    },
    heroCardRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    heroCardLabel: {
        fontSize: '0.78rem',
        color: colors.textMuted,
    },
    heroCardVal: (color: string): React.CSSProperties => ({
        fontSize: '0.78rem',
        fontWeight: 700,
        color,
    }),
    progressBar: {
        height: 4,
        borderRadius: 2,
        background: colors.border,
        overflow: 'hidden',
    },
    progressFill: (pct: number, color: string): React.CSSProperties => ({
        height: '100%',
        width: `${pct}%`,
        background: color,
        borderRadius: 2,
    }),

    // ── Section shared ───────────────────────────────────────────────────────
    section: {
        padding: '6rem 6%',
        maxWidth: 1280,
        margin: '0 auto',
    },
    sectionLabel: {
        fontSize: '0.78rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        color: colors.primary,
        marginBottom: '0.75rem',
    },
    sectionTitle: {
        fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        margin: '0 0 1rem',
    },
    sectionSub: {
        fontSize: '1.05rem',
        color: colors.textMuted,
        maxWidth: 560,
        marginBottom: '3.5rem',
    },

    // ── Features ─────────────────────────────────────────────────────────────
    featureGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
    },
    featureCard: {
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        padding: '2rem',
        transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
    },
    featureIcon: (color: string): React.CSSProperties => ({
        width: 48,
        height: 48,
        borderRadius: 12,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.2rem',
        fontSize: '1.4rem',
    }),
    featureTitle: {
        fontSize: '1.05rem',
        fontWeight: 700,
        marginBottom: '0.5rem',
        color: colors.text,
    },
    featureDesc: {
        fontSize: '0.9rem',
        color: colors.textMuted,
        lineHeight: 1.65,
    },

    // ── How it works ─────────────────────────────────────────────────────────
    howSection: {
        background: colors.surface,
        borderTop: `1px solid ${colors.border}`,
        borderBottom: `1px solid ${colors.border}`,
        padding: '6rem 6%',
    },
    howInner: {
        maxWidth: 1280,
        margin: '0 auto',
    },
    stepsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2rem',
        marginTop: '3.5rem',
        position: 'relative' as const,
    },
    stepCard: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1rem',
    },
    stepNum: {
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: '1rem',
        color: '#fff',
        flexShrink: 0,
    },
    stepTitle: {
        fontWeight: 700,
        fontSize: '1rem',
        color: colors.text,
    },
    stepDesc: {
        fontSize: '0.875rem',
        color: colors.textMuted,
        lineHeight: 1.65,
    },

    // ── Use cases ─────────────────────────────────────────────────────────────
    useCaseGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
    },
    useCaseCard: (accent: string): React.CSSProperties => ({
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 20,
        overflow: 'hidden',
        borderTop: `3px solid ${accent}`,
    }),
    useCaseVisual: (from: string, to: string): React.CSSProperties => ({
        height: 180,
        background: `linear-gradient(135deg, ${from}, ${to})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3.5rem',
    }),
    useCaseBody: {
        padding: '1.75rem',
    },
    useCaseTitle: {
        fontWeight: 700,
        fontSize: '1.15rem',
        marginBottom: '0.6rem',
        color: colors.text,
    },
    useCaseDesc: {
        fontSize: '0.9rem',
        color: colors.textMuted,
        lineHeight: 1.7,
    },
    useCaseTags: {
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap' as const,
        marginTop: '1.2rem',
    },
    tag: (color: string): React.CSSProperties => ({
        padding: '0.25rem 0.7rem',
        borderRadius: 100,
        background: `${color}15`,
        border: `1px solid ${color}30`,
        color,
        fontSize: '0.72rem',
        fontWeight: 600,
    }),

    // ── Resistance callout ───────────────────────────────────────────────────
    resistSection: {
        padding: '6rem 6%',
        background: colors.bg,
    },
    resistInner: {
        maxWidth: 1280,
        margin: '0 auto',
    },
    resistGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        marginTop: '3.5rem',
    },
    attackList: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.75rem',
    },
    attackItem: (_pass: boolean): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.9rem',
        padding: '1rem 1.25rem',
        borderRadius: 12,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        transition: 'border-color 0.2s, transform 0.2s',
    }),
    attackIcon: (pass: boolean): React.CSSProperties => ({
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: pass ? `rgba(16,185,129,0.15)` : `rgba(239,68,68,0.15)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        flexShrink: 0,
    }),
    attackLabel: {
        fontSize: '0.9rem',
        color: colors.text,
        fontWeight: 500,
    },
    attackStatus: (pass: boolean): React.CSSProperties => ({
        marginLeft: 'auto',
        fontSize: '0.72rem',
        fontWeight: 700,
        color: pass ? colors.success : '#EF4444',
        letterSpacing: '0.04em',
    }),
    resistText: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1.5rem',
    },
    resistTextItem: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start',
    },
    resistTextIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        background: `rgba(99,102,241,0.12)`,
        border: `1px solid rgba(99,102,241,0.25)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        flexShrink: 0,
        marginTop: 2,
    },
    resistTextTitle: {
        fontWeight: 700,
        fontSize: '0.95rem',
        marginBottom: '0.25rem',
        color: colors.text,
    },
    resistTextDesc: {
        fontSize: '0.875rem',
        color: colors.textMuted,
        lineHeight: 1.65,
    },

    // ── CTA Banner ────────────────────────────────────────────────────────────
    ctaSection: {
        padding: '6rem 6%',
        background: colors.surface,
        borderTop: `1px solid ${colors.border}`,
    },
    ctaInner: {
        maxWidth: 680,
        margin: '0 auto',
        textAlign: 'center' as const,
    },
    ctaTitle: {
        fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        marginBottom: '1rem',
    },
    ctaSub: {
        fontSize: '1.05rem',
        color: colors.textMuted,
        marginBottom: '2.5rem',
    },
    ctaActions: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap' as const,
    },
    btnCtaPrimary: {
        padding: '0.9rem 2.25rem',
        borderRadius: 10,
        border: 'none',
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
        color: '#fff',
        fontWeight: 700,
        fontSize: '1rem',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: `0 0 40px rgba(99,102,241,0.45)`,
        display: 'inline-block',
    },
    btnCtaSecondary: {
        padding: '0.9rem 2.25rem',
        borderRadius: 10,
        border: `1px solid ${colors.border}`,
        background: 'transparent',
        color: colors.text,
        fontWeight: 600,
        fontSize: '1rem',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-block',
    },

    // ── Footer ───────────────────────────────────────────────────────────────
    footer: {
        padding: '2.5rem 6%',
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 1280,
        margin: '0 auto',
        color: colors.textDim,
        fontSize: '0.85rem',
    },
} satisfies StyleMap;

const attacks = [
    { label: 'JPEG compression', pass: true },
    { label: 'Cropping & resizing', pass: true },
    { label: 'Colour grading & filters', pass: true },
    { label: 'Screenshot capture', pass: true },
    { label: 'Rotation & flipping', pass: true },
    { label: 'Noise addition', pass: true },
];

const features = [
    {
        icon: '🔒',
        color: colors.primary,
        title: 'Invisible & Non-intrusive',
        desc: 'Watermarks are embedded at the pixel frequency level, completely undetectable to the human eye. Your images look exactly as intended.',
    },
    {
        icon: '🛡️',
        color: colors.accent,
        title: 'Attack-Resistant',
        desc: 'Survives compression, cropping, colour grading, resizing, and more. The mark persists through virtually any real-world image manipulation.',
    },
    {
        icon: '⚡',
        color: colors.warning,
        title: 'Instant Embedding & Extraction',
        desc: 'Embed a watermark in seconds and extract it just as fast. Built for scale, whether you\'re protecting a single photo or a full film library.',
    },
    {
        icon: '🎬',
        color: colors.success,
        title: 'Video & Film Support',
        desc: 'Works frame-by-frame on video content. Protect theatrical releases, streaming content, and TV broadcasts with frame-level traceability.',
    },
    {
        icon: '📋',
        color: '#A855F7',
        title: 'Audit Trail',
        desc: 'Every watermark carries a unique payload you define — owner ID, timestamp, license. Extract it later to prove provenance in any dispute.',
    },
    {
        icon: '🌐',
        color: '#EC4899',
        title: 'API-First Design',
        desc: 'Integrate watermarking directly into your existing DAM, CMS, or distribution pipeline via our REST API with full SDK support.',
    },
];

const steps = [
    {
        title: 'Upload your content',
        desc: 'Upload any image or point us to a video file. Supports JPEG, PNG, WebP, TIFF, and common video formats.',
    },
    {
        title: 'Define your watermark payload',
        desc: 'Set the embedded data: your owner ID, a timestamp, a license code, or any binary payload up to 128 bits.',
    },
    {
        title: 'Embed in one click',
        desc: 'Our algorithm encodes your payload invisibly into the content. Download the protected file — visually identical to the original.',
    },
    {
        title: 'Extract & verify anytime',
        desc: 'Upload any suspected copy — even a degraded one — and extract the watermark to prove ownership in seconds.',
    },
];

function useInView(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

export function MainPage() {
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
    const [hoveredAttack, setHoveredAttack] = useState<number | null>(null);

    const { ref: featuresRef, inView: featuresInView } = useInView();
    const { ref: stepsRef, inView: stepsInView } = useInView();
    const { ref: useCasesRef, inView: useCasesInView } = useInView();
    const { ref: attacksRef, inView: attacksInView } = useInView();
    const { ref: resistTextRef, inView: resistTextInView } = useInView();
    const { ref: ctaRef, inView: ctaInView } = useInView();

    return (
        <div style={styles.page}>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50%       { transform: translateY(-12px); }
                }
                @keyframes pulseDot {
                    0%, 100% { transform: scale(1);    opacity: 1; }
                    50%       { transform: scale(0.75); opacity: 0.45; }
                }
                @keyframes progressGrow {
                    from { width: 0%; }
                    to   { width: 96%; }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-36px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(36px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>

            {/* ── Navbar ── */}
            <nav style={styles.nav}>
                <Link to="/" style={styles.navLogo}>
                    <div style={styles.navLogoMark}>W</div>
                    <span style={styles.navLogoText}>WaterMark</span>
                </Link>

                <div style={styles.navLinks}>
                    <a href="#features" style={styles.navLink}>Features</a>
                    <a href="#how-it-works" style={styles.navLink}>How it works</a>
                    <a href="#use-cases" style={styles.navLink}>Use cases</a>
                </div>

                <div style={styles.navCta}>
                    <Link to="/login" style={styles.btnOutline}>Log in</Link>
                    <Link to="/register" style={styles.btnPrimary}>Get started</Link>
                </div>
            </nav>

            {/* ── Hero ── */}
            <div style={styles.hero}>
                {/* Left copy — staggered fade-in */}
                <div>
                    <div style={{ ...styles.heroBadge, animation: 'fadeInUp 0.6s ease both' }}>
                        <span style={{ ...styles.heroDot, animation: 'pulseDot 2s ease-in-out infinite' }} />
                        Invisible · Robust · Traceable
                    </div>

                    <h1 style={{ ...styles.heroTitle, animation: 'fadeInUp 0.7s 0.1s ease both' }}>
                        Protect your visuals with{' '}
                        <span style={styles.heroTitleGrad}>invisible watermarks</span>
                    </h1>

                    <p style={{ ...styles.heroSub, animation: 'fadeInUp 0.7s 0.2s ease both' }}>
                        Embed imperceptible copyright marks into images and video. Your content
                        looks untouched, but the mark persists through compression, cropping,
                        and edits — giving you proof of ownership wherever it ends up.
                    </p>

                    <div style={{ ...styles.heroActions, animation: 'fadeInUp 0.7s 0.32s ease both' }}>
                        <Link to="/register" style={styles.btnHeroPrimary}>Start for free</Link>
                        <a href="#how-it-works" style={styles.btnHeroSecondary}>See how it works →</a>
                    </div>

                    <div style={{ ...styles.heroStats, animation: 'fadeInUp 0.7s 0.45s ease both' }}>
                        <div style={styles.heroStat}>
                            <span style={styles.heroStatValue}>99.8%</span>
                            <span style={styles.heroStatLabel}>Extraction accuracy</span>
                        </div>
                        <div style={styles.heroStat}>
                            <span style={styles.heroStatValue}>12+</span>
                            <span style={styles.heroStatLabel}>Attack types resisted</span>
                        </div>
                        <div style={styles.heroStat}>
                            <span style={styles.heroStatValue}>&lt;1s</span>
                            <span style={styles.heroStatLabel}>Per image</span>
                        </div>
                    </div>
                </div>

                {/* Right visual — floating card */}
                <div style={{ ...styles.heroVisual, animation: 'fadeInUp 0.8s 0.25s ease both' }}>
                    <div style={{ ...styles.heroCard, animation: 'float 5s ease-in-out infinite' }}>
                        {/* Fake window bar */}
                        <div style={styles.heroCardBar}>
                            <div style={styles.heroCardDot('#FF5F57')} />
                            <div style={styles.heroCardDot('#FEBC2E')} />
                            <div style={styles.heroCardDot('#28C840')} />
                            <span style={styles.heroCardTitle}>watermark-studio · embed</span>
                        </div>

                        {/* Image preview area */}
                        <div style={styles.heroImageWrap}>
                            <div style={styles.heroImagePlaceholder}>
                                <div style={styles.watermarkGrid} />
                                <span style={styles.heroImageIcon}>🖼️</span>
                                <div style={styles.watermarkBadge}>✓ Watermarked</div>
                            </div>
                        </div>

                        {/* Card details */}
                        <div style={styles.heroCardBody}>
                            <div style={styles.heroCardRow}>
                                <span style={styles.heroCardLabel}>Payload</span>
                                <span style={styles.heroCardVal(colors.primaryLight)}>owner:usr_9f3a · ts:1743364800</span>
                            </div>
                            <div style={styles.heroCardRow}>
                                <span style={styles.heroCardLabel}>Imperceptibility</span>
                                <span style={styles.heroCardVal(colors.success)}>PSNR 48.3 dB</span>
                            </div>
                            <div>
                                <div style={{ ...styles.heroCardRow, marginBottom: '0.4rem' }}>
                                    <span style={styles.heroCardLabel}>Robustness score</span>
                                    <span style={styles.heroCardVal(colors.accent)}>96 / 100</span>
                                </div>
                                <div style={styles.progressBar}>
                                    <div style={{
                                        ...styles.progressFill(96, `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`),
                                        animation: 'progressGrow 1.4s 0.9s ease both',
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Features ── */}
            <div id="features" style={{ background: colors.surface, borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}>
                <div style={styles.section}>
                    <div style={styles.sectionLabel}>Everything you need</div>
                    <h2 style={styles.sectionTitle}>Built for serious copyright protection</h2>
                    <p style={styles.sectionSub}>
                        From a single stock photo to an entire film catalog, WaterMark gives you
                        the tools to embed, manage, and verify ownership at any scale.
                    </p>

                    <div ref={featuresRef} style={styles.featureGrid}>
                        {features.map((f, i) => (
                            <div
                                key={f.title}
                                style={{
                                    ...styles.featureCard,
                                    transform: hoveredFeature === i ? 'translateY(-6px)' : 'translateY(0)',
                                    borderColor: hoveredFeature === i ? `${f.color}55` : colors.border,
                                    boxShadow: hoveredFeature === i ? `0 16px 40px rgba(0,0,0,0.35)` : undefined,
                                    opacity: featuresInView ? undefined : 0,
                                    animation: featuresInView ? `fadeInUp 0.55s ${i * 0.08}s ease both` : undefined,
                                }}
                                onMouseEnter={() => setHoveredFeature(i)}
                                onMouseLeave={() => setHoveredFeature(null)}
                            >
                                <div style={styles.featureIcon(f.color)}>{f.icon}</div>
                                <div style={styles.featureTitle}>{f.title}</div>
                                <div style={styles.featureDesc}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── How it works ── */}
            <div id="how-it-works" style={styles.howSection}>
                <div style={styles.howInner}>
                    <div style={styles.sectionLabel}>Simple process</div>
                    <h2 style={styles.sectionTitle}>How it works</h2>
                    <p style={styles.sectionSub}>
                        Embed and verify invisible watermarks in four straightforward steps —
                        no technical expertise required.
                    </p>

                    <div ref={stepsRef} style={styles.stepsGrid}>
                        {steps.map((s, i) => (
                            <div
                                key={s.title}
                                style={{
                                    ...styles.stepCard,
                                    opacity: stepsInView ? undefined : 0,
                                    animation: stepsInView ? `fadeInUp 0.55s ${i * 0.1}s ease both` : undefined,
                                }}
                            >
                                <div style={styles.stepNum}>{i + 1}</div>
                                <div style={styles.stepTitle}>{s.title}</div>
                                <div style={styles.stepDesc}>{s.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Use cases ── */}
            <div id="use-cases" style={{ background: colors.bg }}>
                <div style={styles.section}>
                    <div style={styles.sectionLabel}>Use cases</div>
                    <h2 style={styles.sectionTitle}>Protecting images, video & beyond</h2>
                    <p style={styles.sectionSub}>
                        Whether you distribute photographs, films, or broadcast content, invisible
                        watermarking adapts to every format and workflow.
                    </p>

                    <div ref={useCasesRef} style={styles.useCaseGrid}>
                        <div style={{
                            ...styles.useCaseCard(colors.primary),
                            opacity: useCasesInView ? undefined : 0,
                            animation: useCasesInView ? 'slideInLeft 0.65s ease both' : undefined,
                        }}>
                            <div style={styles.useCaseVisual('#1a1f45', '#0d1235')}>🖼️</div>
                            <div style={styles.useCaseBody}>
                                <div style={styles.useCaseTitle}>Photography & Stock Images</div>
                                <div style={styles.useCaseDesc}>
                                    Photographers and stock agencies can protect every file in their
                                    library. If an image appears on an unauthorized site, extract the
                                    watermark to confirm ownership and pursue takedowns or licensing
                                    fees with hard evidence.
                                </div>
                                <div style={styles.useCaseTags}>
                                    {['Stock photos', 'Portfolios', 'Press media', 'NFTs'].map(t => (
                                        <span key={t} style={styles.tag(colors.primary)}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            ...styles.useCaseCard(colors.accent),
                            opacity: useCasesInView ? undefined : 0,
                            animation: useCasesInView ? 'slideInRight 0.65s 0.1s ease both' : undefined,
                        }}>
                            <div style={styles.useCaseVisual('#041520', '#091a28')}>🎬</div>
                            <div style={styles.useCaseBody}>
                                <div style={styles.useCaseTitle}>Film, TV & Streaming</div>
                                <div style={styles.useCaseDesc}>
                                    Embed unique per-distributor watermarks into screeners, theatrical
                                    prints, and streaming masters. When a pirated copy surfaces, the
                                    mark reveals exactly which distribution channel it leaked from —
                                    even if the video was re-encoded or captured from a screen.
                                </div>
                                <div style={styles.useCaseTags}>
                                    {['Screeners', 'Streaming', 'Broadcast', 'Theatrical'].map(t => (
                                        <span key={t} style={styles.tag(colors.accent)}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Attack resistance ── */}
            <div style={styles.resistSection}>
                <div style={styles.resistInner}>
                    <div style={styles.sectionLabel}>Robustness</div>
                    <h2 style={styles.sectionTitle}>The mark survives any attack</h2>

                    <div style={styles.resistGrid}>
                        {/* Attack list */}
                        <div ref={attacksRef} style={styles.attackList}>
                            {attacks.map((a, i) => (
                                <div
                                    key={a.label}
                                    style={{
                                        ...styles.attackItem(a.pass),
                                        transform: hoveredAttack === i ? 'translateX(4px)' : 'translateX(0)',
                                        borderColor: hoveredAttack === i
                                            ? (a.pass ? `rgba(16,185,129,0.4)` : `rgba(239,68,68,0.4)`)
                                            : colors.border,
                                        opacity: attacksInView ? undefined : 0,
                                        animation: attacksInView ? `slideInLeft 0.5s ${i * 0.07}s ease both` : undefined,
                                    }}
                                    onMouseEnter={() => setHoveredAttack(i)}
                                    onMouseLeave={() => setHoveredAttack(null)}
                                >
                                    <div style={styles.attackIcon(a.pass)}>
                                        {a.pass ? '✓' : '✗'}
                                    </div>
                                    <span style={styles.attackLabel}>{a.label}</span>
                                    <span style={styles.attackStatus(a.pass)}>
                                        {a.pass ? 'MARK SURVIVES' : 'MARK LOST'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Explanatory text */}
                        <div ref={resistTextRef} style={styles.resistText}>
                            {[
                                {
                                    icon: '🧮',
                                    title: 'Frequency-domain encoding',
                                    desc: 'Payloads are embedded in the mid-frequency DCT coefficients of the image, the same domain JPEG uses to store most visual information. This makes the mark inherently tolerant of compression.',
                                },
                                {
                                    icon: '🔁',
                                    title: 'Redundant distribution',
                                    desc: 'Each bit of the payload is distributed redundantly across thousands of coefficients. Even if large portions of the image are cropped away, the remaining coefficients can reconstruct the full payload.',
                                },
                                {
                                    icon: '📊',
                                    title: 'Error-correcting codes',
                                    desc: 'Reed-Solomon error correction is applied before embedding. The decoder can recover the payload accurately even when a significant percentage of coefficients are corrupted by attacks.',
                                },
                            ].map((item, i) => (
                                <div
                                    key={item.title}
                                    style={{
                                        ...styles.resistTextItem,
                                        opacity: resistTextInView ? undefined : 0,
                                        animation: resistTextInView ? `slideInRight 0.55s ${i * 0.12}s ease both` : undefined,
                                    }}
                                >
                                    <div style={styles.resistTextIcon}>{item.icon}</div>
                                    <div>
                                        <div style={styles.resistTextTitle}>{item.title}</div>
                                        <div style={styles.resistTextDesc}>{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── CTA Banner ── */}
            <div style={styles.ctaSection}>
                <div
                    ref={ctaRef}
                    style={{
                        ...styles.ctaInner,
                        opacity: ctaInView ? undefined : 0,
                        animation: ctaInView ? 'fadeInUp 0.65s ease both' : undefined,
                    }}
                >
                    <h2 style={styles.ctaTitle}>
                        Ready to protect your{' '}
                        <span style={styles.heroTitleGrad}>creative work?</span>
                    </h2>
                    <p style={styles.ctaSub}>
                        Create a free account and embed your first watermark in under a minute.
                        No credit card required.
                    </p>
                    <div style={styles.ctaActions}>
                        <Link to="/register" style={styles.btnCtaPrimary}>Create free account</Link>
                        <Link to="/login" style={styles.btnCtaSecondary}>Sign in</Link>
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <footer>
                <div style={styles.footer}>
                    <span>© 2026 WaterMark. All rights reserved.</span>
                    <span style={{ color: colors.textDim }}>
                        Invisible watermarking for the modern web.
                    </span>
                </div>
            </footer>
        </div>
    );
}
