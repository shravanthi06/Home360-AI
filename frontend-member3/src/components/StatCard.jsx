import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#16a34a',
  bgColor = '#dcfce7',
  badgeText,
  badgeType = 'default',
  onClick
}) => {
  return (
    <div
      className="card stat-card"
      style={{
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            {title}
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px', letterSpacing: '-0.02em' }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {subtitle}
            </div>
          )}
        </div>
        {Icon && (
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              flexShrink: 0
            }}
          >
            <Icon size={24} />
          </div>
        )}
      </div>
      {badgeText && (
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: badgeType === 'danger' ? '#fee2e2' : badgeType === 'warning' ? '#fef3c7' : '#dcfce7',
              color: badgeType === 'danger' ? '#ef4444' : badgeType === 'warning' ? '#b45309' : '#16a34a'
            }}
          >
            {badgeText}
          </span>
        </div>
      )}
    </div>
  );
};
