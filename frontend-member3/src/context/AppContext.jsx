import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialRepairs,
  initialAssets,
  initialServiceProviders,
  initialServiceRequests,
  initialBills,
  initialExpenses,
  initialNotifications,
  initialActivities,
  initialSettings,
  monthlySpendingChartData
} from '../data/sampleData';

const AppContext = createContext();

const STORAGE_KEYS = {
  REPAIRS: 'homecare_repairs_v1',
  ASSETS: 'homecare_assets_v1',
  PROVIDERS: 'homecare_providers_v1',
  REQUESTS: 'homecare_requests_v1',
  BILLS: 'homecare_bills_v1',
  EXPENSES: 'homecare_expenses_v1',
  NOTIFICATIONS: 'homecare_notifications_v1',
  ACTIVITIES: 'homecare_activities_v1',
  SETTINGS: 'homecare_settings_v1',
};

const loadStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(`Error loading ${key} from localStorage`, e);
  }
  return fallback;
};

export const AppProvider = ({ children }) => {
  const [repairs, setRepairs] = useState(() => loadStorage(STORAGE_KEYS.REPAIRS, initialRepairs));
  const [assets, setAssets] = useState(() => loadStorage(STORAGE_KEYS.ASSETS, initialAssets));
  const [serviceProviders, setServiceProviders] = useState(() => loadStorage(STORAGE_KEYS.PROVIDERS, initialServiceProviders));
  const [serviceRequests, setServiceRequests] = useState(() => loadStorage(STORAGE_KEYS.REQUESTS, initialServiceRequests));
  const [bills, setBills] = useState(() => loadStorage(STORAGE_KEYS.BILLS, initialBills));
  const [expenses, setExpenses] = useState(() => loadStorage(STORAGE_KEYS.EXPENSES, initialExpenses));
  const [notifications, setNotifications] = useState(() => loadStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications));
  const [activities, setActivities] = useState(() => loadStorage(STORAGE_KEYS.ACTIVITIES, initialActivities));
  const [settings, setSettings] = useState(() => loadStorage(STORAGE_KEYS.SETTINGS, initialSettings));
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Save to localStorage when states change
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.REPAIRS, JSON.stringify(repairs)); }, [repairs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets)); }, [assets]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(serviceProviders)); }, [serviceProviders]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(serviceRequests)); }, [serviceRequests]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills)); }, [bills]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities)); }, [activities]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); }, [settings]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Activity logger
  const logActivity = (title, description, type = 'system') => {
    const newActivity = {
      id: `act-${Date.now()}`,
      title,
      description,
      time: 'Just now',
      type
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 19)]);
  };

  // --- REPAIR ACTIONS ---
  const addRepair = (repairData) => {
    const newRepair = {
      ...repairData,
      id: `rep-${Date.now()}`,
      reportedDate: repairData.reportedDate || new Date().toISOString().split('T')[0],
      status: repairData.status || 'Reported',
      actualCost: repairData.actualCost ? Number(repairData.actualCost) : null,
      estimatedCost: Number(repairData.estimatedCost) || 0,
    };
    setRepairs((prev) => [newRepair, ...prev]);
    logActivity('New repair reported', `${newRepair.problemName} (${newRepair.category})`, 'repair');
    showToast('Repair ticket created successfully');
    return newRepair;
  };

  const updateRepair = (id, updatedFields) => {
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, ...updatedFields };
          if (updatedFields.status === 'Completed' && !updated.completionDate) {
            updated.completionDate = new Date().toISOString().split('T')[0];
          }
          return updated;
        }
        return r;
      })
    );
    showToast('Repair updated successfully');
  };

  const deleteRepair = (id) => {
    const repairToDelete = repairs.find((r) => r.id === id);
    setRepairs((prev) => prev.filter((r) => r.id !== id));
    logActivity('Repair deleted', repairToDelete ? repairToDelete.problemName : id, 'repair');
    showToast('Repair removed', 'info');
  };

  const updateRepairStatus = (id, newStatus) => {
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const completionDate = newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : r.completionDate;
          return { ...r, status: newStatus, completionDate };
        }
        return r;
      })
    );
    logActivity('Repair status updated', `Status changed to ${newStatus}`, 'repair');
    showToast(`Status updated to ${newStatus}`);
  };

  // --- ASSET ACTIONS ---
  const addAsset = (assetData) => {
    const newAsset = {
      ...assetData,
      id: `ast-${Date.now()}`,
      purchasePrice: Number(assetData.purchasePrice) || 0,
      serviceHistory: assetData.serviceHistory || []
    };
    setAssets((prev) => [newAsset, ...prev]);
    logActivity('New asset registered', `${newAsset.name} (${newAsset.category})`, 'asset');
    showToast('Asset added to inventory');
    return newAsset;
  };

  const updateAsset = (id, updatedFields) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a))
    );
    showToast('Asset details updated');
  };

  const deleteAsset = (id) => {
    const assetToDelete = assets.find((a) => a.id === id);
    setAssets((prev) => prev.filter((a) => a.id !== id));
    logActivity('Asset removed', assetToDelete ? assetToDelete.name : id, 'asset');
    showToast('Asset removed', 'info');
  };

  const addAssetServiceHistory = (assetId, serviceRecord) => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === assetId) {
          const updatedHistory = [serviceRecord, ...(a.serviceHistory || [])];
          return {
            ...a,
            lastServiceDate: serviceRecord.date,
            serviceHistory: updatedHistory
          };
        }
        return a;
      })
    );
    logActivity('Asset serviced', `Service logged for ${serviceRecord.serviceType || 'maintenance'}`, 'asset');
    showToast('Service record saved');
  };

  // --- SERVICE REQUEST ACTIONS ---
  const addServiceRequest = (requestData) => {
    const newRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      status: 'Requested',
      createdAt: new Date().toISOString().split('T')[0],
      estimatedCost: Number(requestData.estimatedCost) || 50
    };
    setServiceRequests((prev) => [newRequest, ...prev]);
    logActivity('Service requested', `${newRequest.title} with ${newRequest.providerName}`, 'service');
    showToast('Service request submitted successfully');
    return newRequest;
  };

  const updateServiceRequestStatus = (id, newStatus) => {
    setServiceRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    logActivity('Service request update', `Request status marked as ${newStatus}`, 'service');
    showToast(`Request marked as ${newStatus}`);
  };

  // --- BILLS & EXPENSES ACTIONS ---
  const addBill = (billData) => {
    const newBill = {
      ...billData,
      id: `bil-${Date.now()}`,
      amount: Number(billData.amount) || 0,
      paymentStatus: billData.paymentStatus || 'Pending',
      billDate: billData.billDate || new Date().toISOString().split('T')[0]
    };
    setBills((prev) => [newBill, ...prev]);
    logActivity('New bill added', `${newBill.title} - $${newBill.amount}`, 'bill');
    showToast('Bill created');
    return newBill;
  };

  const updateBill = (id, updatedFields) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    );
    showToast('Bill updated');
  };

  const deleteBill = (id) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
    showToast('Bill deleted', 'info');
  };

  const markBillAsPaid = (id) => {
    const bill = bills.find((b) => b.id === id);
    if (!bill) return;

    const today = new Date().toISOString().split('T')[0];
    setBills((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, paymentStatus: 'Paid', paidDate: today } : b
      )
    );

    // Also automatically log to Expenses
    const newExpense = {
      id: `exp-${Date.now()}`,
      title: bill.title,
      category: bill.category,
      amount: bill.amount,
      date: today,
      notes: `Settled bill: ${bill.notes || 'Utility payment'}`
    };
    setExpenses((prev) => [newExpense, ...prev]);

    logActivity('Bill marked as paid', `${bill.title} ($${bill.amount})`, 'bill');
    showToast(`Marked ${bill.title} as paid`);
  };

  const addExpense = (expenseData) => {
    const newExpense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      amount: Number(expenseData.amount) || 0,
      date: expenseData.date || new Date().toISOString().split('T')[0]
    };
    setExpenses((prev) => [newExpense, ...prev]);
    logActivity('New expense recorded', `${newExpense.title} ($${newExpense.amount})`, 'bill');
    showToast('Expense recorded');
    return newExpense;
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('Expense removed', 'info');
  };

  // --- NOTIFICATION ACTIONS ---
  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // --- SETTINGS ACTIONS ---
  const updateSettings = (updated) => {
    setSettings(updated);
    showToast('Settings saved successfully');
  };

  // --- RESET DEMO DATA ---
  const resetToSampleData = () => {
    setRepairs(initialRepairs);
    setAssets(initialAssets);
    setServiceProviders(initialServiceProviders);
    setServiceRequests(initialServiceRequests);
    setBills(initialBills);
    setExpenses(initialExpenses);
    setNotifications(initialNotifications);
    setActivities(initialActivities);
    setSettings(initialSettings);
    showToast('Demo data restored to initial state', 'info');
  };

  // --- DYNAMIC CALCULATIONS ---
  const todayStr = new Date().toISOString().split('T')[0];
  const today = new Date();

  // Repairs stats
  const totalRepairsCount = repairs.length;
  const pendingRepairsCount = repairs.filter((r) => r.status !== 'Completed').length;
  const urgentRepairsCount = repairs.filter(
    (r) => (r.priority === 'Urgent' || r.priority === 'High') && r.status !== 'Completed'
  ).length;
  const overdueRepairs = repairs.filter(
    (r) => r.dueDate && r.dueDate < todayStr && r.status !== 'Completed'
  );

  // Asset stats (Service due within 14 days or overdue)
  const serviceDueAssets = assets.filter((a) => {
    if (!a.nextServiceDate) return false;
    const diffDays = Math.ceil((new Date(a.nextServiceDate) - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 14;
  });

  // Expiring warranties (within 45 days)
  const expiringWarranties = assets.filter((a) => {
    if (!a.warrantyExpiry) return false;
    const diffDays = Math.ceil((new Date(a.warrantyExpiry) - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 45;
  });

  // Expired warranties
  const expiredWarranties = assets.filter((a) => {
    if (!a.warrantyExpiry) return false;
    return a.warrantyExpiry < todayStr;
  });

  // Active service requests
  const activeRequests = serviceRequests.filter(
    (r) => r.status !== 'Completed' && r.status !== 'Cancelled'
  );

  // Pending bills
  const pendingBills = bills.filter((b) => b.paymentStatus === 'Pending' || b.paymentStatus === 'Overdue');
  const pendingBillsTotal = pendingBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);

  // Current month expenses sum
  const currentMonth = new Date().toISOString().slice(0, 7); // e.g. "2026-10"
  const monthlyExpensesSum = expenses
    .filter((e) => e.date && e.date.startsWith(currentMonth))
    .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

  // Home Condition calculation
  // Base 100, minus 8 per urgent repair, minus 4 per pending repair, minus 5 per overdue bill, minus 3 per service due
  const deductions =
    urgentRepairsCount * 8 +
    (pendingRepairsCount - urgentRepairsCount) * 3 +
    overdueRepairs.length * 5 +
    serviceDueAssets.length * 3;
  const healthScore = Math.max(40, Math.min(100, 100 - deductions));

  let homeConditionLabel = 'Good';
  let homeConditionColor = '#16a34a'; // green
  if (healthScore >= 85) {
    homeConditionLabel = 'Excellent';
    homeConditionColor = '#16a34a';
  } else if (healthScore >= 70) {
    homeConditionLabel = 'Good';
    homeConditionColor = '#22c55e';
  } else if (healthScore >= 55) {
    homeConditionLabel = 'Fair';
    homeConditionColor = '#eab308';
  } else {
    homeConditionLabel = 'Needs Attention';
    homeConditionColor = '#ef4444';
  }

  // Unread notifications count
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        // Data
        repairs,
        assets,
        serviceProviders,
        serviceRequests,
        bills,
        expenses,
        notifications,
        activities,
        settings,
        monthlySpendingChartData,
        toasts,
        
        // Dynamic calculations
        totalRepairsCount,
        pendingRepairsCount,
        urgentRepairsCount,
        overdueRepairs,
        serviceDueAssets,
        expiringWarranties,
        expiredWarranties,
        activeRequests,
        pendingBills,
        pendingBillsTotal,
        monthlyExpensesSum,
        healthScore,
        homeConditionLabel,
        homeConditionColor,
        unreadNotificationsCount,

        // Actions
        addRepair,
        updateRepair,
        deleteRepair,
        updateRepairStatus,

        addAsset,
        updateAsset,
        deleteAsset,
        addAssetServiceHistory,

        addServiceRequest,
        updateServiceRequestStatus,

        addBill,
        updateBill,
        deleteBill,
        markBillAsPaid,

        addExpense,
        deleteExpense,

        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,

        updateSettings,
        resetToSampleData,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
