import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Eye,
  Edit2,
  Trash2,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';

export const Maintenance = () => {
  const {
    repairs,
    serviceProviders,
    addRepair,
    updateRepair,
    deleteRepair,
    updateRepairStatus,
    pendingRepairsCount,
    urgentRepairsCount,
    overdueRepairs
  } = useApp();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'priority' | 'cost'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRepair, setEditingRepair] = useState(null);
  const [viewingRepair, setViewingRepair] = useState(null);
  const [deletingRepairId, setDeletingRepairId] = useState(null);

  // Form State
  const initialFormState = {
    problemName: '',
    category: 'Plumbing',
    description: '',
    location: '',
    priority: 'Medium',
    reportedDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    estimatedCost: '',
    actualCost: '',
    status: 'Reported',
    serviceProvider: 'Unassigned',
    notes: '',
    completionDate: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const categories = [
    'All',
    'Plumbing',
    'Electrical',
    'Painting',
    'Cleaning',
    'Roof',
    'Flooring',
    'Bathroom',
    'Kitchen',
    'Doors & Windows',
    'Pest Control',
    'Water Tank',
    'Garden',
    'General Repairs'
  ];

  // Filtered & Sorted Repairs
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredRepairs = useMemo(() => {
    return repairs
      .filter((r) => {
        const matchesSearch =
          r.problemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.location && r.location.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory =
          selectedCategory === 'All' || r.category === selectedCategory;
        const matchesPriority =
          selectedPriority === 'All' || r.priority === selectedPriority;
        const matchesStatus =
          selectedStatus === 'All' || r.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.reportedDate) - new Date(a.reportedDate);
        }
        if (sortBy === 'priority') {
          const priorityScore = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
          return (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0);
        }
        if (sortBy === 'cost') {
          return (Number(b.estimatedCost) || 0) - (Number(a.estimatedCost) || 0);
        }
        return 0;
      });
  }, [repairs, searchQuery, selectedCategory, selectedPriority, selectedStatus, sortBy]);

  // Form submissions
  const handleOpenAddModal = () => {
    setEditingRepair(null);
    setFormData(initialFormState);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (repair) => {
    setEditingRepair(repair);
    setFormData({
      problemName: repair.problemName || '',
      category: repair.category || 'Plumbing',
      description: repair.description || '',
      location: repair.location || '',
      priority: repair.priority || 'Medium',
      reportedDate: repair.reportedDate || '',
      dueDate: repair.dueDate || '',
      estimatedCost: repair.estimatedCost ?? '',
      actualCost: repair.actualCost ?? '',
      status: repair.status || 'Reported',
      serviceProvider: repair.serviceProvider || 'Unassigned',
      notes: repair.notes || '',
      completionDate: repair.completionDate || ''
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.problemName.trim()) return;

    if (editingRepair) {
      updateRepair(editingRepair.id, formData);
    } else {
      addRepair(formData);
    }
    setIsAddModalOpen(false);
    setEditingRepair(null);
  };

  const confirmDelete = () => {
    if (deletingRepairId) {
      deleteRepair(deletingRepairId);
      setDeletingRepairId(null);
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Maintenance & Repairs</h1>
          <p style={{ marginTop: '4px' }}>
            Track and resolve home issues, assign certified technicians, and log repair expenditures.
          </p>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <Plus size={18} />
          Report New Repair
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
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Records</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px' }}>{repairs.length}</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Repairs</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: '#b45309' }}>
            {pendingRepairsCount}
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--danger)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Urgent Issues</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: 'var(--danger)' }}>
            {urgentRepairsCount}
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overdue Tickets</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: '#ef4444' }}>
            {overdueRepairs.length}
          </div>
        </div>
      </div>

      {/* Overdue Alert Banner if any */}
      {overdueRepairs.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            padding: '12px 18px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '20px'
          }}
        >
          <AlertCircle size={22} color="#dc2626" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.875rem' }}>
              Attention: {overdueRepairs.length} maintenance ticket is overdue!
            </span>
            <div style={{ fontSize: '0.8rem', color: '#b91c1c' }}>
              {overdueRepairs.map((o) => `"${o.problemName}" (Due: ${o.dueDate})`).join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by problem, room, or details..."
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

            {/* Priority Filter */}
            <select
              className="filter-select"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Status Filter */}
            <select
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Sort Filter */}
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest Date</option>
              <option value="priority">Sort: Highest Priority</option>
              <option value="cost">Sort: Estimated Cost</option>
            </select>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <button
                className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setViewMode('table')}
                title="Table View"
                style={{ borderRadius: 0, padding: '6px 10px' }}
              >
                <TableIcon size={16} />
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'cards' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setViewMode('cards')}
                title="Cards View"
                style={{ borderRadius: 0, padding: '6px 10px' }}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Repairs List: Table View */}
      {viewMode === 'table' ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Problem & Description</th>
                <th>Category / Room</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Cost (Est / Act)</th>
                <th>Assigned Provider</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepairs.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Wrench size={24} />
                      </div>
                      <h3>No repair tickets found</h3>
                      <p>Try adjusting your search criteria or report a new problem ticket.</p>
                      <button onClick={handleOpenAddModal} className="btn btn-primary btn-sm">
                        Report Issue
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRepairs.map((repair) => {
                  const isOverdue =
                    repair.dueDate &&
                    repair.dueDate < todayStr &&
                    repair.status !== 'Completed';

                  return (
                    <tr
                      key={repair.id}
                      style={{
                        backgroundColor: isOverdue ? '#fffbfb' : 'inherit'
                      }}
                    >
                      <td style={{ maxWidth: '280px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                          {repair.problemName}
                        </div>
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginTop: '2px'
                          }}
                        >
                          {repair.description}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{repair.category}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {repair.location || 'General Area'}
                        </div>
                      </td>

                      <td>
                        <StatusBadge status={repair.priority} type="priority" />
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.85rem' }}>{repair.dueDate || 'No date'}</span>
                          {isOverdue && (
                            <span
                              style={{
                                fontSize: '0.7rem',
                                color: 'var(--danger)',
                                fontWeight: 700,
                                backgroundColor: '#fee2e2',
                                padding: '2px 5px',
                                borderRadius: '4px'
                              }}
                            >
                              OVERDUE
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                          ${repair.estimatedCost || 0}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {repair.actualCost ? `Act: $${repair.actualCost}` : 'Pending'}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          {repair.serviceProvider || 'Unassigned'}
                        </div>
                      </td>

                      <td>
                        {/* Status workflow selector */}
                        <select
                          className="filter-select"
                          value={repair.status}
                          onChange={(e) => updateRepairStatus(repair.id, e.target.value)}
                          style={{
                            fontSize: '0.78rem',
                            padding: '4px 8px',
                            fontWeight: 600,
                            backgroundColor:
                              repair.status === 'Completed'
                                ? '#dcfce7'
                                : repair.status === 'In Progress'
                                ? '#e0f2fe'
                                : '#fef3c7',
                            color:
                              repair.status === 'Completed'
                                ? '#16a34a'
                                : repair.status === 'In Progress'
                                ? '#0284c7'
                                : '#b45309',
                            border: '1px solid transparent'
                          }}
                        >
                          <option value="Reported">Reported</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '6px' }}
                            title="View Details"
                            onClick={() => setViewingRepair(repair)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '6px' }}
                            title="Edit"
                            onClick={() => handleOpenEditModal(repair)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '6px', color: 'var(--danger)' }}
                            title="Delete"
                            onClick={() => setDeletingRepairId(repair.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Cards View */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px'
          }}
        >
          {filteredRepairs.map((repair) => {
            const isOverdue =
              repair.dueDate &&
              repair.dueDate < todayStr &&
              repair.status !== 'Completed';

            return (
              <div
                key={repair.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: isOverdue
                    ? '4px solid #ef4444'
                    : repair.priority === 'Urgent'
                    ? '4px solid var(--danger)'
                    : '1px solid var(--border-color)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      {repair.category} • {repair.location}
                    </span>
                    <StatusBadge status={repair.priority} type="priority" />
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                    {repair.problemName}
                  </h3>

                  <p style={{ fontSize: '0.825rem', marginBottom: '12px', lineHeight: 1.4 }}>
                    {repair.description}
                  </p>

                  <div
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      fontSize: '0.8rem',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Due Date:</span>
                      <strong style={{ color: isOverdue ? 'var(--danger)' : 'var(--text-main)' }}>
                        {repair.dueDate || 'Not set'} {isOverdue && '(OVERDUE)'}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Estimated Cost:</span>
                      <strong>${repair.estimatedCost || 0}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Technician:</span>
                      <strong>{repair.serviceProvider || 'Unassigned'}</strong>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-color)'
                  }}
                >
                  <select
                    className="filter-select"
                    value={repair.status}
                    onChange={(e) => updateRepairStatus(repair.id, e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                  >
                    <option value="Reported">Reported</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '6px' }}
                      onClick={() => setViewingRepair(repair)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '6px' }}
                      onClick={() => handleOpenEditModal(repair)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '6px', color: 'var(--danger)' }}
                      onClick={() => setDeletingRepairId(repair.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingRepair ? 'Edit Repair Record' : 'Report New Repair'}
        size="lg"
      >
        <form onSubmit={handleSubmitForm}>
          <div className="form-group">
            <label className="form-label">Problem Name *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Master Bedroom Ceiling Leak"
              value={formData.problemName}
              onChange={(e) => setFormData({ ...formData, problemName: e.target.value })}
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
                {categories.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location / Room</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Kitchen, Roof Terrace"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-control"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Reported">Reported</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Reported Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.reportedDate}
                onChange={(e) => setFormData({ ...formData, reportedDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Due Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Estimated Cost ($)</label>
              <input
                type="number"
                className="form-control"
                placeholder="85"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Actual Cost ($) (if resolved)</label>
              <input
                type="number"
                className="form-control"
                placeholder="90"
                value={formData.actualCost}
                onChange={(e) => setFormData({ ...formData, actualCost: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Service Provider</label>
            <select
              className="form-control"
              value={formData.serviceProvider}
              onChange={(e) => setFormData({ ...formData, serviceProvider: e.target.value })}
            >
              <option value="Unassigned">Unassigned</option>
              {serviceProviders.map((p) => (
                <option key={p.id} value={`${p.name} (${p.category})`}>
                  {p.name} — {p.category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Problem Description</label>
            <textarea
              className="form-control"
              placeholder="Describe symptoms, visible water/damage, electrical warning signs..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes & Follow-up History</label>
            <textarea
              className="form-control"
              placeholder="Technician diagnostic comments, parts replaced, receipts..."
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
              {editingRepair ? 'Save Changes' : 'Create Repair Ticket'}
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW DETAILS MODAL */}
      <Modal
        isOpen={!!viewingRepair}
        onClose={() => setViewingRepair(null)}
        title="Repair Record Details"
        size="lg"
      >
        {viewingRepair && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Ticket ID: {viewingRepair.id}
                </span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '2px' }}>
                  {viewingRepair.problemName}
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <StatusBadge status={viewingRepair.priority} type="priority" />
                <StatusBadge status={viewingRepair.status} />
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                padding: '16px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
                fontSize: '0.85rem'
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Category:</span>{' '}
                <strong>{viewingRepair.category}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Location:</span>{' '}
                <strong>{viewingRepair.location || 'Not specified'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Reported Date:</span>{' '}
                <strong>{viewingRepair.reportedDate}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Due Date:</span>{' '}
                <strong>{viewingRepair.dueDate || 'None'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Cost:</span>{' '}
                <strong>${viewingRepair.estimatedCost || 0}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Actual Cost:</span>{' '}
                <strong>{viewingRepair.actualCost ? `$${viewingRepair.actualCost}` : 'Pending calculation'}</strong>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Professional:</span>{' '}
                <strong>{viewingRepair.serviceProvider || 'Unassigned'}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '6px' }}>Description</h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                {viewingRepair.description || 'No detailed description.'}
              </p>
            </div>

            {viewingRepair.notes && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '6px' }}>Resolution Notes & History</h4>
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-color)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem'
                  }}
                >
                  {viewingRepair.notes}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                className="btn btn-outline"
                onClick={() => {
                  const r = viewingRepair;
                  setViewingRepair(null);
                  handleOpenEditModal(r);
                }}
              >
                <Edit2 size={16} /> Edit Ticket
              </button>
              <button className="btn btn-primary" onClick={() => setViewingRepair(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <Modal
        isOpen={!!deletingRepairId}
        onClose={() => setDeletingRepairId(null)}
        title="Confirm Delete"
      >
        <p style={{ marginBottom: '20px' }}>
          Are you sure you want to remove this repair ticket? This record and any history logs will be permanently deleted.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={() => setDeletingRepairId(null)} className="btn btn-outline">
            Cancel
          </button>
          <button onClick={confirmDelete} className="btn btn-danger">
            Delete Repair Ticket
          </button>
        </div>
      </Modal>
    </div>
  );
};
