import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { LoginPage } from '@/pages/Login';
import { DashboardPage } from '@/pages/Dashboard';
import { UploadPage } from '@/pages/Upload';
import { HistoryPage } from '@/pages/History';
import { DetailPage } from '@/pages/Detail';
import { ProfilePage } from '@/pages/Profile';
import { NotFoundPage } from '@/pages/NotFound';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from './paths';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.login} element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to={ROUTES.dashboard} replace />} />
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.upload} element={<UploadPage />} />
          <Route path={ROUTES.history} element={<HistoryPage />} />
          <Route path={ROUTES.historyDetail} element={<DetailPage />} />
          <Route path={ROUTES.profile} element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
