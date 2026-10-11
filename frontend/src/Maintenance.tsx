
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/maintenance";

interface MaintenanceItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  scheduledDate: string;
  estimatedCost: number;
  status: string;
}

function Maintenance() {
  const [items, setItems] = useState<MaintenanceItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Plumbing");
  const [scheduledDate, setScheduledDate] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [error, setError] = useState("");

  const loadItems = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error();

      const data = await response.json();
      setItems(Array.isArray(data) ? data : data.maintenance || []);
      setError("");
    } catch {
      setError("Unable to load maintenance records. Check the backend.");
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
          category,
          scheduledDate,
          estimatedCost: Number(estimatedCost),
          status: "Pending",
        }),
      });

      if (!response.ok) throw new Error();

      setTitle("");
      setDescription("");
      setScheduledDate("");
      setEstimatedCost("");
      setError("");
      await loadItems();
    } catch {
      setError("Unable to save maintenance record.");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error();
      await loadItems();
    } catch {
      setError("Unable to update maintenance status.");
    }
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm("Delete this maintenance record?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();
      await loadItems();
    } catch {
      setError("Unable to delete maintenance record.");
    }
  };

  const totalCost = items.reduce(
    (total, item) => total + Number(item.estimatedCost || 0),
    0
  );

  const pendingCount = items.filter(
    (item) => item.status === "Pending"
  ).length;

  return (
    <div style={{ padding: "20px", color: "#111" }}>
      <h2>Home Maintenance</h2>
      <p>Plan and track your home maintenance tasks.</p>

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
          <h3>Estimated Cost</h3>
          <p>₹{totalCost.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <hr />

      <h3>Add Maintenance Task</h3>

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
            placeholder="e.g. Repair bathroom tap"
            required
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task details"
            required
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
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>Cleaning</option>
            <option>Painting</option>
            <option>Roofing</option>
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
          Estimated Cost (₹)
          <input
            type="number"
            min="0"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="Enter estimated cost"
            required
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <button type="submit">Add Maintenance Task</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Maintenance Records</h3>

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
              <th>Estimated Cost</th>
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
                  {item.description}
                </td>
                <td>{item.category}</td>
                <td>
                  {item.scheduledDate
                    ? new Date(item.scheduledDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  ₹{Number(item.estimatedCost || 0).toLocaleString("en-IN")}
                </td>
                <td>
                  <select
                    value={item.status}
                    onChange={(e) =>
                      updateStatus(item._id, e.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
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
                <td colSpan={6}>No maintenance tasks added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Maintenance;
