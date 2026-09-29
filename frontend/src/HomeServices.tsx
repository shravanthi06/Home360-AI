import { useState } from "react";

type Status =
  | "Not Requested"
  | "Requested"
  | "Accepted"
  | "In Progress"
  | "Completed";

type Provider = {
  id: number;
  name: string;
  service: string;
  rating: number;
  experience: number;
  price: number;
  availability: string;
  status: Status;
};

function HomeServices() {
  const [providers, setProviders] = useState<Provider[]>([
    {
      id: 1,
      name: "Arun Kumar",
      service: "Plumber",
      rating: 4.8,
      experience: 7,
      price: 500,
      availability: "Available",
      status: "Not Requested",
    },
    {
      id: 2,
      name: "Suresh Electric Works",
      service: "Electrician",
      rating: 4.7,
      experience: 5,
      price: 400,
      availability: "Available",
      status: "Not Requested",
    },
    {
      id: 3,
      name: "Ravi Carpenter",
      service: "Carpenter",
      rating: 4.6,
      experience: 8,
      price: 600,
      availability: "Busy",
      status: "Not Requested",
    },
    {
      id: 4,
      name: "Cool Care Services",
      service: "AC Technician",
      rating: 4.9,
      experience: 6,
      price: 700,
      availability: "Available",
      status: "Not Requested",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const handleRequest = (id: number) => {
    setProviders(
      providers.map((provider) =>
        provider.id === id
          ? { ...provider, status: "Requested" }
          : provider
      )
    );
  };

  const changeStatus = (id: number) => {
    const statusOrder: Status[] = [
      "Not Requested",
      "Requested",
      "Accepted",
      "In Progress",
      "Completed",
    ];

    setProviders(
      providers.map((provider) => {
        if (provider.id !== id) {
          return provider;
        }

        const currentIndex = statusOrder.indexOf(provider.status);

        if (currentIndex < statusOrder.length - 1) {
          return {
            ...provider,
            status: statusOrder[currentIndex + 1],
          };
        }

        return provider;
      })
    );
  };

  const viewProfile = (provider: Provider) => {
    alert(
      `${provider.name}\n\nService: ${provider.service}\nRating: ${provider.rating}\nExperience: ${provider.experience} years\nPrice: ₹${provider.price} / visit\nAvailability: ${provider.availability}`
    );
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(search.toLowerCase()) ||
      provider.service.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || provider.service === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="services-page">
      <div className="services-header">
        <div>
          <p className="section-label">HOME MANAGEMENT</p>
          <h1>Home Services</h1>
          <p>
            Find trusted professionals for your home maintenance needs.
          </p>
        </div>
      </div>

      <div className="services-tools">
        <input
          type="text"
          placeholder="Search provider or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Services</option>
          <option value="Plumber">Plumber</option>
          <option value="Electrician">Electrician</option>
          <option value="Carpenter">Carpenter</option>
          <option value="AC Technician">AC Technician</option>
        </select>
      </div>

      <div className="provider-grid">
        {filteredProviders.map((provider) => (
          <div className="provider-card" key={provider.id}>
            <div className="provider-top">
              <div className="provider-icon">
                {provider.service === "Plumber"
                  ? "🔧"
                  : provider.service === "Electrician"
                  ? "⚡"
                  : provider.service === "Carpenter"
                  ? "🪚"
                  : "❄️"}
              </div>

              <span
                className={
                  provider.availability === "Available"
                    ? "available"
                    : "busy"
                }
              >
                {provider.availability}
              </span>
            </div>

            <h2>{provider.name}</h2>

            <p className="service-name">
              {provider.service}
            </p>

            <div className="provider-details">
              <span>⭐ {provider.rating}</span>
              <span>🧑‍🔧 {provider.experience} years</span>
              <span>₹{provider.price}/visit</span>
            </div>

            <div className="status-box">
              <strong>Status:</strong> {provider.status}
            </div>

            <div className="provider-buttons">
              <button
                className="profile-button"
                onClick={() => viewProfile(provider)}
              >
                View Profile
              </button>

              {provider.status === "Not Requested" && (
                <button
                  className="request-button"
                  onClick={() => handleRequest(provider.id)}
                  disabled={provider.availability === "Busy"}
                >
                  Request Service
                </button>
              )}

              {provider.status !== "Not Requested" &&
                provider.status !== "Completed" && (
                  <button
                    className="next-button"
                    onClick={() => changeStatus(provider.id)}
                  >
                    Move to Next Status
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeServices;