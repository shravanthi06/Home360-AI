import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let iconColor = 'var(--primary)';
        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'var(--danger)';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'var(--info)';
        }

        return (
          <div
            key={toast.id}
            className={`toast ${toast.type === 'error' ? 'toast-error' : toast.type === 'info' ? 'toast-info' : ''}`}
          >
            <Icon size={20} color={iconColor} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: '0.85rem' }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="btn-ghost btn-icon-only"
              style={{ padding: '2px', cursor: 'pointer', border: 'none', background: 'transparent' }}
            >
              <X size={16} color="var(--text-muted)" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
