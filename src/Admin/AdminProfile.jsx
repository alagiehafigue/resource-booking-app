import { useMemo, useState } from "react";
import Footer from "../componemts/footer";
import ConfirmDialog from "../componemts/ConfirmDialog";
import AdminTopbar from "./components/AdminTopbar";
import { logoutSession } from "../Auth/authApi";
import "./adminHomepage.css";

export default function AdminProfile() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const adminName = useMemo(() => {
    return (
      localStorage.getItem("admin_name") ||
      localStorage.getItem("user_name") ||
      "Admin"
    ).trim();
  }, []);

  return (
    <div className="ah-root">
      <AdminTopbar adminName={adminName} onLogout={() => setConfirmOpen(true)} />

      <main className="ah-main">
        <div className="ah-page">
          <div className="ah-title">
            <h1>Admin Profile</h1>
            <p>Your admin information and quick access links.</p>
          </div>

          <section className="ah-profile-grid">
            <article className="ah-info-card">
              <h2>Profile Summary</h2>
              <div className="ah-info-row">
                <span>Name</span>
                <strong>{adminName}</strong>
              </div>
              <div className="ah-info-row">
                <span>Role</span>
                <strong>Administrator</strong>
              </div>
              <div className="ah-info-row">
                <span>Access</span>
                <strong>Bookings, resources, and approvals</strong>
              </div>
            </article>

            <article className="ah-info-card">
              <h2>Quick Actions</h2>
              <div className="ah-shortcuts">
                <button type="button" className="ah-shortcut" onClick={() => window.location.assign("/admin")}>
                  Go to dashboard
                </button>
                <button type="button" className="ah-shortcut" onClick={() => window.location.assign("/admin/resources")}>
                  Manage resources
                </button>
                <button type="button" className="ah-shortcut ah-shortcut--danger" onClick={() => setConfirmOpen(true)}>
                  Log out
                </button>
              </div>
            </article>
          </section>
        </div>
      </main>

      <Footer />
      <ConfirmDialog
        open={confirmOpen}
        title="Log out from admin?"
        message="You will leave the admin dashboard and need to sign in again to continue managing resources."
        confirmLabel="Log Out"
        cancelLabel="Stay Here"
        tone="warning"
        onConfirm={() => logoutSession()}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
