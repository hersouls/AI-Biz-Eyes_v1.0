import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './components/Dashboard/Dashboard';
import { BidList } from './components/BidList/BidList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bid-list" element={<BidList />} />
          </Routes>
        </DashboardLayout>
      </div>
    </Router>
  );
}

export default App;
