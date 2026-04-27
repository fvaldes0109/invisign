import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import heroImg from '../assets/hero.webp';
import logoImg from '../assets/logo.png';
import usecasePhotoImg from '../assets/usecase-photo.webp';
import usecaseEcomImg from '../assets/usecase-ecom.webp';
import usecasePressImg from '../assets/usecase-press.webp';

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
    useCaseList: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '2rem',
    },
    useCaseRow: (accent: string): React.CSSProperties => ({
        display: 'flex',
        borderRadius: 20,
        border: `1px solid ${colors.border}`,
        borderLeft: `4px solid ${accent}`,
        background: colors.surface,
        overflow: 'hidden',
        minHeight: 380,
    }),
    useCaseImgPane: {
        flex: '0 0 55%',
        position: 'relative' as const,
        overflow: 'hidden',
    },
    useCaseImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        display: 'block',
    },
    useCaseTextPane: {
        flex: 1,
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        gap: '1rem',
    },
    useCaseTitle: {
        fontWeight: 800,
        fontSize: '1.35rem',
        color: colors.text,
        letterSpacing: '-0.02em',
    },
    useCaseDesc: {
        fontSize: '0.925rem',
        color: colors.textMuted,
        lineHeight: 1.75,
    },
    useCaseTags: {
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap' as const,
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
    { label: 'Rotate',            pass: true },
    { label: 'Mirror',            pass: true },
    { label: 'Gaussian Noise',    pass: true },
    { label: 'Brightness',        pass: true },
    { label: 'JPEG Compression',  pass: true },
    { label: 'Exposition',        pass: true },
    { label: 'Blur',              pass: true },
    { label: 'Pixelate',          pass: true },
];

const features = [
    {
        icon: '🔒',
        color: colors.primary,
        title: 'Completely Invisible',
        desc: 'The watermark is hidden inside the image at a level the human eye cannot detect. Your photo looks exactly the same, before and after.',
    },
    {
        icon: '🛡️',
        color: colors.accent,
        title: 'Survives Real-world Edits',
        desc: 'Compression, rotation, noise, blur, brightness changes, the mark holds up. Even a degraded or re-exported copy can still be verified.',
    },
    {
        icon: '⚡',
        color: colors.warning,
        title: 'Fast Embedding & Extraction',
        desc: 'Embed a watermark in seconds and recover it just as quickly. No waiting. Results are instant whether you\'re protecting one photo or many.',
    },
    {
        icon: '🖼️',
        color: '#A855F7',
        title: 'Your Logo as the Mark',
        desc: 'The watermark is an image, your logo, signature, or any square PNG. Extraction gives you back a visible reconstruction you can verify at a glance.',
    },
    {
        icon: '⚔️',
        color: colors.success,
        title: 'Attack Simulation',
        desc: 'Put your watermarked images to the test. Apply JPEG compression, rotation, noise, blur, and more. Then verify the mark still holds up after each transformation.',
    },
    {
        icon: '🌐',
        color: '#EC4899',
        title: 'Full Web Platform',
        desc: 'Dashboard, user accounts, image library, attack simulation, and extraction, all in one place, accessible from any browser.',
    },
];

const steps = [
    {
        title: 'Choose a watermark',
        desc: 'Pick a square PNG, your logo, signature, or any symbol. This becomes the invisible mark hidden inside your photo.',
    },
    {
        title: 'Upload your image',
        desc: 'Upload the photo you want to protect. JPEG, PNG, and WebP are all supported.',
    },
    {
        title: 'Embed',
        desc: 'The algorithm encodes your mark invisibly into the image. The result is pixel-perfect to the eye but carries a hidden signature only you can verify.',
    },
    {
        title: 'Extract & verify anytime',
        desc: 'Found a suspected copy? Upload it along with the originals and get a visual recovery of the embedded mark plus a confidence score.',
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
                    <img src={logoImg} alt="Invisign" style={{ width: 34, height: 34, objectFit: 'contain' }} />
                    <span style={styles.navLogoText}>Invisign</span>
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
                        Invisible · Robust · Verifiable
                    </div>

                    <h1 style={{ ...styles.heroTitle, animation: 'fadeInUp 0.7s 0.1s ease both' }}>
                        Embed and extract{' '}
                        <span style={styles.heroTitleGrad}>invisible watermarks</span>
                    </h1>

                    <p style={{ ...styles.heroSub, animation: 'fadeInUp 0.7s 0.2s ease both' }}>
                        Hide an invisible ownership mark inside any image. Your photo looks
                        completely untouched, but the mark can be recovered and verified at any
                        time, even after compression, edits, or quality loss.
                    </p>

                    <div style={{ ...styles.heroActions, animation: 'fadeInUp 0.7s 0.32s ease both' }}>
                        <Link to="/register" style={styles.btnHeroPrimary}>Start for free</Link>
                        <a href="#how-it-works" style={styles.btnHeroSecondary}>See how it works →</a>
                    </div>

                    <div style={{ ...styles.heroStats, animation: 'fadeInUp 0.7s 0.45s ease both' }}>
                        <div style={styles.heroStat}>
                            <span style={styles.heroStatValue}>100%</span>
                            <span style={styles.heroStatLabel}>Visually identical</span>
                        </div>
                        <div style={styles.heroStat}>
                            <span style={styles.heroStatValue}>8+</span>
                            <span style={styles.heroStatLabel}>Attack types survived</span>
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
                            <span style={styles.heroCardTitle}>invisign · embed</span>
                        </div>

                        {/* Image preview area */}
                        <div style={styles.heroImageWrap}>
                            <div style={styles.heroImagePlaceholder}>
                                <div style={styles.watermarkGrid} />
                                <img src={heroImg} alt="Watermarked sample" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }} />
                                <div style={styles.watermarkBadge}>✓ Watermarked</div>
                            </div>
                        </div>

                        {/* Card details */}
                        <div style={styles.heroCardBody}>
                            <div style={styles.heroCardRow}>
                                <span style={styles.heroCardLabel}>Visible change</span>
                                <span style={styles.heroCardVal(colors.primaryLight)}>None - imperceptible to the eye</span>
                            </div>
                            <div style={styles.heroCardRow}>
                                <span style={styles.heroCardLabel}>Image quality</span>
                                <span style={styles.heroCardVal(colors.success)}>Preserved</span>
                            </div>
                            <div>
                                <div style={{ ...styles.heroCardRow, marginBottom: '0.4rem' }}>
                                    <span style={styles.heroCardLabel}>Recovery confidence</span>
                                    <span style={styles.heroCardVal(colors.accent)}>96%</span>
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
                    <h2 style={styles.sectionTitle}>Built for invisible copyright protection</h2>
                    <p style={styles.sectionSub}>
                        From embedding your first mark to simulating attacks and verifying
                        ownership, everything is in one place.
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
                        Four steps from upload to verified ownership, the algorithm handles
                        all the frequency-domain maths automatically.
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
                    <h2 style={styles.sectionTitle}>Protecting your images</h2>
                    <p style={styles.sectionSub}>
                        Whether you distribute stock photographs or press media, invisible
                        watermarking adapts to every workflow.
                    </p>

                    <div ref={useCasesRef} style={styles.useCaseList}>

                        {/* Photography — image left */}
                        <div style={{
                            ...styles.useCaseRow(colors.primary),
                            opacity: useCasesInView ? undefined : 0,
                            animation: useCasesInView ? 'slideInLeft 0.65s ease both' : undefined,
                        }}>
                            <div style={styles.useCaseImgPane}>
                                <img src={usecasePhotoImg} alt="Photography use case" style={styles.useCaseImg} />
                            </div>
                            <div style={styles.useCaseTextPane}>
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

                        {/* E-commerce — image right */}
                        <div style={{
                            ...styles.useCaseRow(colors.warning),
                            flexDirection: 'row-reverse',
                            opacity: useCasesInView ? undefined : 0,
                            animation: useCasesInView ? 'slideInRight 0.65s 0.12s ease both' : undefined,
                        }}>
                            <div style={styles.useCaseImgPane}>
                                <img src={usecaseEcomImg} alt="E-commerce use case" style={styles.useCaseImg} />
                            </div>
                            <div style={styles.useCaseTextPane}>
                                <div style={styles.useCaseTitle}>E-commerce & Product Photos</div>
                                <div style={styles.useCaseDesc}>
                                    Retailers and brands can invisibly mark every product image
                                    before distribution. Track unauthorised use across competitor
                                    sites and marketplaces, and enforce licensing with verifiable
                                    proof of origin.
                                </div>
                                <div style={styles.useCaseTags}>
                                    {['Product shots', 'Catalogues', 'Marketplaces', 'Brand assets'].map(t => (
                                        <span key={t} style={styles.tag(colors.warning)}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Press — image left */}
                        <div style={{
                            ...styles.useCaseRow('#A855F7'),
                            opacity: useCasesInView ? undefined : 0,
                            animation: useCasesInView ? 'slideInLeft 0.65s 0.24s ease both' : undefined,
                        }}>
                            <div style={styles.useCaseImgPane}>
                                <img src={usecasePressImg} alt="News & press use case" style={styles.useCaseImg} />
                            </div>
                            <div style={styles.useCaseTextPane}>
                                <div style={styles.useCaseTitle}>News & Press Media</div>
                                <div style={styles.useCaseDesc}>
                                    Photojournalists and agencies can sign every image at capture
                                    time. If an editorial photo is stripped of its metadata and
                                    republished without credit, the embedded mark still identifies
                                    the original author.
                                </div>
                                <div style={styles.useCaseTags}>
                                    {['Photojournalism', 'Wire services', 'Editorial', 'Archives'].map(t => (
                                        <span key={t} style={styles.tag('#A855F7')}>{t}</span>
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
                    <h2 style={styles.sectionTitle}>Tested against eight real-world attacks</h2>

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
                                    title: 'Hidden in the frequency domain',
                                    desc: 'The mark is embedded in how pixel intensities vary across the image, not in the pixels themselves. Changes at this level are invisible to the eye but survive most edits.',
                                },
                                {
                                    icon: '🔢',
                                    title: 'Mathematically encoded',
                                    desc: 'Your watermark\'s visual structure is broken down into numerical components and encoded into the image. Extraction reverses this process to reconstruct the original mark.',
                                },
                                {
                                    icon: '🔁',
                                    title: 'Spread across the whole image',
                                    desc: 'The mark is distributed across every region of the photo. Even if part of the image is cropped, compressed, or distorted, enough of the mark remains to recover and verify it.',
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
                        Try the{' '}
                        <span style={styles.heroTitleGrad}>watermarking demo</span>
                    </h2>
                    <p style={styles.ctaSub}>
                        Create an account, upload an image and a watermark, and see it
                        in action: embedding, attack simulation, and ownership verification,
                        all from your browser.
                    </p>
                    <div style={styles.ctaActions}>
                        <Link to="/register" style={styles.btnCtaPrimary}>Create an account</Link>
                        <Link to="/login" style={styles.btnCtaSecondary}>Sign in</Link>
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <footer>
                <div style={styles.footer}>
                    <span>© 2026 Invisign</span>
                </div>
            </footer>
        </div>
    );
}
