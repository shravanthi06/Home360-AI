
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/home-services";

interface HomeService {
  _id: string;
  serviceType: string;
  providerName: string;
  description: string;
  scheduledDate: string;
  amount: number;
  status: string;
  notes: string;
}

function HomeServices() {
  const [services, setServices] = useState<HomeService[]>([]);
  const [serviceType, setServiceType] = useState("Plumbing");
  const [providerName, setProviderName] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const loadServices = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Unable to fetch services");

      const data = await response.json();
      setServices(Array.isArray(data) ? data : data.services || []);
      setError("");
    } catch {
      setError("Could not load services. Check whether the backend is running.");
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const addService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType,
          providerName,
          description,
          scheduledDate,
          amount: Number(amount),
          status: "Requested",
          notes,
        }),
      });

      if (!response.ok) throw new Error("Unable to add service");

      setProviderName("");
      setDescription("");
      setScheduledDate("");
      setAmount("");
      setNotes("");
      setError("");
      await loadServices();
    } catch {
      setError("Could not save service. Please check the backend API.");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Unable to update status");

      await loadServices();
    } catch {
      setError("Could not update service status.");
    }
  };

  const deleteService = async (id: string) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Unable to delete service");

      await loadServices();
    } catch {
      setError("Could not delete service.");
    }
  };

  const totalCost = services.reduce(
    (total, service) => total + Number(service.amount || 0),
    0
  );

  const pendingCount = services.filter(
    (service) =>
      service.status === "Requested" ||
      service.status === "Accepted" ||
      service.status === "In Progress"
  ).length;

  return (
    <div style={{ padding: "20px", color: "#111" }}>
      <h2>Home Services</h2>
      <p>Manage your home repair and maintenance service bookings.</p>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div>
          <h3>Total Bookings</h3>
          <p>{services.length}</p>
        </div>
        <div>
          <h3>Pending Services</h3>
          <p>{pendingCount}</p>
        </div>
        <div>
          <h3>Total Cost</h3>
          <p>₹{totalCost.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <hr />

      <h3>Book a Home Service</h3>

      <form
        onSubmit={addService}
        style={{
          display: "grid",
          gap: "12px",
          maxWidth: "450px",
          marginBottom: "25px",
        }}
      >
        <label>
          Service Type
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            style={{ display: "block", width: "100%", padding: "8px" }}
          >
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>Carpentry</option>
            <option>Painting</option>
            <option>Cleaning</option>
            <option>AC Repair</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Provider Name
          <input
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
            placeholder="Enter provider name"
            required
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the service"
            required
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
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
          Estimated Amount (₹)
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
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

        <button type="submit">Book Service</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Service Bookings</h3>

      <div style={{ overflowX: "auto" }}>
        <table
          border={1}
          cellPadding={10}
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Service</th>
              <th>Provider</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service) => (
              <tr key={service._id}>
                <td>
                  {service.serviceType}
                  <br />
                  {service.description}
                </td>
                <td>{service.providerName}</td>
                <td>
                  {service.scheduledDate
                    ? new Date(service.scheduledDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>₹{Number(service.amount || 0).toLocaleString("en-IN")}</td>
                <td>
                  <select
                    value={service.status}
                    onChange={(e) =>
                      updateStatus(service._id, e.target.value)
                    }
                  >
                    <option>Requested</option>
                    <option>Accepted</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => deleteService(service._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {services.length === 0 && (
              <tr>
                <td colSpan={6}>No home services booked yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomeServices;
