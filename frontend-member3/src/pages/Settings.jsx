import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Home,
  Bell,
  Palette,
  Shield,
  Save,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Settings = () => {
  const { settings, updateSettings, resetToSampleData } = useApp();

  const [formData, setFormData] = useState({
    profile: { ...settings.profile },
    home: { ...settings.home },
    preferences: { ...settings.preferences }
  });

  const [activeSection, setActiveSection] = useState('profile'); // 'profile' | 'home' | 'notifications' | 'data'

  const handleProfileChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value }
    }));
  };

  const handleHomeChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      home: { ...prev.home, [field]: value }
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formData);
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
          marginBottom: '24px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Settings & Preferences</h1>
          <p style={{ marginTop: '4px' }}>
            Manage homeowner profile, property specifications, alert frequencies, and sample data.
          </p>
        </div>

        <button onClick={handleSave} className="btn btn-primary">
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        {/* Navigation Tabs */}
        <div className="card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              onClick={() => setActiveSection('profile')}
              className={`btn ${activeSection === 'profile' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.85rem' }}
            >
              <User size={16} />
              Owner Profile
            </button>
            <button
              onClick={() => setActiveSection('home')}
              className={`btn ${activeSection === 'home' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.85rem' }}
            >
              <Home size={16} />
              Home Details
            </button>
            <button
              onClick={() => setActiveSection('notifications')}
              className={`btn ${activeSection === 'notifications' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.85rem' }}
            >
              <Bell size={16} />
              Alert Preferences
            </button>
            <button
              onClick={() => setActiveSection('data')}
              className={`btn ${activeSection === 'data' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.85rem' }}
            >
              <RotateCcw size={16} />
              Data & Storage
            </button>
          </div>
        </div>

        {/* Form Content Area */}
        <div className="card" style={{ padding: '28px' }}>
          <form onSubmit={handleSave}>
            {/* SECTION 1: PROFILE */}
            {activeSection === 'profile' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
                  Owner Profile Information
                </h3>
                <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
                  Update your contact details and homeowner identity.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <img
                    src={formData.profile.avatar}
                    alt={formData.profile.fullName}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <label className="form-label" style={{ marginBottom: '4px' }}>Avatar URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.profile.avatar}
                      onChange={(e) => handleProfileChange('avatar', e.target.value)}
                      style={{ fontSize: '0.8rem', width: '320px' }}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.profile.fullName}
                      onChange={(e) => handleProfileChange('fullName', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* SECTION 2: HOME DETAILS */}
            {activeSection === 'home' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
                  Property & Home Specifications
                </h3>
                <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
                  Information about your residence, dimensions, and floor plans.
                </p>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Property Name / Nickname</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.home.homeName}
                      onChange={(e) => handleHomeChange('homeName', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Property Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.home.propertyType}
                      onChange={(e) => handleHomeChange('propertyType', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.home.address}
                    onChange={(e) => handleHomeChange('address', e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Total Living Area</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.home.totalArea}
                      onChange={(e) => handleHomeChange('totalArea', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Construction Year</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.home.builtYear}
                      onChange={(e) => handleHomeChange('builtYear', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Rooms & Layout</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.home.rooms}
                    onChange={(e) => handleHomeChange('rooms', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* SECTION 3: ALERT PREFERENCES */}
            {activeSection === 'notifications' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
                  Notification Rules & Reminders
                </h3>
                <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
                  Configure when alerts are triggered for appliances and maintenance.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.preferences.emailAlerts}
                      onChange={(e) => handlePreferenceChange('emailAlerts', e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Send Email Reminders</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Receive weekly digest of scheduled maintenance visits
                      </div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.preferences.smsAlerts}
                      onChange={(e) => handlePreferenceChange('smsAlerts', e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>SMS Urgent Notifications</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Immediate text alerts when urgent repair tickets are reported
                      </div>
                    </div>
                  </label>
                </div>

                <div className="form-row" style={{ marginTop: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Warranty Expiry Alert (Days in advance)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.preferences.warrantyReminderDays}
                      onChange={(e) => handlePreferenceChange('warrantyReminderDays', Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Service Due Reminder (Days in advance)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.preferences.serviceReminderDays}
                      onChange={(e) => handlePreferenceChange('serviceReminderDays', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: DATA & STORAGE */}
            {activeSection === 'data' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
                  Application Data Management
                </h3>
                <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
                  This application uses browser localStorage to preserve your changes across sessions.
                </p>

                <div
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '20px'
                  }}
                >
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>
                    Reset Sample Demo Data
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Restore all original sample appliances, repair tickets, utility bills, and service contractors.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset all sample data to default? Any custom tickets created will be overwritten.')) {
                        resetToSampleData();
                      }
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#b45309' }}
                  >
                    <RotateCcw size={14} />
                    Reset to Default Sample Data
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
