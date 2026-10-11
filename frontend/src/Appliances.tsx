
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/appliances";

interface Appliance {
  _id: string;
  name: string;
  brand: string;
  category: string;
  purchaseDate: string;
  warrantyExpiry: string;
  maintenanceDate: string;
  status: string;
  notes: string;
}

function Appliances() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Refrigerator");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyExpiry, setWarrantyExpiry] = useState("");
  const [maintenanceDate, setMaintenanceDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const loadAppliances = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error();

      const data = await response.json();
      setAppliances(Array.isArray(data) ? data : data.appliances || []);
      setError("");
    } catch {
      setError("Unable to load appliances. Check whether the backend is running.");
    }
  };

  useEffect(() => {
    loadAppliances();
  }, []);

  const addAppliance = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          brand,
          category,
          purchaseDate,
          warrantyExpiry,
          maintenanceDate,
          status: "Active",
          notes,
        }),
      });

      if (!response.ok) throw new Error();

      setName("");
      setBrand("");
      setPurchaseDate("");
      setWarrantyExpiry("");
      setMaintenanceDate("");
      setNotes("");
      setError("");
      await loadAppliances();
    } catch {
      setError("Unable to save appliance. Check your backend model and routes.");
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
      await loadAppliances();
    } catch {
      setError("Unable to update appliance status.");
    }
  };

  const deleteAppliance = async (id: string) => {
    if (!window.confirm("Delete this appliance?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();
      await loadAppliances();
    } catch {
      setError("Unable to delete appliance.");
    }
  };

  return (
    <div style={{ padding: "20px", color: "#111" }}>
      <h2>Home Appliances</h2>
      <p>Track your appliances, warranty dates, and maintenance schedules.</p>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        <div>
          <h3>Total Appliances</h3>
          <p>{appliances.length}</p>
        </div>
        <div>
          <h3>Active Appliances</h3>
          <p>{appliances.filter((a) => a.status === "Active").length}</p>
        </div>
        <div>
          <h3>Warranty Expired</h3>
          <p>
            {appliances.filter(
              (a) => a.warrantyExpiry && new Date(a.warrantyExpiry) < new Date()
            ).length}
          </p>
        </div>
      </div>

      <hr />

      <h3>Add Appliance</h3>

      <form
        onSubmit={addAppliance}
        style={{
          display: "grid",
          gap: "12px",
          maxWidth: "450px",
          marginBottom: "25px",
        }}
      >
        <label>
          Appliance Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Samsung Refrigerator"
            required
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Brand
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Enter brand"
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
            <option>Refrigerator</option>
            <option>Washing Machine</option>
            <option>Air Conditioner</option>
            <option>Television</option>
            <option>Water Heater</option>
            <option>Microwave</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Purchase Date
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Warranty Expiry
          <input
            type="date"
            value={warrantyExpiry}
            onChange={(e) => setWarrantyExpiry(e.target.value)}
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Next Maintenance Date
          <input
            type="date"
            value={maintenanceDate}
            onChange={(e) => setMaintenanceDate(e.target.value)}
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Notes
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes"
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <button type="submit">Add Appliance</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Appliance Records</h3>

      <div style={{ overflowX: "auto" }}>
        <table
          border={1}
          cellPadding={10}
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Warranty Expiry</th>
              <th>Next Maintenance</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {appliances.map((appliance) => (
              <tr key={appliance._id}>
                <td>{appliance.name}</td>
                <td>{appliance.brand}</td>
                <td>{appliance.category}</td>
                <td>
                  {appliance.warrantyExpiry
                    ? new Date(appliance.warrantyExpiry).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  {appliance.maintenanceDate
                    ? new Date(appliance.maintenanceDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <select
                    value={appliance.status}
                    onChange={(e) =>
                      updateStatus(appliance._id, e.target.value)
                    }
                  >
                    <option>Active</option>
                    <option>Under Repair</option>
                    <option>Inactive</option>
                    <option>Disposed</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => deleteAppliance(appliance._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {appliances.length === 0 && (
              <tr>
                <td colSpan={7}>No appliances added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Appliances;
