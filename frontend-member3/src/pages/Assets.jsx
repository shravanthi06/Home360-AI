import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Calendar,
  Wrench,
  Edit2,
  Trash2,
  Eye,
  PlusCircle,
  Tag,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';

export const Assets = () => {
  const {
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    addAssetServiceHistory,
    addRepair,
    serviceDueAssets,
    expiringWarranties
  } = useApp();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [warrantyFilter, setWarrantyFilter] = useState('All'); // 'All' | 'Active' | 'Expiring' | 'Expired'

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [viewingAsset, setViewingAsset] = useState(null);
  const [deletingAssetId, setDeletingAssetId] = useState(null);
  const [serviceLoggingAsset, setServiceLoggingAsset] = useState(null);

  // Form State for Add / Edit
  const initialAssetForm = {
    name: '',
    category: 'AC',
    brand: '',
    model: '',
    purchaseDate: '',
    purchasePrice: '',
    warrantyDuration: '2 Years',
    warrantyExpiry: '',
    lastServiceDate: '',
    nextServiceDate: '',
    location: '',
    condition: 'Good',
    notes: ''
  };
  const [formData, setFormData] = useState(initialAssetForm);

  // Log Service Form State
  const [serviceLogForm, setServiceLogForm] = useState({
    date: new Date().toISOString().split('T')[0],
    serviceType: 'Routine Servicing',
    technician: '',
    cost: '',
    notes: ''
  });

  const categories = [
    'All',
    'AC',
    'Refrigerator',
    'Washing Machine',
    'TV',
    'Water Purifier',
    'Water Heater',
    'Inverter',
    'Microwave',
    'Water Tank',
    'Solar System',
    'Generator',
    'Furniture',
    'Security Equipment'
  ];

  // Helper for warranty calculations
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const getWarrantyInfo = (expiryStr) => {
    if (!expiryStr) return { status: 'Unknown', text: 'No warranty data', days: 0 };
    const expiry = new Date(expiryStr);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'Expired', text: `Expired ${Math.abs(diffDays)} days ago`, days: diffDays };
    }
    if (diffDays <= 45) {
      return { status: 'Expiring Soon', text: `${diffDays} days remaining`, days: diffDays };
    }
    return { status: 'Active', text: `Active (${diffDays} days left)`, days: diffDays };
  };

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.model && asset.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (asset.location && asset.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || asset.category === selectedCategory;

      const matchesCondition =
        selectedCondition === 'All' || asset.condition === selectedCondition;

      const warranty = getWarrantyInfo(asset.warrantyExpiry);
      const matchesWarranty =
        warrantyFilter === 'All' ||
        (warrantyFilter === 'Active' && warranty.status === 'Active') ||
        (warrantyFilter === 'Expiring' && warranty.status === 'Expiring Soon') ||
        (warrantyFilter === 'Expired' && warranty.status === 'Expired');

      return matchesSearch && matchesCategory && matchesCondition && matchesWarranty;
    });
  }, [assets, searchQuery, selectedCategory, selectedCondition, warrantyFilter]);

  // Form Handlers
  const handleOpenAddModal = () => {
    setEditingAsset(null);
    setFormData(initialAssetForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name || '',
      category: asset.category || 'AC',
      brand: asset.brand || '',
      model: asset.model || '',
      purchaseDate: asset.purchaseDate || '',
      purchasePrice: asset.purchasePrice ?? '',
      warrantyDuration: asset.warrantyDuration || '2 Years',
      warrantyExpiry: asset.warrantyExpiry || '',
      lastServiceDate: asset.lastServiceDate || '',
      nextServiceDate: asset.nextServiceDate || '',
      location: asset.location || '',
      condition: asset.condition || 'Good',
      notes: asset.notes || ''
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingAsset) {
      updateAsset(editingAsset.id, formData);
    } else {
      addAsset(formData);
    }
    setIsAddModalOpen(false);
    setEditingAsset(null);
  };

  const confirmDelete = () => {
    if (deletingAssetId) {
      deleteAsset(deletingAssetId);
      setDeletingAssetId(null);
    }
  };

  const handleLogService = (e) => {
    e.preventDefault();
    if (!serviceLoggingAsset) return;
    addAssetServiceHistory(serviceLoggingAsset.id, {
      ...serviceLogForm,
      cost: Number(serviceLogForm.cost) || 0
    });
    setServiceLoggingAsset(null);
    setServiceLogForm({
      date: new Date().toISOString().split('T')[0],
      serviceType: 'Routine Servicing',
      technician: '',
      cost: '',
      notes: ''
    });
  };

  // Quick schedule repair from asset
  const handleScheduleRepairFromAsset = (asset) => {
    addRepair({
      problemName: `${asset.name} - Maintenance Service`,
      category: 'General Repairs',
      description: `Scheduled maintenance check for ${asset.name} (${asset.brand} ${asset.model}). Current condition: ${asset.condition}.`,
      location: asset.location || 'House',
      priority: 'Medium',
      dueDate: asset.nextServiceDate || new Date().toISOString().split('T')[0],
      estimatedCost: 60,
      serviceProvider: 'Unassigned',
      notes: `Triggered from Asset inventory for ${asset.id}`
    });
    setViewingAsset(null);
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Appliances & Assets</h1>
          <p style={{ marginTop: '4px' }}>
            Maintain full inventory of home appliances, electronics, warranty milestones, and service history.
          </p>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <Plus size={18} />
          Register New Asset
        </button>
      </div>

      {/* Metrics Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '20px'
        }}
      >
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Assets Tracked</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px' }}>{assets.length}</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Service Due Soon</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: '#7c3aed' }}>
            {serviceDueAssets.length}
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Expiring Warranties</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: '#0284c7' }}>
            {expiringWarranties.length}
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Inventory Value</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: 'var(--primary)' }}>
            ${assets.reduce((sum, a) => sum + (Number(a.purchasePrice) || 0), 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by appliance, brand, model..."
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

            {/* Condition Filter */}
            <select
              className="filter-select"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
            >
              <option value="All">All Conditions</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Needs Attention">Needs Attention</option>
            </select>

            {/* Warranty Status Filter */}
            <select
              className="filter-select"
              value={warrantyFilter}
              onChange={(e) => setWarrantyFilter(e.target.value)}
            >
              <option value="All">All Warranties</option>
              <option value="Active">Active Warranty</option>
              <option value="Expiring">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}
      >
        {filteredAssets.length === 0 ? (
          <div style={{ gridColumn: '1 / -1' }}>
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Cpu size={24} />
                </div>
                <h3>No assets matched your search</h3>
                <p>Try resetting the category filter or register a new appliance.</p>
                <button onClick={handleOpenAddModal} className="btn btn-primary btn-sm">
                  Add Asset
                </button>
              </div>
            </div>
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const warranty = getWarrantyInfo(asset.warrantyExpiry);
            const isServiceDue =
              asset.nextServiceDate &&
              Math.ceil((new Date(asset.nextServiceDate) - today) / (1000 * 60 * 60 * 24)) <= 14;

            return (
              <div
                key={asset.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: isServiceDue ? '4px solid #8b5cf6' : '1px solid var(--border-color)'
                }}
              >
                <div>
                  {/* Category & Condition */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      {asset.category} • {asset.brand}
                    </span>
                    <StatusBadge status={asset.condition} type="condition" />
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                    {asset.name}
                  </h3>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Model: <strong style={{ color: 'var(--text-sub)' }}>{asset.model || 'Standard'}</strong> • Location: {asset.location || 'Home'}
                  </div>

                  {/* Highlights block */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '0.8rem',
                      marginBottom: '14px'
                    }}
                  >
                    {/* Warranty */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={14} /> Warranty:
                      </span>
                      <StatusBadge status={warranty.status} type="warranty" />
                    </div>

                    {/* Next Service Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} /> Next Service:
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: isServiceDue ? '#7c3aed' : 'var(--text-main)'
                        }}
                      >
                        {asset.nextServiceDate || 'Not scheduled'}
                        {isServiceDue && ' (Due)'}
                      </span>
                    </div>

                    {/* Purchase Price */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <DollarSign size={14} /> Purchase Cost:
                      </span>
                      <strong>${asset.purchasePrice || 0}</strong>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-color)'
                  }}
                >
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setViewingAsset(asset)}
                  >
                    <Eye size={14} /> Details & History
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '6px' }}
                      title="Log Service Record"
                      onClick={() => setServiceLoggingAsset(asset)}
                    >
                      <Wrench size={16} color="var(--primary)" />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '6px' }}
                      title="Edit Asset"
                      onClick={() => handleOpenEditModal(asset)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '6px', color: 'var(--danger)' }}
                      title="Delete Asset"
                      onClick={() => setDeletingAssetId(asset.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD / EDIT ASSET MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingAsset ? 'Edit Household Asset' : 'Register New Asset / Appliance'}
        size="lg"
      >
        <form onSubmit={handleSubmitForm}>
          <div className="form-group">
            <label className="form-label">Asset Name *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Daikin 1.5T 5-Star Split AC"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <optgroup label="Appliances">
                  {['AC', 'Refrigerator', 'Washing Machine', 'TV', 'Water Purifier', 'Water Heater', 'Inverter', 'Microwave'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="Other Household Assets">
                  {['Water Tank', 'Solar System', 'Generator', 'Furniture', 'Security Equipment'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Brand</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Samsung, Daikin, Bosch"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Model Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. RF57A5032S9"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Purchase Price ($)</label>
              <input
                type="number"
                className="form-control"
                placeholder="850"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Purchase Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Warranty Expiry Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.warrantyExpiry}
                onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Last Service Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.lastServiceDate}
                onChange={(e) => setFormData({ ...formData, lastServiceDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Next Service Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.nextServiceDate}
                onChange={(e) => setFormData({ ...formData, nextServiceDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location / Room</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Living Room, Kitchen"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Condition</label>
              <select
                className="form-control"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Needs Attention">Needs Attention</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes & Specifications</label>
            <textarea
              className="form-control"
              placeholder="Capacity, inverter details, dealer contact, filter model..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingAsset ? 'Save Changes' : 'Register Asset'}
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW ASSET DETAILS & SERVICE HISTORY MODAL */}
      <Modal
        isOpen={!!viewingAsset}
        onClose={() => setViewingAsset(null)}
        title="Asset Specification & Service History"
        size="lg"
      >
        {viewingAsset && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Asset ID: {viewingAsset.id}
                </span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '2px' }}>
                  {viewingAsset.name}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {viewingAsset.brand} • Model {viewingAsset.model || 'N/A'} • {viewingAsset.location}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <StatusBadge status={viewingAsset.condition} type="condition" />
                <StatusBadge status={getWarrantyInfo(viewingAsset.warrantyExpiry).status} type="warranty" />
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                padding: '14px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                fontSize: '0.85rem'
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Warranty Expiry:</span>
                <div>
                  <strong>{viewingAsset.warrantyExpiry || 'N/A'}</strong>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {getWarrantyInfo(viewingAsset.warrantyExpiry).text}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Next Service Date:</span>
                <div>
                  <strong>{viewingAsset.nextServiceDate || 'None'}</strong>
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Original Cost:</span>
                <div>
                  <strong>${viewingAsset.purchasePrice || 0}</strong>
                </div>
              </div>
            </div>

            {/* Service History Timeline */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Service & Maintenance Log</h3>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setServiceLoggingAsset(viewingAsset);
                  }}
                >
                  <Plus size={14} /> Log New Service
                </button>
              </div>

              {(!viewingAsset.serviceHistory || viewingAsset.serviceHistory.length === 0) ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No maintenance visits recorded yet for this asset.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {viewingAsset.serviceHistory.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 14px',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                        <span>{item.serviceType}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{item.date}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Performed by: <strong>{item.technician || 'Technician'}</strong> • Cost: ${item.cost || 0}
                      </div>
                      {item.notes && (
                        <div style={{ fontSize: '0.8rem', marginTop: '6px', color: 'var(--text-sub)' }}>
                          {item.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
              <button
                className="btn btn-outline"
                onClick={() => handleScheduleRepairFromAsset(viewingAsset)}
              >
                <Wrench size={16} /> Link / Schedule Repair Ticket
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    const a = viewingAsset;
                    setViewingAsset(null);
                    handleOpenEditModal(a);
                  }}
                >
                  <Edit2 size={16} /> Edit Asset
                </button>
                <button className="btn btn-primary" onClick={() => setViewingAsset(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* LOG SERVICE MODAL */}
      <Modal
        isOpen={!!serviceLoggingAsset}
        onClose={() => setServiceLoggingAsset(null)}
        title={`Log Service Record: ${serviceLoggingAsset?.name}`}
      >
        <form onSubmit={handleLogService}>
          <div className="form-group">
            <label className="form-label">Service Type *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Deep Coil Cleaning & Gas Top-up"
              value={serviceLogForm.serviceType}
              onChange={(e) => setServiceLogForm({ ...serviceLogForm, serviceType: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Service Date *</label>
              <input
                type="date"
                required
                className="form-control"
                value={serviceLogForm.date}
                onChange={(e) => setServiceLogForm({ ...serviceLogForm, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cost Incurred ($)</label>
              <input
                type="number"
                className="form-control"
                placeholder="45"
                value={serviceLogForm.cost}
                onChange={(e) => setServiceLogForm({ ...serviceLogForm, cost: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Technician / Agency Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Elena Rostova (CoolAir Dynamics)"
              value={serviceLogForm.technician}
              onChange={(e) => setServiceLogForm({ ...serviceLogForm, technician: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes & Parts Replaced</label>
            <textarea
              className="form-control"
              placeholder="Replaced pre-filter, oiled motor bearing..."
              value={serviceLogForm.notes}
              onChange={(e) => setServiceLogForm({ ...serviceLogForm, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setServiceLoggingAsset(null)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Service Entry
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <Modal
        isOpen={!!deletingAssetId}
        onClose={() => setDeletingAssetId(null)}
        title="Confirm Asset Removal"
      >
        <p style={{ marginBottom: '20px' }}>
          Are you sure you want to delete this asset from your household registry? All associated warranty and service logs will be permanently erased.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={() => setDeletingAssetId(null)} className="btn btn-outline">
            Cancel
          </button>
          <button onClick={confirmDelete} className="btn btn-danger">
            Delete Asset
          </button>
        </div>
      </Modal>
    </div>
  );
};
