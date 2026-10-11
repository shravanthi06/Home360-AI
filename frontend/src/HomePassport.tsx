
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/home-passport";

interface HomePassportRecord {
  _id: string;
  homeName: string;
  address: string;
  propertyType: string;
  yearBuilt?: number;
  area?: number;
  notes?: string;
}

function HomePassport() {
  const [records, setRecords] = useState<HomePassportRecord[]>([]);
  const [homeName, setHomeName] = useState("");
  const [address, setAddress] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [yearBuilt, setYearBuilt] = useState("");
  const [area, setArea] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const loadRecords = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error();

      const data = await response.json();
      setRecords(Array.isArray(data) ? data : data.records || []);
      setError("");
    } catch {
      setError("Unable to load records. Check your backend.");
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const addRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeName,
          address,
          propertyType,
          yearBuilt: yearBuilt ? Number(yearBuilt) : undefined,
          area: area ? Number(area) : undefined,
          notes,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to save property");
      }

      setHomeName("");
      setAddress("");
      setPropertyType("Apartment");
      setYearBuilt("");
      setArea("");
      setNotes("");
      setError("");

      await loadRecords();
    } catch (err) {
      setError(
        err instanceof Error
          ? `Unable to save property: ${err.message}`
          : "Unable to save property."
      );
    }
  };

  const deleteRecord = async (id: string) => {
    if (!window.confirm("Delete this property?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(await response.text());

      await loadRecords();
    } catch {
      setError("Unable to delete property.");
    }
  };

  return (
    <div style={{ padding: "20px", color: "#111" }}>
      <h2>Digital Home Passport</h2>
      <p>Store your property's important details in one place.</p>

      <h3>Registered Properties: {records.length}</h3>

      <hr />

      <h3>Register Your Home</h3>

      <form
        onSubmit={addRecord}
        style={{
          display: "grid",
          gap: "12px",
          maxWidth: "450px",
          marginBottom: "25px",
        }}
      >
        <label>
          Home Name
          <input
            value={homeName}
            onChange={(e) => setHomeName(e.target.value)}
            placeholder="e.g. My Home"
            required
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Address
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            required
            rows={3}
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Property Type
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            style={{ display: "block", width: "100%", padding: "8px" }}
          >
            <option>Apartment</option>
            <option>Independent House</option>
            <option>Villa</option>
            <option>Duplex</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Year Built
          <input
            type="number"
            min="1800"
            max={new Date().getFullYear() + 1}
            value={yearBuilt}
            onChange={(e) => setYearBuilt(e.target.value)}
            placeholder="e.g. 2020"
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Area (sq. ft.)
          <input
            type="number"
            min="0"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g. 1200"
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional details"
            rows={2}
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <button type="submit">Save Home Passport</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Property Records</h3>

      <div style={{ overflowX: "auto" }}>
        <table
          border={1}
          cellPadding={10}
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Home Name</th>
              <th>Address</th>
              <th>Type</th>
              <th>Year Built</th>
              <th>Area</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td>{record.homeName}</td>
                <td>{record.address}</td>
                <td>{record.propertyType}</td>
                <td>{record.yearBuilt ?? "-"}</td>
                <td>{record.area ?? "-"}</td>
                <td>{record.notes || "-"}</td>
                <td>
                  <button onClick={() => deleteRecord(record._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td colSpan={7}>No properties registered yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomePassport;
