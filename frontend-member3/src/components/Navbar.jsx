import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
  RotateCcw,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar = ({ onMobileMenuToggle, searchQuery, setSearchQuery }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadNotificationsCount, settings, resetToSampleData, healthScore, homeConditionLabel } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Derive current page title
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Home Dashboard';
      case '/maintenance':
        return 'Maintenance & Repairs';
      case '/assets':
        return 'Appliances & Assets';
      case '/services':
        return 'Home Services Marketplace';
      case '/expenses':
        return 'Expenses & Bills';
      case '/notifications':
        return 'Notification Center';
      case '/settings':
        return 'System & Home Settings';
      default:
        return 'Smart Home';
    }
  };

  return (
    <header
      style={{
        height: 'var(--navbar-height)',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onMobileMenuToggle}
          className="btn-ghost btn-icon-only mobile-only"
          style={{
            display: 'none',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
          aria-label="Open menu"
        >
          <Menu size={22} color="var(--text-main)" />
        </button>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {getPageTitle(location.pathname)}
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{settings.home.homeName}</span>
            <span>•</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
              {homeConditionLabel} ({healthScore}%)
            </span>
          </div>
        </div>
      </div>

      {/* Right: Search, Notifications & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Search input in navbar */}
        <div className="search-box" style={{ maxWidth: '280px', display: window.innerWidth < 640 ? 'none' : 'block' }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search records, items..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          />
        </div>

        {/* Notifications Icon */}
        <Link
          to="/notifications"
          className="btn-ghost btn-icon-only"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            color: 'var(--text-sub)',
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
          }}
          title="View Notifications"
        >
          <Bell size={20} />
          {unreadNotificationsCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                backgroundColor: 'var(--danger)',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 2px #ffffff',
              }}
            >
              {unreadNotificationsCount}
            </span>
          )}
        </Link>

        {/* User Profile dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 8px 4px 4px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            <img
              src={settings.profile.avatar}
              alt={settings.profile.fullName}
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span
              style={{
                fontSize: '0.825rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                display: window.innerWidth < 640 ? 'none' : 'block',
              }}
            >
              {settings.profile.fullName}
            </span>
          </button>

          {profileDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '220px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                padding: '8px',
                zIndex: 200,
              }}
              onClick={() => setProfileDropdownOpen(false)}
            >
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{settings.profile.fullName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{settings.profile.email}</div>
              </div>

              <div style={{ padding: '4px 0' }}>
                <button
                  onClick={() => navigate('/settings')}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '8px 12px' }}
                >
                  <Settings size={16} />
                  Settings & Preferences
                </button>
                <button
                  onClick={() => navigate('/notifications')}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '8px 12px' }}
                >
                  <Bell size={16} />
                  Notifications ({unreadNotificationsCount})
                </button>
                <button
                  onClick={resetToSampleData}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem', padding: '8px 12px', color: '#b45309' }}
                >
                  <RotateCcw size={16} />
                  Reset Sample Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
