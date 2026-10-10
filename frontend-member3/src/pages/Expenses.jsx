import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  PieChart as PieChartIcon,
  Trash2,
  Edit2,
  CreditCard,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';

export const Expenses = () => {
  const {
    bills,
    expenses,
    addBill,
    updateBill,
    deleteBill,
    markBillAsPaid,
    addExpense,
    deleteExpense,
    pendingBills,
    pendingBillsTotal,
    monthlyExpensesSum,
    monthlySpendingChartData
  } = useApp();

  const [activeTab, setActiveTab] = useState('bills'); // 'bills' | 'expenses'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Paid' | 'Pending'

  // Modals
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [deletingBillId, setDeletingBillId] = useState(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);

  // Bill Form State
  const initialBillForm = {
    title: '',
    category: 'Electricity',
    amount: '',
    billDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    paymentStatus: 'Pending',
    notes: ''
  };
  const [billFormData, setBillFormData] = useState(initialBillForm);

  // Expense Form State
  const initialExpenseForm = {
    title: '',
    category: 'Maintenance',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  };
  const [expenseFormData, setExpenseFormData] = useState(initialExpenseForm);

  const categories = ['All', 'Electricity', 'Water', 'Maintenance', 'Cleaning', 'Appliance Repair', 'Other'];

  const COLORS = ['#16a34a', '#0284c7', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

  // Category breakdown calculation for Pie Chart
  const categoryBreakdownData = useMemo(() => {
    const map = {};
    bills.forEach((b) => {
      const cat = b.category || 'Other';
      map[cat] = (map[cat] || 0) + Number(b.amount || 0);
    });
    return Object.keys(map).map((key) => ({
      name: key,
      value: Math.round(map[key] * 100) / 100
    }));
  }, [bills]);

  // Filtered Bills
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.notes && b.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'All' || b.category === selectedCategory;

      const matchesStatus =
        statusFilter === 'All' || b.paymentStatus === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [bills, searchQuery, selectedCategory, statusFilter]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'All' || e.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [expenses, searchQuery, selectedCategory]);

  // Form Handlers
  const handleOpenAddBill = () => {
    setEditingBill(null);
    setBillFormData(initialBillForm);
    setIsAddBillOpen(true);
  };

  const handleOpenEditBill = (bill) => {
    setEditingBill(bill);
    setBillFormData({
      title: bill.title || '',
      category: bill.category || 'Electricity',
      amount: bill.amount ?? '',
      billDate: bill.billDate || '',
      dueDate: bill.dueDate || '',
      paymentStatus: bill.paymentStatus || 'Pending',
      notes: bill.notes || ''
    });
    setIsAddBillOpen(true);
  };

  const handleSubmitBill = (e) => {
    e.preventDefault();
    if (!billFormData.title.trim() || !billFormData.amount) return;

    if (editingBill) {
      updateBill(editingBill.id, billFormData);
    } else {
      addBill(billFormData);
    }
    setIsAddBillOpen(false);
    setEditingBill(null);
  };

  const handleSubmitExpense = (e) => {
    e.preventDefault();
    if (!expenseFormData.title.trim() || !expenseFormData.amount) return;

    addExpense(expenseFormData);
    setIsAddExpenseOpen(false);
    setExpenseFormData(initialExpenseForm);
  };

  const paidBillsCount = bills.filter((b) => b.paymentStatus === 'Paid').length;

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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Expenses & Bills</h1>
          <p style={{ marginTop: '4px' }}>
            Monitor household utilities, track paid/pending invoices, and review spending breakdowns.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setIsAddExpenseOpen(true)} className="btn btn-outline">
            <DollarSign size={16} />
            Record Expense
          </button>
          <button onClick={handleOpenAddBill} className="btn btn-primary">
            <Plus size={16} />
            Add New Bill
          </button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Monthly Expenses</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2px', color: 'var(--primary)' }}>
            ${monthlyExpensesSum.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Current month settlements
          </div>
        </div>

        <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid var(--danger)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Bills Amount</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2px', color: 'var(--danger)' }}>
            ${pendingBillsTotal.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {pendingBills.length} invoices awaiting payment
          </div>
        </div>

        <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Settled Invoices</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2px', color: '#0284c7' }}>
            {paidBillsCount} Paid
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Out of {bills.length} total bills
          </div>
        </div>
      </div>

      {/* Spending Visualizations Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}
      >
        {/* Monthly Trend Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <TrendingUp size={18} color="var(--primary)" />
                Monthly Spending Trend
              </h3>
              <div className="card-subtitle">Spending comparison across last 6 months</div>
            </div>
          </div>
          <div style={{ width: '100%', height: '240px' }}>
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
                <Bar dataKey="total" name="Total ($)" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <PieChartIcon size={18} color="#0284c7" />
                Category Expense Distribution
              </h3>
              <div className="card-subtitle">Share of utility & service expenses</div>
            </div>
          </div>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {categoryBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `$${val}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Utility Bills vs Direct Expenses */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-subtle)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          <button
            className={`btn btn-sm ${activeTab === 'bills' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('bills')}
          >
            Household Bills ({bills.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'expenses' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('expenses')}
          >
            Logged Expenses ({expenses.length})
          </button>
        </div>

        {activeTab === 'bills' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-sm ${statusFilter === 'All' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setStatusFilter('All')}
            >
              All
            </button>
            <button
              className={`btn btn-sm ${statusFilter === 'Pending' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setStatusFilter('Pending')}
            >
              Pending ({pendingBills.length})
            </button>
            <button
              className={`btn btn-sm ${statusFilter === 'Paid' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setStatusFilter('Paid')}
            >
              Paid ({paidBillsCount})
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '14px', marginBottom: '18px' }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'bills' ? 'bills' : 'expenses'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-actions">
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
          </div>
        </div>
      </div>

      {/* TAB 1: BILLS TABLE */}
      {activeTab === 'bills' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bill Title & Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Payment Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Receipt size={24} />
                      </div>
                      <h3>No bills found</h3>
                      <p>Add a new utility bill to track payment due dates.</p>
                      <button onClick={handleOpenAddBill} className="btn btn-primary btn-sm">
                        Add Bill
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr key={bill.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{bill.title}</div>
                      {bill.notes && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {bill.notes}
                        </div>
                      )}
                    </td>

                    <td>
                      <span style={{ fontWeight: 600 }}>{bill.category}</span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>${Number(bill.amount).toFixed(2)}</span>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{bill.dueDate || 'N/A'}</div>
                      {bill.paidDate && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--primary)' }}>Paid on {bill.paidDate}</div>
                      )}
                    </td>

                    <td>
                      <StatusBadge status={bill.paymentStatus} />
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                        {bill.paymentStatus !== 'Paid' && (
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                            onClick={() => markBillAsPaid(bill.id)}
                          >
                            <CheckCircle2 size={14} /> Pay Now
                          </button>
                        )}
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '6px' }}
                          title="Edit Bill"
                          onClick={() => handleOpenEditBill(bill)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '6px', color: 'var(--danger)' }}
                          title="Delete Bill"
                          onClick={() => setDeletingBillId(bill.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: EXPENSES TABLE */}
      {activeTab === 'expenses' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Expense Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date Paid</th>
                <th>Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <DollarSign size={24} />
                      </div>
                      <h3>No direct expenses recorded</h3>
                      <p>Log one-off household purchases or maintenance settlements.</p>
                      <button onClick={() => setIsAddExpenseOpen(true)} className="btn btn-primary btn-sm">
                        Record Expense
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>
                      <strong style={{ color: 'var(--text-main)' }}>{exp.title}</strong>
                    </td>
                    <td>{exp.category}</td>
                    <td>
                      <span style={{ fontWeight: 800 }}>${Number(exp.amount).toFixed(2)}</span>
                    </td>
                    <td>{exp.date}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{exp.notes || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '6px', color: 'var(--danger)' }}
                        onClick={() => setDeletingExpenseId(exp.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD / EDIT BILL MODAL */}
      <Modal
        isOpen={isAddBillOpen}
        onClose={() => setIsAddBillOpen(false)}
        title={editingBill ? 'Edit Household Bill' : 'Add New Household Bill'}
      >
        <form onSubmit={handleSubmitBill}>
          <div className="form-group">
            <label className="form-label">Bill Title *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. City Water & Sewage Utility"
              value={billFormData.title}
              onChange={(e) => setBillFormData({ ...billFormData, title: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={billFormData.category}
                onChange={(e) => setBillFormData({ ...billFormData, category: e.target.value })}
              >
                {categories.filter((c) => c !== 'All').map((c) => (
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
                placeholder="145.00"
                value={billFormData.amount}
                onChange={(e) => setBillFormData({ ...billFormData, amount: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Bill Issue Date</label>
              <input
                type="date"
                className="form-control"
                value={billFormData.billDate}
                onChange={(e) => setBillFormData({ ...billFormData, billDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Due Date *</label>
              <input
                type="date"
                required
                className="form-control"
                value={billFormData.dueDate}
                onChange={(e) => setBillFormData({ ...billFormData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Status</label>
            <select
              className="form-control"
              value={billFormData.paymentStatus}
              onChange={(e) => setBillFormData({ ...billFormData, paymentStatus: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Reference No.</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Account #4029481, auto-pay enabled"
              value={billFormData.notes}
              onChange={(e) => setBillFormData({ ...billFormData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={() => setIsAddBillOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingBill ? 'Save Changes' : 'Save Bill'}
            </button>
          </div>
        </form>
      </Modal>

      {/* RECORD EXPENSE MODAL */}
      <Modal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        title="Record One-off Expense"
      >
        <form onSubmit={handleSubmitExpense}>
          <div className="form-group">
            <label className="form-label">Expense Title *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Spare Water Filter Cartridges (3-pack)"
              value={expenseFormData.title}
              onChange={(e) => setExpenseFormData({ ...expenseFormData, title: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={expenseFormData.category}
                onChange={(e) => setExpenseFormData({ ...expenseFormData, category: e.target.value })}
              >
                {categories.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Amount Paid ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                className="form-control"
                placeholder="45.00"
                value={expenseFormData.amount}
                onChange={(e) => setExpenseFormData({ ...expenseFormData, amount: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Date Paid</label>
            <input
              type="date"
              className="form-control"
              value={expenseFormData.date}
              onChange={(e) => setExpenseFormData({ ...expenseFormData, date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Merchant</label>
            <input
              type="text"
              className="form-control"
              placeholder="Store name, receipt number..."
              value={expenseFormData.notes}
              onChange={(e) => setExpenseFormData({ ...expenseFormData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={() => setIsAddExpenseOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Record Expense
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE BILL CONFIRMATION */}
      <Modal
        isOpen={!!deletingBillId}
        onClose={() => setDeletingBillId(null)}
        title="Confirm Bill Deletion"
      >
        <p style={{ marginBottom: '20px' }}>
          Are you sure you want to delete this bill record? This will remove it from pending and expense calculations.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={() => setDeletingBillId(null)} className="btn btn-outline">
            Cancel
          </button>
          <button
            onClick={() => {
              deleteBill(deletingBillId);
              setDeletingBillId(null);
            }}
            className="btn btn-danger"
          >
            Delete Bill
          </button>
        </div>
      </Modal>

      {/* DELETE EXPENSE CONFIRMATION */}
      <Modal
        isOpen={!!deletingExpenseId}
        onClose={() => setDeletingExpenseId(null)}
        title="Confirm Expense Deletion"
      >
        <p style={{ marginBottom: '20px' }}>
          Are you sure you want to delete this expense record?
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={() => setDeletingExpenseId(null)} className="btn btn-outline">
            Cancel
          </button>
          <button
            onClick={() => {
              deleteExpense(deletingExpenseId);
              setDeletingExpenseId(null);
            }}
            className="btn btn-danger"
          >
            Delete Expense
          </button>
        </div>
      </Modal>
    </div>
  );
};
