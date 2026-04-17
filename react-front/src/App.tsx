import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { WatermarksPage } from './pages/WatermarksPage';
import { ImagesPage } from './pages/ImagesPage';
import { EngravingResultPage } from './pages/EngravingResultPage';
import { ExtractPage } from './pages/ExtractPage';
import { EngravingsPage } from './pages/EngravingsPage';
import { ExtractionsPage } from './pages/ExtractionsPage';
import { MainPage } from './pages/MainPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { DashboardLayout } from './components/DashboardLayout';

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
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/dashboard"                element={<DashboardPage />} />
                <Route path="/dashboard/watermarks"     element={<WatermarksPage />} />
                <Route path="/dashboard/images"         element={<ImagesPage />} />
                <Route path="/dashboard/engravings"     element={<EngravingsPage />} />
                <Route path="/dashboard/engravings/:id" element={<EngravingResultPage />} />
                <Route path="/dashboard/extractions"    element={<ExtractionsPage />} />
                <Route path="/dashboard/extract"        element={<ExtractPage />} />
            </Route>

            <Route path="/" element={<MainPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
