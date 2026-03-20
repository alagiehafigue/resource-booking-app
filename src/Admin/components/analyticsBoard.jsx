import { useState, useEffect } from "react";
import { apiFetch } from "./adminApi";
import "./analyticsBoard.css";

export default function AnalyticsBoard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch("/bookings", { method: "GET" });
        const list = Array.isArray(data) ? data : data?.bookings || [];

        setStats({
          total: list.length,
          pending: list.filter((b) =>
            ["pending"].includes((b?.status || b?.booking_status || b?.approval_status || "").toLowerCase())
          ).length,
          confirmed: list.filter((b) =>
            ["confirmed", "approved"].includes((b?.status || b?.booking_status || b?.approval_status || "").toLowerCase())
          ).length,
          completed: list.filter((b) =>
            ["completed"].includes((b?.status || b?.booking_status || b?.approval_status || "").toLowerCase())
          ).length,
        });
      } catch (e) {
        setError(e?.message || "Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    { label: "Total Bookings", value: stats.total,     className: "ab-card--blue"   },
    { label: "Pending",        value: stats.pending,   className: "ab-card--yellow" },
    { label: "Confirmed",      value: stats.confirmed, className: "ab-card--green"  },
    { label: "Completed",      value: stats.completed, className: "ab-card--pink"   },
  ];

  if (loading) return <p className="ab-state">Loading analytics…</p>;
  if (error)   return <p className="ab-state ab-state--error">{error}</p>;

  return (
    <div className="ab-root">
      {cards.map((card) => (
        <div key={card.label} className={`ab-card ${card.className}`}>
          <p className="ab-card__label">{card.label}</p>
          <p className="ab-card__value">{card.value}</p>
        </div>
      ))}
    </div>
  );
}