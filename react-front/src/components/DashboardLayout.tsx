import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../services/authApi';
import logoImg from '../assets/logo.png';
import { useBreakpoint } from '../hooks/useBreakpoint';

const c = {
    primary: '#6366F1',
    primaryLight: '#818CF8',
    accent: '#06B6D4',
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    border: '#1E2A45',
    surface: '#0F1320',
    bg: '#07090F',
};

const NAV_ITEMS = [
    { label: 'Dashboard',   to: '/dashboard',             end: true  },
    { label: 'Watermarks',  to: '/dashboard/watermarks',  end: false },
    { label: 'Images',      to: '/dashboard/images',      end: false },
    { label: 'Engravings',  to: '/dashboard/engravings',  end: false },
    { label: 'Extractions', to: '/dashboard/extractions', end: true  },
];

export function DashboardLayout() {
    const navigate = useNavigate();
    const { isMobile } = useBreakpoint();
    const [menuOpen, setMenuOpen] = useState(false);

    async function handleLogout() {
        try { await logout(); } finally {
            localStorage.removeItem('token');
            navigate('/login');
        }
    }

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0 1.25rem',
        height: 56,
        borderBottom: `1px solid ${c.border}`,
        background: 'rgba(7,9,15,0.92)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    };

    const navLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.35rem 0.7rem',
        borderRadius: 7,
        textDecoration: 'none',
        fontSize: '0.82rem',
        fontWeight: isActive ? 600 : 500,
        whiteSpace: 'nowrap',
        color: isActive ? c.primaryLight : c.textMuted,
        background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
        border: isActive ? '1px solid rgba(99,102,241,0.22)' : '1px solid transparent',
    });

    const mobileNavLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
        display: 'block',
        padding: '0.75rem 1rem',
        borderRadius: 10,
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: isActive ? 700 : 500,
        color: isActive ? c.primaryLight : c.textMuted,
        background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
        border: isActive ? `1px solid rgba(99,102,241,0.22)` : '1px solid transparent',
    });

    return (
        <>
            <header style={headerStyle}>
                {/* Logo */}
                <a
                    href="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none',
                        marginRight: isMobile ? 'auto' : '1.25rem',
                        flexShrink: 0,
                    }}
                >
                    <img src={logoImg} alt="Invisign" style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }} />
                    <span style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: c.text,
                        letterSpacing: '-0.02em',
                    }}>Invisign</span>
                </a>

                {/* Desktop nav */}
                {!isMobile && (
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', flex: 1, minWidth: 0 }}>
                        {NAV_ITEMS.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                style={navLinkStyle}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                )}

                {/* Desktop log out */}
                {!isMobile && (
                    <button
                        onClick={handleLogout}
                        style={{
                            marginLeft: '1rem',
                            padding: '0.38rem 0.85rem',
                            borderRadius: 8,
                            border: `1px solid ${c.border}`,
                            background: 'transparent',
                            color: c.textMuted,
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            flexShrink: 0,
                        }}
                    >
                        Log out
                    </button>
                )}

                {/* Mobile hamburger */}
                {isMobile && (
                    <button
                        onClick={() => setMenuOpen(o => !o)}
                        style={{
                            padding: '0.4rem 0.6rem',
                            borderRadius: 8,
                            border: `1px solid ${c.border}`,
                            background: 'transparent',
                            color: c.textMuted,
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            lineHeight: 1,
                        }}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {menuOpen ? '✕' : '☰'}
                    </button>
                )}
            </header>

            {/* Mobile dropdown menu */}
            {isMobile && menuOpen && (
                <div style={{
                    position: 'fixed',
                    top: 56,
                    left: 0,
                    right: 0,
                    zIndex: 99,
                    background: 'rgba(7,9,15,0.97)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: `1px solid ${c.border}`,
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                }}>
                    {NAV_ITEMS.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            style={mobileNavLinkStyle}
                            onClick={() => setMenuOpen(false)}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                    <div style={{ height: 1, background: c.border, margin: '0.5rem 0' }} />
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '0.75rem 1rem',
                            borderRadius: 10,
                            border: `1px solid ${c.border}`,
                            background: 'transparent',
                            color: c.textMuted,
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            textAlign: 'left',
                        }}
                    >
                        Log out
                    </button>
                </div>
            )}

            <Outlet />
        </>
    );
}
