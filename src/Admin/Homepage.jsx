import { useMemo, useState } from "react";
import BookingApprovals from "./components/BookingApprovals";
import CreateResource from "./components/CreateResource";
import AdminNotifications from "./components/AdminNotifications";
import "./adminHomepage.css";
import AnalyticsBoard from "./components/analyticsBoard";
import { useNavigate, Link } from 'react-router-dom';
import Footer from "../componemts/footer";

const TABS = [
  { id: "approvals", label: "Booking Approvals" },
  { id: "create", label: "Create Resource" },
  { id: "notifications", label: "Admin Notification" },
];



const Homepage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("approvals");
  const [notifications, setNotifications] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const adminName = useMemo(() => {
    const fromStorage =
      localStorage.getItem("admin_name") ||
      localStorage.getItem("adminName") ||
      "";
    return (fromStorage || "Admin Akwasi").trim();
  }, []);

  const pushNotification = (n) => {
    setNotifications((prev) => [
      {
        id: crypto?.randomUUID?.() || String(Date.now()),
        title: n?.title || "Update",
        message: n?.message || "",
        tone: n?.tone || "info",
        createdAt: n?.createdAt || new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  return (
    <div className="ah-root">
      {/* Top bar */}
      <header className="ah-topbar">
        <div className="ah-topbar__left">Resource management</div>
        <div className="ah-topbar__right">

          <span 
  className="ah-chip" 
  onClick={() => navigate('/Admin/resources')}
  style={{ cursor: 'pointer' }}
>
  Resource available
</span>
   <div className="ah-admin-wrap">
  <button
    type="button"
    className="ah-admin"
    onClick={() => setMenuOpen((open) => !open)}
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
    {adminName}
  </button>

  {menuOpen && (
    <div className="ah-admin-menu" role="menu">
      <button type="button" className="ah-admin-menu__item">
        <span className="ah-admin-menu__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <span>View Profile</span>
      </button>

      <button type="button" className="ah-admin-menu__item">
        <span className="ah-admin-menu__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82l-.06.06a2 2 0 1 1-2.83-2.83l.06.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.82-.33l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 15 8.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 15z" />
          </svg>
        </span>
        <span>Settings</span>
      </button>

      <Link 
        to="/login" 
        className="ah-admin-menu__item ah-admin-menu__item--logout"
        onClick={() => {
          localStorage.clear(); // ← clears all saved data on logout
          setMenuOpen(false);
        }}
      >
        <span className="ah-admin-menu__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M21 19V5a2 2 0 0 0-2-2h-4" />
          </svg>
        </span>
        <span>Log Out</span>
      </Link>
    </div>
  )}
</div> 

          
</div>
</header>
<AnalyticsBoard />


      {/* Page */}
      <main className="ah-main">
        <div className="ah-page">
          <div className="ah-title">
            <h1>Admin Panel</h1>
            <p>Manage resources and approve bookings</p>
          </div>

          {/* Tabs */}
          <nav className="ah-tabs" aria-label="Admin tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`ah-tab ${activeTab === t.id ? "ah-tab--active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <section className="ah-content">
            {activeTab === "approvals" && (
              <BookingApprovals onNotify={pushNotification} />
            )}
            {activeTab === "create" && (
              <CreateResource onNotify={pushNotification} />
            )}
            {activeTab === "notifications" && (
              <AdminNotifications
                notifications={notifications}
                onClear={() => setNotifications([])}
              />
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Homepage;