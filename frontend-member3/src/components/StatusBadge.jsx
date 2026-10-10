import React from 'react';

export const StatusBadge = ({ status, type = 'status' }) => {
  if (!status) return null;

  let badgeClass = 'badge-neutral';
  const s = status.toLowerCase();

  if (type === 'priority') {
    if (s === 'urgent') badgeClass = 'badge-danger';
    else if (s === 'high') badgeClass = 'badge-warning';
    else if (s === 'medium') badgeClass = 'badge-info';
    else badgeClass = 'badge-neutral';
  } else if (type === 'condition') {
    if (s === 'excellent') badgeClass = 'badge-success';
    else if (s === 'good') badgeClass = 'badge-info';
    else if (s === 'fair') badgeClass = 'badge-warning';
    else badgeClass = 'badge-danger';
  } else if (type === 'warranty') {
    if (s === 'active') badgeClass = 'badge-success';
    else if (s === 'expiring soon') badgeClass = 'badge-warning';
    else badgeClass = 'badge-danger';
  } else {
    // Standard status mapping
    if (['completed', 'paid', 'active', 'available'].includes(s)) {
      badgeClass = 'badge-success';
    } else if (['in progress', 'scheduled', 'accepted'].includes(s)) {
      badgeClass = 'badge-info';
    } else if (['reported', 'requested', 'pending'].includes(s)) {
      badgeClass = 'badge-warning';
    } else if (['overdue', 'cancelled', 'expired', 'busy'].includes(s)) {
      badgeClass = 'badge-danger';
    }
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span className="badge-dot" />
      {status}
    </span>
  );
};
