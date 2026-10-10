import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  Cpu,
  UserCheck,
  Receipt,
  Bell,
  Settings,
  Home,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { unreadNotificationsCount, pendingRepairsCount, resetToSampleData, settings } = useApp();

  const navItems = [
    { to: '/', label: 'Home Dashboard', icon: LayoutDashboard },
    {
      to: '/maintenance',
      label: 'Maintenance & Repairs',
      icon: Wrench,
      badge: pendingRepairsCount > 0 ? pendingRepairsCount : null,
      badgeType: 'warning'
    },
    { to: '/assets', label: 'Appliances & Assets', icon: Cpu },
    { to: '/services', label: 'Home Services', icon: UserCheck },
    { to: '/expenses', label: 'Expenses & Bills', icon: Receipt },
    {
      to: '/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null,
      badgeType: 'danger'
    },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 99,
          }}
        />
      )}

      <aside
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: isCollapsed ? '80px' : 'var(--sidebar-width)',
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          transition: 'var(--transition)',
          transform:
            window.innerWidth <= 768 && !isMobileOpen
              ? 'translateX(-100%)'
              : 'translateX(0)',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 'var(--navbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            padding: isCollapsed ? '0' : '0 20px',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)',
              }}
            >
              <Home size={22} />
            </div>
            {!isCollapsed && (
              <div>
                <span
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: 'var(--text-main)',
                  }}
                >
                  Home<span style={{ color: 'var(--primary)' }}>Care</span>
                </span>
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Smart Management
                </div>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="btn-ghost btn-icon-only desktop-only"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              display: window.innerWidth <= 768 ? 'none' : 'flex',
              padding: '6px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav
          style={{
            flex: 1,
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            overflowY: 'auto',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleLinkClick}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: isCollapsed ? '12px' : '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--primary)' : 'var(--text-sub)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'var(--transition)',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  position: 'relative',
                })}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={20} style={{ flexShrink: 0 }} />
                {!isCollapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                {!isCollapsed && item.badge && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor:
                        item.badgeType === 'danger'
                          ? '#fee2e2'
                          : 'var(--warning-bg)',
                      color:
                        item.badgeType === 'danger'
                          ? 'var(--danger)'
                          : '#b45309',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {isCollapsed && item.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '10px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor:
                        item.badgeType === 'danger'
                          ? 'var(--danger)'
                          : '#f59e0b',
                    }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile & Reset Demo */}
        <div
          style={{
            padding: '14px 12px',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: isCollapsed ? '6px 0' : '6px 8px',
              borderRadius: 'var(--radius-md)',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
            }}
          >
            <img
              src={settings.profile.avatar}
              alt={settings.profile.fullName}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--border-color)',
              }}
            />
            {!isCollapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {settings.profile.fullName}
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {settings.home.homeName}
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={resetToSampleData}
              className="btn btn-ghost btn-sm"
              style={{
                width: '100%',
                marginTop: '10px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                justifyContent: 'center',
                border: '1px dashed var(--border-color)',
              }}
              title="Reset application to realistic sample data"
            >
              <RotateCcw size={13} />
              Reset Demo Data
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
