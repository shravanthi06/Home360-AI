import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Receipt,
  UserCheck,
  Wrench,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Notifications = () => {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    unreadNotificationsCount
  } = useApp();

  const [filterType, setFilterType] = useState('all'); // 'all' | 'unread' | 'read'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'repair' | 'service' | 'warranty' | 'bill'

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (filterType === 'unread' && n.read) return false;
      if (filterType === 'read' && !n.read) return false;

      if (categoryFilter !== 'all' && n.type !== categoryFilter) return false;

      return true;
    });
  }, [notifications, filterType, categoryFilter]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'repair':
        return <Wrench size={18} color="#ef4444" />;
      case 'service':
        return <UserCheck size={18} color="#16a34a" />;
      case 'warranty':
        return <ShieldCheck size={18} color="#0284c7" />;
      case 'bill':
        return <Receipt size={18} color="#f59e0b" />;
      default:
        return <Bell size={18} color="var(--primary)" />;
    }
  };

  return (
    <div className="page-container">
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Notification Center</h1>
          <p style={{ marginTop: '4px' }}>
            Alerts for scheduled appliance checks, warranty deadlines, invoices, and technician statuses.
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <button onClick={markAllNotificationsRead} className="btn btn-outline">
            <CheckCheck size={16} />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter and Status Controls */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilterType('all')}
            >
              All ({notifications.length})
            </button>
            <button
              className={`btn btn-sm ${filterType === 'unread' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilterType('unread')}
            >
              Unread ({unreadNotificationsCount})
            </button>
            <button
              className={`btn btn-sm ${filterType === 'read' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilterType('read')}
            >
              Read ({notifications.length - unreadNotificationsCount})
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter Category:</span>
            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '6px 10px' }}
            >
              <option value="all">All Alert Types</option>
              <option value="repair">Repairs & Breakdowns</option>
              <option value="service">Technician Visits</option>
              <option value="warranty">Warranty Deadlines</option>
              <option value="bill">Utility Bills</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredNotifications.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">
                <Bell size={24} />
              </div>
              <h3>No notifications in this filter</h3>
              <p>You're all caught up! New reminders and status updates will appear here.</p>
            </div>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '16px 20px',
                backgroundColor: notif.read ? '#ffffff' : '#f0fdf4',
                borderColor: notif.read ? 'var(--border-color)' : '#86efac',
                transition: 'var(--transition)'
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: notif.read ? 'var(--bg-subtle)' : '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              >
                {getNotificationIcon(notif.type)}
              </div>

              {/* Message Details */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h4
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: notif.read ? 600 : 800,
                      color: 'var(--text-main)'
                    }}
                  >
                    {notif.title}
                  </h4>
                  {!notif.read && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--primary)',
                        color: '#ffffff',
                        padding: '1px 7px',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      NEW
                    </span>
                  )}
                  {notif.priority === 'high' && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        backgroundColor: '#fee2e2',
                        color: 'var(--danger)',
                        padding: '1px 7px',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      URGENT
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginTop: '4px', lineHeight: 1.4 }}>
                  {notif.message}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>{notif.date}</span>
                  {notif.link && (
                    <button
                      onClick={() => {
                        markNotificationRead(notif.id);
                        navigate(notif.link);
                      }}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '2px 6px', color: 'var(--primary)', fontWeight: 700 }}
                    >
                      Go to module <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {!notif.read && (
                  <button
                    onClick={() => markNotificationRead(notif.id)}
                    className="btn btn-ghost btn-sm"
                    title="Mark as read"
                    style={{ padding: '6px' }}
                  >
                    <CheckCircle2 size={16} color="var(--primary)" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="btn btn-ghost btn-sm"
                  title="Delete notification"
                  style={{ padding: '6px', color: 'var(--text-muted)' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
