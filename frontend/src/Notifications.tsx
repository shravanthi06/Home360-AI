
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/notifications";

type NotificationType =
  | "Bill"
  | "Maintenance"
  | "Service"
  | "Schedule"
  | "General";

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  dueDate?: string;
}

function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("General");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load notifications");
      }

      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the backend"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function addNotification(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const notificationData = {
        title: title.trim(),
        message: message.trim(),
        type,
        isRead: false,
        ...(dueDate ? { dueDate } : {}),
      };

      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add notification");
      }

      setTitle("");
      setMessage("");
      setType("General");
      setDueDate("");
      setSuccess("Notification added successfully!");

      await loadNotifications();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to add notification"
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleRead(item: NotificationItem) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API}/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !item.isRead }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update notification");
      }

      setSuccess("Notification status updated!");
      await loadNotifications();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update notification"
      );
    }
  }

  async function deleteNotification(id: string) {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete notification");
      }

      setSuccess("Notification deleted successfully!");
      await loadNotifications();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete notification"
      );
    }
  }

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
    color: "#222",
    background: "#fff",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "9px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "8px",
    marginTop: "8px",
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <h1>Notifications</h1>
      <p>Manage your HOME360 AI alerts and reminders.</p>

      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          margin: "20px 0",
        }}
      >
        <div style={{ border: "1px solid #ddd", padding: "18px", borderRadius: "8px", flex: "1", minWidth: "150px" }}>
          <h3>Total Notifications</h3>
          <h2>{notifications.length}</h2>
        </div>

        <div style={{ border: "1px solid #ddd", padding: "18px", borderRadius: "8px", flex: "1", minWidth: "150px" }}>
          <h3>Unread Notifications</h3>
          <h2>{unreadCount}</h2>
        </div>

        <div style={{ border: "1px solid #ddd", padding: "18px", borderRadius: "8px", flex: "1", minWidth: "150px" }}>
          <h3>Read Notifications</h3>
          <h2>{notifications.length - unreadCount}</h2>
        </div>
      </div>

      <form
        onSubmit={addNotification}
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <h2>Add Notification</h2>

        <label>
          Title
          <input
            style={inputStyle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
            required
          />
        </label>

        <label style={{ display: "block", marginTop: "14px" }}>
          Message
          <textarea
            style={inputStyle}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter notification message"
            rows={3}
            required
          />
        </label>

        <label style={{ display: "block", marginTop: "14px" }}>
          Category
          <select
            style={inputStyle}
            value={type}
            onChange={(e) => setType(e.target.value as NotificationType)}
          >
            <option value="Bill">Bill</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Service">Service</option>
            <option value="Schedule">Schedule</option>
            <option value="General">General</option>
          </select>
        </label>

        <label style={{ display: "block", marginTop: "14px" }}>
          Due Date (optional)
          <input
            style={inputStyle}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          style={{
            ...buttonStyle,
            background: "#2563eb",
            color: "#fff",
            marginTop: "18px",
          }}
        >
          {saving ? "Saving..." : "Add Notification"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", whiteSpace: "pre-wrap" }}>{error}</p>
      )}

      {success && <p style={{ color: "green" }}>{success}</p>}

      <h2>All Notifications</h2>

      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications yet. Add your first notification above.</p>
      ) : (
        <div style={{ display: "grid", gap: "14px" }}>
          {notifications.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid #ddd",
                borderLeft: item.isRead
                  ? "5px solid #9ca3af"
                  : "5px solid #2563eb",
                borderRadius: "8px",
                padding: "16px",
                background: item.isRead ? "#f9fafb" : "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <h3 style={{ margin: "0 0 8px" }}>{item.title}</h3>
                <span>{item.isRead ? "Read" : "Unread"}</span>
              </div>

              <p>{item.message}</p>

              <p>
                <strong>Category:</strong> {item.type}
              </p>

              {item.dueDate && (
                <p>
                  <strong>Due Date:</strong>{" "}
                  {new Date(item.dueDate).toLocaleDateString()}
                </p>
              )}

              <button
                type="button"
                onClick={() => toggleRead(item)}
                style={{
                  ...buttonStyle,
                  background: "#e5e7eb",
                  color: "#111827",
                }}
              >
                Mark as {item.isRead ? "Unread" : "Read"}
              </button>

              <button
                type="button"
                onClick={() => deleteNotification(item._id)}
                style={{
                  ...buttonStyle,
                  background: "#dc2626",
                  color: "#fff",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
