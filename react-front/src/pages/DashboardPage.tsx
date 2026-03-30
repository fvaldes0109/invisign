import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authApi';

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
        <div className="app-layout">
            <header>
                <h1>Image Watermarking Studio</h1>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </header>
            <main className="dashboard-placeholder">
                <h2>Welcome to the Dashboard</h2>
                <p>Watermarking tools will appear here.</p>
            </main>
        </div>
    );
}
