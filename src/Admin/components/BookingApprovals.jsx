import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "./adminApi";
import "./adminTabs.css";

function formatWhen(isoLike) {
  if (!isoLike) return "";
  const d = new Date(isoLike);
  if (Number.isNaN(d.getTime())) return String(isoLike);
  return d.toLocaleString();
}

function inferStatus(b) {
  return (
    b?.status ||
    b?.booking_status ||
    b?.approval_status ||
    (b?.approved === true ? "approved" : b?.approved === false ? "rejected" : "pending")
  );
}

export default function BookingApprovals({ onNotify }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);

  const pending = useMemo(() => {
    return (bookings || []).filter((b) => String(inferStatus(b)).toLowerCase() === "pending");
  }, [bookings]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/bookings", { method: "GET" });
      const list = Array.isArray(data) ? data : data?.bookings || [];
      setBookings(list);
    } catch (e) {
      setError(e?.message || "Failed to load bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (bookingId, action) => {
    if (!bookingId) return;
    setActingId(bookingId);
    setError("");
    try {
      await apiFetch(`/bookings/${bookingId}/${action}`, { method: "PUT" });
      onNotify?.({
        title: action === "approve" ? "Booking Approved" : "Booking Rejected",
        message: `Booking #${bookingId} has been ${action === "approve" ? "approved" : "rejected"}.`,
        tone: action === "approve" ? "success" : "warning",
      });
      await load();
    } catch (e) {
      setError(e?.message || "Action failed.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="at-root">
      <div className="at-card">
        <div className="at-card__head">
          <h2>Booking Approvals</h2>
          <div className="at-card__actions">
            <button type="button" className="at-btn at-btn--ghost" onClick={load} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>

        {error && <div className="at-banner at-banner--error">{error}</div>}

        {loading ? (
          <div className="at-empty">
            <div className="at-skeleton" />
            <div className="at-skeleton at-skeleton--sm" />
          </div>
        ) : pending.length === 0 ? (
          <div className="at-empty">
            <div className="at-empty__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l2.5 2.5L16 9" />
              </svg>
            </div>
            <p className="at-empty__text">No pending booking request</p>
          </div>
        ) : (
          <div className="at-list">
            {pending.map((b) => {
              const id = b?.id ?? b?.booking_id ?? b?._id;
              const resource = b?.resource_name || b?.resource?.resource_name || b?.resource?.name || b?.resource || "";
              const user = b?.user_name || b?.user?.name || b?.requested_by || b?.user || "";
              const start = b?.start_time || b?.start || b?.date_time || b?.date || "";
              const end = b?.end_time || b?.end || "";
              return (
                <div key={String(id)} className="at-item">
                  <div className="at-item__meta">
                    <div className="at-item__title">
                      <span className="at-dot at-dot--pending" aria-hidden="true" />
                      <strong>New booking request</strong>
                      <span className="at-item__time">{formatWhen(b?.created_at || b?.createdAt)}</span>
                    </div>
                    <div className="at-item__desc">
                      <span>
                        {user ? <strong>{user}</strong> : "A user"} requested to book{" "}
                        {resource ? <strong>{resource}</strong> : "a resource"}
                      </span>
                      {start && (
                        <span className="at-item__when">
                          {" "}
                          • {formatWhen(start)}
                          {end ? ` → ${formatWhen(end)}` : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="at-item__buttons">
                    <button
                      type="button"
                      className="at-btn at-btn--primary"
                      disabled={actingId === id}
                      onClick={() => act(id, "approve")}
                    >
                      {actingId === id ? "Working…" : "Approve"}
                    </button>
                    <button
                      type="button"
                      className="at-btn at-btn--danger"
                      disabled={actingId === id}
                      onClick={() => act(id, "reject")}
                    >
                      {actingId === id ? "Working…" : "Cancel"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

