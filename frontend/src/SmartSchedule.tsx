
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/smart-schedule";

interface ScheduleItem {
  _id: string;
  title: string;
  description?: string;
  scheduledDate: string;
  category: string;
  priority?: "Low" | "Medium" | "High";
  status: "Pending" | "Completed";
  reminderEnabled?: boolean;
}

function SmartSchedule() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [category, setCategory] = useState("Maintenance");
  const [priority, setPriority] = useState("Medium");
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [error, setError] = useState("");

  const loadItems = async () => {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setItems(Array.isArray(data) ? data : data.schedules || []);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? `Unable to load schedule: ${err.message}`
          : "Unable to load schedule. Check the backend."
      );
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const addItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          scheduledDate,
          category,
          priority,
          reminderEnabled,
          status: "Pending",
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Server returned ${response.status}`);
      }

      setTitle("");
      setDescription("");
      setScheduledDate("");
      setCategory("Maintenance");
      setPriority("Medium");
      setReminderEnabled(true);
      setError("");

      await loadItems();
    } catch (err) {
      setError(
        err instanceof Error
          ? `Unable to save schedule: ${err.message}`
          : "Unable to save schedule."
      );
    }
  };

  const updateStatus = async (
    id: string,
    status: "Pending" | "Completed"
  ) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Server returned ${response.status}`);
      }

      await loadItems();
    } catch (err) {
      setError(
        err instanceof Error
          ? `Unable to update status: ${err.message}`
          : "Unable to update schedule status."
      );
    }
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm("Delete this schedule item?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Server returned ${response.status}`);
      }

      await loadItems();
    } catch (err) {
      setError(
        err instanceof Error
          ? `Unable to delete schedule: ${err.message}`
          : "Unable to delete schedule item."
      );
    }
  };

  const pendingCount = items.filter(
    (item) => item.status === "Pending"
  ).length;

  const completedCount = items.filter(
    (item) => item.status === "Completed"
  ).length;

  return (
    <div style={{ padding: "20px", color: "#111" }}>
      <h2>Smart Home Schedule</h2>
      <p>Organize upcoming home tasks and important activities.</p>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        <div>
          <h3>Total Tasks</h3>
          <p>{items.length}</p>
        </div>

        <div>
          <h3>Pending Tasks</h3>
          <p>{pendingCount}</p>
        </div>

        <div>
          <h3>Completed Tasks</h3>
          <p>{completedCount}</p>
        </div>
      </div>

      <hr />

      <h3>Add Schedule Item</h3>

      <form
        onSubmit={addItem}
        style={{
          display: "grid",
          gap: "12px",
          maxWidth: "450px",
          marginBottom: "25px",
        }}
      >
        <label>
          Task Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Clean air conditioner"
            required
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task details"
            rows={2}
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ display: "block", width: "100%", padding: "8px" }}
          >
            <option>Maintenance</option>
            <option>Bills</option>
            <option>Cleaning</option>
            <option>Appliances</option>
            <option>Home Services</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Scheduled Date
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Priority
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ display: "block", width: "100%", padding: "8px" }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            checked={reminderEnabled}
            onChange={(e) => setReminderEnabled(e.target.checked)}
          />{" "}
          Enable reminder
        </label>

        <button type="submit">Add to Schedule</button>
      </form>

      {error && (
        <p style={{ color: "red", whiteSpace: "pre-wrap" }}>{error}</p>
      )}

      <h3>Scheduled Tasks</h3>

      <div style={{ overflowX: "auto" }}>
        <table
          border={1}
          cellPadding={10}
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Task</th>
              <th>Category</th>
              <th>Date</th>
              <th>Priority</th>
              <th>Reminder</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>
                  <strong>{item.title}</strong>
                  <br />
                  {item.description || "-"}
                </td>

                <td>{item.category}</td>

                <td>
                  {item.scheduledDate
                    ? new Date(item.scheduledDate).toLocaleDateString()
                    : "-"}
                </td>

                <td>{item.priority || "Medium"}</td>

                <td>{item.reminderEnabled ? "Enabled" : "Disabled"}</td>

                <td>
                  <select
                    value={item.status}
                    onChange={(e) =>
                      updateStatus(
                        item._id,
                        e.target.value as "Pending" | "Completed"
                      )
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>

                <td>
                  <button onClick={() => deleteItem(item._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={7}>No scheduled tasks yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SmartSchedule;
