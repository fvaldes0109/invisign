import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { WatermarksPage } from './pages/WatermarksPage';
import { ImagesPage } from './pages/ImagesPage';
import { EmbedPage } from './pages/EmbedPage';
import { ExtractPage } from './pages/ExtractPage';
import { MainPage } from './pages/MainPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem('token');
    return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/watermarks"
                element={
                    <ProtectedRoute>
                        <WatermarksPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/images"
                element={
                    <ProtectedRoute>
                        <ImagesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/embed"
                element={
                    <ProtectedRoute>
                        <EmbedPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/extract"
                element={
                    <ProtectedRoute>
                        <ExtractPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/" element={<MainPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
