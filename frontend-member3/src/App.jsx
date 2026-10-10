import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';

import { Dashboard } from './pages/Dashboard';
import { Maintenance } from './pages/Maintenance';
import { Assets } from './pages/Assets';
import { Services } from './pages/Services';
import { Expenses } from './pages/Expenses';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';

export function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="app-layout">
      {/* Toast Notification Layer */}
      <Toast />

      {/* Responsive Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className={`main-content-wrapper ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/services" element={<Services />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
