import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import { ReferenceManager } from './components/Reference';
import { NotificationPage } from './components/Notification';
import { 
  AdminLayout,
  AdminDashboard, 
  UserManagement, 
  SystemLogs, 
  FetchLogs, 
  NotificationSettings,
  ReportSettings,
  SystemSettings,
  BackupManagement
} from './components/Admin';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/references" element={<ReferenceManager />} />
          <Route path="/notifications" element={<NotificationPage />} />
          
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
              <NotificationSettings />
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
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
