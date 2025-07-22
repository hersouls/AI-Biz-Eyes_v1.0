import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Dashboard from './components/Dashboard/Dashboard';
import { BidList } from './components/BidList/BidList';
import { BidDetail } from './components/BidDetail/BidDetail';
import { ReferenceManager } from './components/Reference';
import { NotificationPage } from './components/Notification';
import { StatisticsPage } from './components/Statistics';
import IntegrationPage from './components/integration/IntegrationPage';
import { PersonalPage } from './components/Personal/PersonalPage';
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
    <Router>
      <div className="App">
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bid-list" element={<BidList />} />
          <Route path="/bid-detail/:bidNo" element={<BidDetail />} />
          <Route path="/references" element={<ReferenceManager />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/integration" element={<IntegrationPage />} />
          <Route path="/personal" element={<PersonalPage />} />
          
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
  );
}

export default App;
