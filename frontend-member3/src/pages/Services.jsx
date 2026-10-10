import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  Eye,
  Send,
  Wrench,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';

export const Services = () => {
  const {
    serviceProviders,
    serviceRequests,
    repairs,
    addServiceRequest,
    updateServiceRequestStatus
  } = useApp();

  // Active view tab: 'marketplace' | 'requests'
  const [activeTab, setActiveTab] = useState('marketplace');

  // Search & Filters for Providers
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minRating, setMinRating] = useState('0');
  const [maxPrice, setMaxPrice] = useState('100');

  // Modals
  const [viewingProvider, setViewingProvider] = useState(null);
  const [bookingProvider, setBookingProvider] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);

  // Request Service Form State
  const [requestForm, setRequestForm] = useState({
    title: '',
    problemDescription: '',
    location: 'Living Room',
    preferredDate: '',
    preferredTime: '10:00 AM',
    estimatedCost: '',
    linkedRepairId: ''
  });

  const categories = [
    'All',
    'Plumber',
    'Electrician',
    'Carpenter',
    'Painter',
    'Cleaner',
    'AC Technician',
    'Mason',
    'Pest Control Worker',
    'Appliance Technician',
    'Gardener'
  ];

  // Filtered Providers
  const filteredProviders = useMemo(() => {
    return serviceProviders.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.serviceArea && p.serviceArea.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      const matchesRating = Number(p.rating) >= Number(minRating);
      const matchesPrice = Number(p.approxPrice) <= Number(maxPrice);

      return matchesSearch && matchesCategory && matchesRating && matchesPrice;
    });
  }, [serviceProviders, searchQuery, selectedCategory, minRating, maxPrice]);

  // Handle open request modal
  const handleOpenBookingModal = (provider) => {
    setBookingProvider(provider);
    setRequestForm({
      title: `${provider.category} Consultation & Repair`,
      problemDescription: '',
      location: 'Living Room',
      preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      preferredTime: '10:00 AM',
      estimatedCost: provider.approxPrice || 50,
      linkedRepairId: ''
    });
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!bookingProvider || !requestForm.title.trim()) return;

    addServiceRequest({
      providerId: bookingProvider.id,
      providerName: bookingProvider.name,
      category: bookingProvider.category,
      title: requestForm.title,
      problemDescription: requestForm.problemDescription,
      location: requestForm.location,
      preferredDate: requestForm.preferredDate,
      preferredTime: requestForm.preferredTime,
      estimatedCost: Number(requestForm.estimatedCost) || bookingProvider.approxPrice,
      repairId: requestForm.linkedRepairId || null
    });

    setBookingProvider(null);
    setActiveTab('requests'); // Switch to requests tab to see newly created request!
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Home Services Marketplace</h1>
          <p style={{ marginTop: '4px' }}>
            Browse verified local contractors, compare hourly rates, and manage service requests.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-subtle)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          <button
            className={`btn btn-sm ${activeTab === 'marketplace' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('marketplace')}
          >
            Find Professionals ({serviceProviders.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'requests' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('requests')}
          >
            My Service Requests ({serviceRequests.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <>
          {/* Filters Bar */}
          <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
            <div className="filter-bar" style={{ margin: 0 }}>
              <div className="search-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by name, skill, zone, keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-actions">
                {/* Category Filter */}
                <select
                  className="filter-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      Category: {c}
                    </option>
                  ))}
                </select>

                {/* Rating Filter */}
                <select
                  className="filter-select"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                >
                  <option value="0">All Ratings</option>
                  <option value="4.5">★ 4.5 & up</option>
                  <option value="4.8">★ 4.8 & up</option>
                </select>

                {/* Price Filter */}
                <select
                  className="filter-select"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                >
                  <option value="100">All Price Ranges</option>
                  <option value="40">Under $40</option>
                  <option value="50">Under $50</option>
                  <option value="60">Under $60</option>
                </select>
              </div>
            </div>
          </div>

          {/* Service Provider Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}
          >
            {filteredProviders.length === 0 ? (
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="card">
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <UserCheck size={24} />
                    </div>
                    <h3>No service professionals match your filter</h3>
                    <p>Try resetting the category or expanding your price and rating limits.</p>
                  </div>
                </div>
              </div>
            ) : (
              filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '20px'
                  }}
                >
                  <div>
                    {/* Header with Avatar & Details */}
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <img
                        src={provider.avatar}
                        alt={provider.name}
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid var(--border-color)'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            {provider.name}
                          </h3>
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', marginTop: '2px' }}>
                          {provider.category}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#b45309', fontWeight: 700 }}>
                            <Star size={13} fill="#f59e0b" color="#f59e0b" /> {provider.rating} ({provider.reviewsCount})
                          </span>
                          <span>•</span>
                          <span>{provider.experience} yrs exp</span>
                        </div>
                      </div>
                    </div>

                    {/* Description snippet */}
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-sub)', marginBottom: '14px', lineHeight: 1.4 }}>
                      {provider.description}
                    </p>

                    {/* Metadata Pill Box */}
                    <div
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        fontSize: '0.78rem',
                        marginBottom: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Estimated Rate:</span>
                        <strong style={{ color: 'var(--text-main)' }}>${provider.approxPrice} {provider.priceUnit}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Availability:</span>
                        <StatusBadge status={provider.availability} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Coverage Zone:</span>
                        <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{provider.serviceArea}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => setViewingProvider(provider)}
                    >
                      View Profile
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleOpenBookingModal(provider)}
                    >
                      Request Service
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* VIEW 2: SUBMITTED SERVICE REQUESTS */}
      {activeTab === 'requests' && (
        <div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job / Request Title</th>
                  <th>Service Professional</th>
                  <th>Preferred Date & Time</th>
                  <th>Location</th>
                  <th>Estimated Cost</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {serviceRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      <div className="empty-state">
                        <div className="empty-state-icon">
                          <UserCheck size={24} />
                        </div>
                        <h3>No service requests booked yet</h3>
                        <p>Browse available technicians to request maintenance or repairs.</p>
                        <button onClick={() => setActiveTab('marketplace')} className="btn btn-primary btn-sm">
                          Browse Professionals
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  serviceRequests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{req.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ID: {req.id} • Created {req.createdAt}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{req.providerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.category}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{req.preferredDate}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.preferredTime}</div>
                      </td>

                      <td>{req.location || 'House'}</td>

                      <td>
                        <strong>${req.estimatedCost || 0}</strong>
                      </td>

                      <td>
                        <StatusBadge status={req.status} />
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                          {/* Workflow status quick update */}
                          <select
                            className="filter-select"
                            value={req.status}
                            onChange={(e) => updateServiceRequestStatus(req.id, e.target.value)}
                            style={{ fontSize: '0.75rem', padding: '4px 6px' }}
                          >
                            <option value="Requested">Requested</option>
                            <option value="Accepted">Accepted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '6px' }}
                            title="View Request Details"
                            onClick={() => setViewingRequest(req)}
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW PROVIDER PROFILE MODAL */}
      <Modal
        isOpen={!!viewingProvider}
        onClose={() => setViewingProvider(null)}
        title="Service Professional Profile"
        size="lg"
      >
        {viewingProvider && (
          <div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <img
                src={viewingProvider.avatar}
                alt={viewingProvider.name}
                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{viewingProvider.name}</h2>
                <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                  {viewingProvider.category}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span style={{ color: '#b45309', fontWeight: 700 }}>
                    ★ {viewingProvider.rating} ({viewingProvider.reviewsCount} customer reviews)
                  </span>
                  <span>•</span>
                  <span>{viewingProvider.experience} Years of Field Experience</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '6px' }}>About & Qualifications</h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-sub)' }}>
                {viewingProvider.description}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                padding: '16px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                fontSize: '0.85rem'
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                <div><strong>{viewingProvider.phone}</strong></div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                <div><strong>{viewingProvider.email}</strong></div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Service Area:</span>
                <div><strong>{viewingProvider.serviceArea}</strong></div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Rate:</span>
                <div><strong>${viewingProvider.approxPrice} {viewingProvider.priceUnit}</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-outline" onClick={() => setViewingProvider(null)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const p = viewingProvider;
                  setViewingProvider(null);
                  handleOpenBookingModal(p);
                }}
              >
                Request Service From {viewingProvider.name.split(' ')[0]}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* REQUEST SERVICE MODAL */}
      <Modal
        isOpen={!!bookingProvider}
        onClose={() => setBookingProvider(null)}
        title={`Book Service: ${bookingProvider?.name} (${bookingProvider?.category})`}
        size="lg"
      >
        {bookingProvider && (
          <form onSubmit={handleSubmitRequest}>
            <div className="form-group">
              <label className="form-label">Service Request Title *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Master Bathroom Drain Valve Replacement"
                value={requestForm.title}
                onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Preferred Date *</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={requestForm.preferredDate}
                  onChange={(e) => setRequestForm({ ...requestForm, preferredDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time Window</label>
                <select
                  className="form-control"
                  value={requestForm.preferredTime}
                  onChange={(e) => setRequestForm({ ...requestForm, preferredTime: e.target.value })}
                >
                  <option value="09:00 AM">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="01:00 PM">Afternoon (01:00 PM - 04:00 PM)</option>
                  <option value="05:00 PM">Evening (05:00 PM - 08:00 PM)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Service Location / Room</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Living Room, Garage, Roof"
                  value={requestForm.location}
                  onChange={(e) => setRequestForm({ ...requestForm, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Budget ($)</label>
                <input
                  type="number"
                  className="form-control"
                  value={requestForm.estimatedCost}
                  onChange={(e) => setRequestForm({ ...requestForm, estimatedCost: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Link to Existing Repair Ticket (Optional)</label>
              <select
                className="form-control"
                value={requestForm.linkedRepairId}
                onChange={(e) => setRequestForm({ ...requestForm, linkedRepairId: e.target.value })}
              >
                <option value="">-- No Linked Repair --</option>
                {repairs.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.problemName} ({r.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Problem Description & Notes</label>
              <textarea
                className="form-control"
                placeholder="Explain the specific issue, model numbers, access details for the technician..."
                value={requestForm.problemDescription}
                onChange={(e) => setRequestForm({ ...requestForm, problemDescription: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setBookingProvider(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Send Service Request
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* VIEW SUBMITTED REQUEST DETAILS MODAL */}
      <Modal
        isOpen={!!viewingRequest}
        onClose={() => setViewingRequest(null)}
        title="Service Request Details"
      >
        {viewingRequest && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{viewingRequest.title}</h3>
              <StatusBadge status={viewingRequest.status} />
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.85rem',
                marginBottom: '16px'
              }}
            >
              <div><strong>Technician:</strong> {viewingRequest.providerName} ({viewingRequest.category})</div>
              <div><strong>Appointment:</strong> {viewingRequest.preferredDate} at {viewingRequest.preferredTime}</div>
              <div><strong>Location:</strong> {viewingRequest.location || 'House'}</div>
              <div><strong>Estimated Cost:</strong> ${viewingRequest.estimatedCost}</div>
              <div><strong>Requested on:</strong> {viewingRequest.createdAt}</div>
              {viewingRequest.repairId && (
                <div><strong>Linked Repair Ticket:</strong> {viewingRequest.repairId}</div>
              )}
            </div>

            {viewingRequest.problemDescription && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Problem Description</h4>
                <p style={{ fontSize: '0.85rem' }}>{viewingRequest.problemDescription}</p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-primary" onClick={() => setViewingRequest(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
