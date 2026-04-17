import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../services/authApi';

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

    async function handleLogout() {
        try { await logout(); } finally {
            localStorage.removeItem('token');
            navigate('/login');
        }
    }

    return (
        <>
            <header style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0 1.75rem',
                height: 56,
                borderBottom: `1px solid ${c.border}`,
                background: 'rgba(7,9,15,0.92)',
                backdropFilter: 'blur(12px)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            }}>
                {/* Logo */}
                <a
                    href="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none',
                        marginRight: '1.25rem',
                        flexShrink: 0,
                    }}
                >
                    <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: 7,
                        background: `linear-gradient(135deg, ${c.primary}, ${c.accent})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        color: '#fff',
                        flexShrink: 0,
                    }}>W</div>
                    <span style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: c.text,
                        letterSpacing: '-0.02em',
                    }}>WaterMark</span>
                </a>

                {/* Nav links */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', flex: 1, minWidth: 0 }}>
                    {NAV_ITEMS.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            style={({ isActive }) => ({
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '0.35rem 0.7rem',
                                borderRadius: 7,
                                textDecoration: 'none',
                                fontSize: '0.82rem',
                                fontWeight: isActive ? 600 : 500,
                                whiteSpace: 'nowrap' as const,
                                color: isActive ? c.primaryLight : c.textMuted,
                                background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                                border: isActive
                                    ? '1px solid rgba(99,102,241,0.22)'
                                    : '1px solid transparent',
                            })}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Log out */}
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
            </header>

            <Outlet />
        </>
    );
}
