import React from 'react';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </div>
  );
}

export default App;
