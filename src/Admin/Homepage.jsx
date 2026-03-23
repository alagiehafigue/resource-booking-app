import { useMemo, useState } from "react";
import BookingApprovals from "./components/BookingApprovals";
import CreateResource from "./components/CreateResource";
import "./adminHomepage.css";
import AnalyticsBoard from "./components/analyticsBoard";
import Footer from "../components/Footer";
import ConfirmDialog from "../components/ConfirmDialog";
import AdminTopbar from "./components/AdminTopbar";
import { logoutSession } from "../Auth/authApi";

const TABS = [
  { id: "approvals", label: "Booking Approvals" },
  { id: "create", label: "Create Resource" },
];

const Homepage = () => {
  const [activeTab, setActiveTab] = useState("approvals");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const adminName = useMemo(() => {
    const fromStorage =
      localStorage.getItem("admin_name") ||
      localStorage.getItem("adminName") ||
      "";
    return (fromStorage || "Admin").trim();
  }, []);

  return (
    <div className='ah-root'>
      <AdminTopbar
        adminName={adminName}
        onLogout={() => setConfirmOpen(true)}
      />
      <AnalyticsBoard />

      <main className='ah-main'>
        <div className='ah-page'>
          <div className='ah-title'>
            <h1>Admin Panel</h1>
            <p>Manage resources and approve bookings</p>
          </div>

          <nav className='ah-tabs' aria-label='Admin tabs'>
            {TABS.map((t) => (
              <button
                key={t.id}
                type='button'
                className={`ah-tab ${activeTab === t.id ? "ah-tab--active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <section className='ah-content'>
            {activeTab === "approvals" && <BookingApprovals />}
            {activeTab === "create" && <CreateResource />}
          </section>
        </div>
      </main>

      <Footer />
      <ConfirmDialog
        open={confirmOpen}
        title='Log out from admin?'
        message='You will leave the admin dashboard and need to sign in again to continue managing resources.'
        confirmLabel='Log Out'
        cancelLabel='Stay Here'
        tone='warning'
        onConfirm={() => logoutSession()}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default Homepage;
