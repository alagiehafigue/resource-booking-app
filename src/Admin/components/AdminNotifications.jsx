import "./adminTabs.css";

function timeAgo(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const ms = Date.now() - d.getTime();
  if (Number.isNaN(ms)) return "";
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function AdminNotifications({ notifications, onClear }) {
  const list = Array.isArray(notifications) ? notifications : [];

  return (
    <div className="at-root">
      <div className="at-card">
        <div className="at-card__head">
          <h2>Admin Notification</h2>
          <div className="at-card__actions">
            <button
              type="button"
              className="at-btn at-btn--ghost"
              onClick={onClear}
              disabled={list.length === 0}
            >
              Clear
            </button>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="at-empty">
            <div className="at-empty__icon at-empty__icon--muted">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <p className="at-empty__text">No notifications yet</p>
          </div>
        ) : (
          <div className="at-notify">
            {list.map((n) => (
              <div key={n.id} className="at-note">
                <span
                  className={`at-dot ${
                    n.tone === "success"
                      ? "at-dot--ok"
                      : n.tone === "warning"
                        ? "at-dot--warn"
                        : "at-dot--info"
                  }`}
                  aria-hidden="true"
                />
                <div className="at-note__body">
                  <div className="at-note__top">
                    <strong>{n.title}</strong>
                    <span className="at-note__time">{timeAgo(n.createdAt)}</span>
                  </div>
                  <div className="at-note__msg">{n.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

