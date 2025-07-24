import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Context
import { UserProvider } from './contexts/UserContext';

// Components
import DashboardLayout from './components/Layout/DashboardLayout';
import EnhancedDashboard from './components/Dashboard/EnhancedDashboard';
import EnhancedBidList from './components/BidList/EnhancedBidList';
import { BidDetail } from './components/BidDetail/BidDetail';
import { ReferenceManager } from './components/Reference';
import EnhancedNotification from './components/Notification/EnhancedNotification';
import { StatisticsPage } from './components/Statistics';
import IntegrationPage from './components/integration/IntegrationPage';
import { PersonalPage } from './components/Personal/PersonalPage';
import ColorSystemDemo from './components/ColorSystemDemo';
import UIComponentsDemo from './components/Demo/UIComponentsDemo';
// import { LoginPage, ProtectedRoute } from './components/Auth'; // TODO: 나중에 구현 예정
import { ProtectedRoute } from './components/Auth';
import { 
  AdminLayout,
  AdminDashboard, 
  UserManagement, 
  SystemLogs, 
  FetchLogs, 
  AdminNotificationSettings,
  ReportSettings,
  SystemSettings,
  BackupManagement,
  // 품질/감사 기능 추가
  QualityDashboard,
  AuditLogs,
  QualityReport,
  AuditSettings
} from './components/Admin';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Auth Routes - TODO: 나중에 구현 예정 */}
            {/* <Route path="/login" element={<LoginPage />} /> */}
            
            {/* 로그인 페이지 접근 시 대시보드로 리다이렉트 */}
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            
            {/* Main Routes with DashboardLayout */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <EnhancedDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/bid-list" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <EnhancedBidList />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/bid-detail/:bidNo" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <BidDetail />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/references" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ReferenceManager />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <EnhancedNotification />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/statistics" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StatisticsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/integration" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <IntegrationPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/personal" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PersonalPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/color-demo" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ColorSystemDemo />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/ui-demo" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UIComponentsDemo />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            } />
            <Route path="/admin/users" element={
              <AdminLayout>
                <UserManagement />
              </AdminLayout>
            } />
            <Route path="/admin/logs" element={
              <AdminLayout>
                <SystemLogs />
              </AdminLayout>
            } />
            <Route path="/admin/fetch-logs" element={
              <AdminLayout>
                <FetchLogs />
              </AdminLayout>
            } />
            <Route path="/admin/notifications" element={
              <AdminLayout>
                <AdminNotificationSettings />
              </AdminLayout>
            } />
            <Route path="/admin/reports" element={
              <AdminLayout>
                <ReportSettings />
              </AdminLayout>
            } />
            <Route path="/admin/system" element={
              <AdminLayout>
                <SystemSettings />
              </AdminLayout>
            } />
            <Route path="/admin/backups" element={
              <AdminLayout>
                <BackupManagement />
              </AdminLayout>
            } />
            
            {/* 품질/감사 기능 라우트 */}
            <Route path="/admin/quality" element={
              <AdminLayout>
                <QualityDashboard />
              </AdminLayout>
            } />
            <Route path="/admin/audit-logs" element={
              <AdminLayout>
                <AuditLogs />
              </AdminLayout>
            } />
            <Route path="/admin/quality-report" element={
              <AdminLayout>
                <QualityReport />
              </AdminLayout>
            } />
            <Route path="/admin/audit-settings" element={
              <AdminLayout>
                <AuditSettings />
              </AdminLayout>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
