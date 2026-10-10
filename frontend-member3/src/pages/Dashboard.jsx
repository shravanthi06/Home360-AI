import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  AlertTriangle,
  Calendar,
  Cpu,
  UserCheck,
  DollarSign,
  Receipt,
  PlusCircle,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';

export const Dashboard = () => {
  const navigate = useNavigate();
  const {
    repairs,
    assets,
    serviceProviders,
    serviceRequests,
    bills,
    expenses,
    activities,
    pendingRepairsCount,
    urgentRepairsCount,
    overdueRepairs,
    serviceDueAssets,
    expiringWarranties,
    activeRequests,
    pendingBills,
    pendingBillsTotal,
    monthlyExpensesSum,
    healthScore,
    homeConditionLabel,
    homeConditionColor,
    monthlySpendingChartData,
    addRepair,
    addAsset,
    addServiceRequest,
    addBill
  } = useApp();

  // Quick Action Modal States
  const [modalType, setModalType] = useState(null); // 'repair' | 'asset' | 'service' | 'bill' | null

  // Form states for modals
  const [repairForm, setRepairForm] = useState({
    problemName: '',
    category: 'Plumbing',
    description: '',
    location: 'Kitchen',
    priority: 'Medium',
    dueDate: '',
    estimatedCost: '',
    serviceProvider: 'Unassigned',
    notes: ''
  });

  const [assetForm, setAssetForm] = useState({
    name: '',
    category: 'AC',
    brand: '',
    model: '',
    purchaseDate: '',
    purchasePrice: '',
    warrantyDuration: '2 Years',
    warrantyExpiry: '',
    nextServiceDate: '',
    location: 'Living Room',
    condition: 'Good',
    notes: ''
  });

  const [serviceForm, setServiceForm] = useState({
    providerId: '',
    title: '',
    problemDescription: '',
    location: 'Living Room',
    preferredDate: '',
    preferredTime: '10:00 AM',
    estimatedCost: 50
  });

  const [billForm, setBillForm] = useState({
    title: '',
    category: 'Electricity',
    amount: '',
    dueDate: '',
    notes: ''
  });

  // Handlers for quick actions
  const handleCreateRepair = (e) => {
    e.preventDefault();
    if (!repairForm.problemName.trim()) return;
    addRepair({
      ...repairForm,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'Reported'
    });
    setModalType(null);
    setRepairForm({
      problemName: '',
      category: 'Plumbing',
      description: '',
      location: 'Kitchen',
      priority: 'Medium',
      dueDate: '',
      estimatedCost: '',
      serviceProvider: 'Unassigned',
      notes: ''
    });
  };

  const handleCreateAsset = (e) => {
    e.preventDefault();
    if (!assetForm.name.trim()) return;
    addAsset(assetForm);
    setModalType(null);
    setAssetForm({
      name: '',
      category: 'AC',
      brand: '',
      model: '',
      purchaseDate: '',
      purchasePrice: '',
      warrantyDuration: '2 Years',
      warrantyExpiry: '',
      nextServiceDate: '',
      location: 'Living Room',
      condition: 'Good',
      notes: ''
    });
  };

  const handleCreateServiceRequest = (e) => {
    e.preventDefault();
    if (!serviceForm.title.trim()) return;
    const provider = serviceProviders.find((p) => p.id === serviceForm.providerId) || serviceProviders[0];
    addServiceRequest({
      ...serviceForm,
      providerId: provider.id,
      providerName: provider.name,
      category: provider.category
    });
    setModalType(null);
    setServiceForm({
      providerId: '',
      title: '',
      problemDescription: '',
      location: 'Living Room',
      preferredDate: '',
      preferredTime: '10:00 AM',
      estimatedCost: 50
    });
  };

  const handleCreateBill = (e) => {
    e.preventDefault();
    if (!billForm.title.trim() || !billForm.amount) return;
    addBill({
      ...billForm,
      billDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'Pending'
    });
    setModalType(null);
    setBillForm({
      title: '',
      category: 'Electricity',
      amount: '',
      dueDate: '',
      notes: ''
    });
  };

  // Recent maintenance schedule
  const upcomingMaintenanceItems = [
    ...repairs
      .filter((r) => r.status === 'Scheduled' || (r.status !== 'Completed' && r.dueDate))
      .map((r) => ({
        id: r.id,
        title: r.problemName,
        category: r.category,
        date: r.dueDate || r.reportedDate,
        type: 'repair',
        priority: r.priority,
        status: r.status,
        assignee: r.serviceProvider
      })),
    ...serviceDueAssets.map((a) => ({
      id: a.id,
      title: `${a.name} Routine Service`,
      category: a.category,
      date: a.nextServiceDate,
      type: 'asset_service',
      priority: 'Medium',
      status: 'Scheduled',
      assignee: 'Scheduled Check'
    }))
  ].slice(0, 5);

  return (
    <div className="page-container">
      {/* Welcome & Quick Action Header */}
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back!</h1>
          <p style={{ marginTop: '4px' }}>
            Here is a snapshot of your property condition, upcoming schedules, and recent requests.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setModalType('repair')} className="btn btn-primary">
            <Wrench size={16} />
            Add Repair
          </button>
          <button onClick={() => setModalType('asset')} className="btn btn-outline">
            <Cpu size={16} />
            Add Asset
          </button>
          <button onClick={() => setModalType('service')} className="btn btn-outline">
            <UserCheck size={16} />
            Request Service
          </button>
          <button onClick={() => setModalType('bill')} className="btn btn-outline">
            <Receipt size={16} />
            Add Bill
          </button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <StatCard
          title="Home Condition"
          value={homeConditionLabel}
          subtitle={`Health Score: ${healthScore}%`}
          icon={ShieldCheck}
          color={homeConditionColor}
          bgColor="#dcfce7"
          badgeText={urgentRepairsCount > 0 ? `${urgentRepairsCount} urgent issue` : 'All Systems Good'}
          badgeType={urgentRepairsCount > 0 ? 'danger' : 'success'}
        />

        <StatCard
          title="Pending Repairs"
          value={pendingRepairsCount}
          subtitle={`${urgentRepairsCount} urgent, ${overdueRepairs.length} overdue`}
          icon={Wrench}
          color="#f59e0b"
          bgColor="#fef3c7"
          onClick={() => navigate('/maintenance')}
        />

        <StatCard
          title="Upcoming Maintenance"
          value={upcomingMaintenanceItems.length}
          subtitle="Scheduled this month"
          icon={Calendar}
          color="#0284c7"
          bgColor="#e0f2fe"
          onClick={() => navigate('/maintenance')}
        />

        <StatCard
          title="Appliance Service Due"
          value={serviceDueAssets.length}
          subtitle="Within next 14 days"
          icon={Cpu}
          color="#8b5cf6"
          bgColor="#f3e8ff"
          onClick={() => navigate('/assets')}
        />

        <StatCard
          title="Active Service Requests"
          value={activeRequests.length}
          subtitle="Professionals dispatched"
          icon={UserCheck}
          color="#16a34a"
          bgColor="#dcfce7"
          onClick={() => navigate('/services')}
        />

        <StatCard
          title="Monthly Home Expenses"
          value={`$${monthlyExpensesSum.toFixed(2)}`}
          subtitle="Current month tracked"
          icon={DollarSign}
          color="#0f172a"
          bgColor="#f1f5f9"
          onClick={() => navigate('/expenses')}
        />

        <StatCard
          title="Pending Bills"
          value={`$${pendingBillsTotal.toFixed(2)}`}
          subtitle={`${pendingBills.length} unpaid utility bills`}
          icon={Receipt}
          color="#ef4444"
          bgColor="#fee2e2"
          badgeText={pendingBills.length > 0 ? 'Action Needed' : 'Paid Up'}
          badgeType={pendingBills.length > 0 ? 'warning' : 'success'}
          onClick={() => navigate('/expenses')}
        />
      </div>

      {/* Main Grid: Chart & Important Alerts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}
      >
        {/* Monthly Expenses Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <TrendingUp size={20} color="var(--primary)" />
                Monthly Spending & Utilities
              </h3>
              <div className="card-subtitle">Spending trends across utility and maintenance categories</div>
            </div>
            <button onClick={() => navigate('/expenses')} className="btn btn-ghost btn-sm">
              Details <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ width: '100%', height: '280px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpendingChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} stroke="#64748b" fontSize={12} />
                <YAxis tickLine={false} stroke="#64748b" fontSize={12} />
                <Tooltip
                  formatter={(val) => `$${val}`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid #e2e8f0'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="electricity" name="Electricity" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="maintenance" name="Maintenance" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="repairs" name="Repairs" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cleaning" name="Cleaning" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Important Alerts & Warnings */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <AlertTriangle size={20} color="#f59e0b" />
                Important Attention Items
              </h3>
              <div className="card-subtitle">Items that require homeowner review or prompt action</div>
            </div>
            <button onClick={() => navigate('/notifications')} className="btn btn-ghost btn-sm">
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {urgentRepairsCount > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 14px',
                  backgroundColor: '#fee2e2',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '4px solid #ef4444'
                }}
              >
                <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991b1b' }}>
                    {urgentRepairsCount} Urgent Repair Tickets Pending
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#b91c1c', marginTop: '2px' }}>
                    Basement Breaker or AC Coil need prompt attention to prevent property damage.
                  </div>
                </div>
                <button
                  onClick={() => navigate('/maintenance')}
                  className="btn btn-danger btn-sm"
                  style={{ alignSelf: 'center', backgroundColor: '#ffffff' }}
                >
                  Review
                </button>
              </div>
            )}

            {serviceDueAssets.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 14px',
                  backgroundColor: '#fef3c7',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '4px solid #f59e0b'
                }}
              >
                <Cpu size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e' }}>
                    Appliance Routine Service Due
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#b45309', marginTop: '2px' }}>
                    {serviceDueAssets[0]?.name} scheduled service window arrives within 14 days.
                  </div>
                </div>
                <button
                  onClick={() => navigate('/assets')}
                  className="btn btn-outline btn-sm"
                  style={{ alignSelf: 'center' }}
                >
                  Schedule
                </button>
              </div>
            )}

            {expiringWarranties.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 14px',
                  backgroundColor: '#e0f2fe',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '4px solid #0284c7'
                }}
              >
                <ShieldCheck size={20} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#075985' }}>
                    Warranty Expiry Approaching
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#0369a1', marginTop: '2px' }}>
                    {expiringWarranties[0]?.name} warranty expires on {expiringWarranties[0]?.warrantyExpiry}.
                  </div>
                </div>
                <button
                  onClick={() => navigate('/assets')}
                  className="btn btn-outline btn-sm"
                  style={{ alignSelf: 'center' }}
                >
                  Inspect
                </button>
              </div>
            )}

            {pendingBills.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <Receipt size={20} color="var(--text-sub)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {pendingBills.length} Unpaid Utility Bills (${pendingBillsTotal.toFixed(2)})
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Upcoming: {pendingBills[0]?.title} due {pendingBills[0]?.dueDate}.
                  </div>
                </div>
                <button
                  onClick={() => navigate('/expenses')}
                  className="btn btn-primary btn-sm"
                  style={{ alignSelf: 'center' }}
                >
                  Pay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Grid: Recent Requests, Upcoming Maintenance, Activities */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}
      >
        {/* Recent Service Requests */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <UserCheck size={18} color="var(--primary)" />
                Recent Service Requests
              </h3>
              <div className="card-subtitle">Active and dispatched technician jobs</div>
            </div>
            <button onClick={() => navigate('/services')} className="btn btn-ghost btn-sm">
              All <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {serviceRequests.slice(0, 4).map((req) => (
              <div
                key={req.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {req.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {req.providerName} • {req.preferredDate} ({req.preferredTime})
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Maintenance Schedule */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Calendar size={18} color="var(--primary)" />
                Upcoming Maintenance
              </h3>
              <div className="card-subtitle">Scheduled servicing and repairs</div>
            </div>
            <button onClick={() => navigate('/maintenance')} className="btn btn-ghost btn-sm">
              Schedule <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {upcomingMaintenanceItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#ffffff'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Due: <strong style={{ color: 'var(--text-sub)' }}>{item.date}</strong> • {item.assignee}
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities Timeline */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Clock size={18} color="var(--primary)" />
                Recent Activities
              </h3>
              <div className="card-subtitle">Real-time log of events and updates</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  <Sparkles size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {act.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{act.description}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK ACTION MODALS */}
      {/* 1. Add Repair Modal */}
      <Modal
        isOpen={modalType === 'repair'}
        onClose={() => setModalType(null)}
        title="Report New Home Repair"
      >
        <form onSubmit={handleCreateRepair}>
          <div className="form-group">
            <label className="form-label">Problem Name *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Master Bedroom Ceiling Leak"
              value={repairForm.problemName}
              onChange={(e) => setRepairForm({ ...repairForm, problemName: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={repairForm.category}
                onChange={(e) => setRepairForm({ ...repairForm, category: e.target.value })}
              >
                {[
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
                ].map((c) => (
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
                value={repairForm.location}
                onChange={(e) => setRepairForm({ ...repairForm, location: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-control"
                value={repairForm.priority}
                onChange={(e) => setRepairForm({ ...repairForm, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Target Due Date</label>
              <input
                type="date"
                className="form-control"
                value={repairForm.dueDate}
                onChange={(e) => setRepairForm({ ...repairForm, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Estimated Cost ($)</label>
              <input
                type="number"
                className="form-control"
                placeholder="75"
                value={repairForm.estimatedCost}
                onChange={(e) => setRepairForm({ ...repairForm, estimatedCost: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Service Provider</label>
              <select
                className="form-control"
                value={repairForm.serviceProvider}
                onChange={(e) => setRepairForm({ ...repairForm, serviceProvider: e.target.value })}
              >
                <option value="Unassigned">Unassigned</option>
                {serviceProviders.map((p) => (
                  <option key={p.id} value={`${p.name} (${p.category})`}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Detailed description of symptoms, visible damage, or urgency..."
              value={repairForm.description}
              onChange={(e) => setRepairForm({ ...repairForm, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setModalType(null)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Repair Ticket
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Add Asset Modal */}
      <Modal
        isOpen={modalType === 'asset'}
        onClose={() => setModalType(null)}
        title="Register Household Asset / Appliance"
      >
        <form onSubmit={handleCreateAsset}>
          <div className="form-group">
            <label className="form-label">Asset Name *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Bosch Series 6 Front Load Washer"
              value={assetForm.name}
              onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={assetForm.category}
                onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value })}
              >
                <optgroup label="Appliances">
                  {['AC', 'Refrigerator', 'Washing Machine', 'TV', 'Water Purifier', 'Water Heater', 'Inverter', 'Microwave'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="Other Home Assets">
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
                placeholder="e.g. Samsung, LG, Daikin"
                value={assetForm.brand}
                onChange={(e) => setAssetForm({ ...assetForm, brand: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Model Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. FTKM50TV16U"
                value={assetForm.model}
                onChange={(e) => setAssetForm({ ...assetForm, model: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Purchase Price ($)</label>
              <input
                type="number"
                className="form-control"
                placeholder="650"
                value={assetForm.purchasePrice}
                onChange={(e) => setAssetForm({ ...assetForm, purchasePrice: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Warranty Expiry Date</label>
              <input
                type="date"
                className="form-control"
                value={assetForm.warrantyExpiry}
                onChange={(e) => setAssetForm({ ...assetForm, warrantyExpiry: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Next Service Date</label>
              <input
                type="date"
                className="form-control"
                value={assetForm.nextServiceDate}
                onChange={(e) => setAssetForm({ ...assetForm, nextServiceDate: e.target.value })}
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
                value={assetForm.location}
                onChange={(e) => setAssetForm({ ...assetForm, location: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Condition</label>
              <select
                className="form-control"
                value={assetForm.condition}
                onChange={(e) => setAssetForm({ ...assetForm, condition: e.target.value })}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Needs Attention">Needs Attention</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setModalType(null)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register Asset
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. Request Service Modal */}
      <Modal
        isOpen={modalType === 'service'}
        onClose={() => setModalType(null)}
        title="Book Professional Home Service"
      >
        <form onSubmit={handleCreateServiceRequest}>
          <div className="form-group">
            <label className="form-label">Choose Service Professional</label>
            <select
              className="form-control"
              value={serviceForm.providerId}
              onChange={(e) => setServiceForm({ ...serviceForm, providerId: e.target.value })}
            >
              <option value="">-- Select Professional --</option>
              {serviceProviders.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} • {p.category} (${p.approxPrice}{p.priceUnit})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Service Title *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Deep HVAC Coil Flush & Gas Refill"
              value={serviceForm.title}
              onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Preferred Date</label>
              <input
                type="date"
                required
                className="form-control"
                value={serviceForm.preferredDate}
                onChange={(e) => setServiceForm({ ...serviceForm, preferredDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time Window</label>
              <select
                className="form-control"
                value={serviceForm.preferredTime}
                onChange={(e) => setServiceForm({ ...serviceForm, preferredTime: e.target.value })}
              >
                <option value="09:00 AM">Morning (09:00 AM - 12:00 PM)</option>
                <option value="01:00 PM">Afternoon (01:00 PM - 04:00 PM)</option>
                <option value="05:00 PM">Evening (05:00 PM - 08:00 PM)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Problem & Requirements</label>
            <textarea
              className="form-control"
              placeholder="Describe what needs to be checked, repaired, or installed..."
              value={serviceForm.problemDescription}
              onChange={(e) => setServiceForm({ ...serviceForm, problemDescription: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setModalType(null)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit Request
            </button>
          </div>
        </form>
      </Modal>

      {/* 4. Add Bill Modal */}
      <Modal
        isOpen={modalType === 'bill'}
        onClose={() => setModalType(null)}
        title="Record Utility Bill"
      >
        <form onSubmit={handleCreateBill}>
          <div className="form-group">
            <label className="form-label">Bill Title *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. October Municipal Water Bill"
              value={billForm.title}
              onChange={(e) => setBillForm({ ...billForm, title: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={billForm.category}
                onChange={(e) => setBillForm({ ...billForm, category: e.target.value })}
              >
                {['Electricity', 'Water', 'Maintenance', 'Cleaning', 'Appliance Repair', 'Other'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                className="form-control"
                placeholder="120.50"
                value={billForm.amount}
                onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date *</label>
            <input
              type="date"
              required
              className="form-control"
              value={billForm.dueDate}
              onChange={(e) => setBillForm({ ...billForm, dueDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <input
              type="text"
              className="form-control"
              placeholder="Invoice reference or payment account..."
              value={billForm.notes}
              onChange={(e) => setBillForm({ ...billForm, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setModalType(null)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Bill
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
