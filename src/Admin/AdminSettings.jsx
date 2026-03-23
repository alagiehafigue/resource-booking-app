import { useMemo, useState } from "react";
import Footer from "../componemts/footer";
import ConfirmDialog from "../componemts/ConfirmDialog";
import AdminTopbar from "./components/AdminTopbar";
import { logoutSession } from "../Auth/authApi";
import "./adminHomepage.css";

export default function AdminSettings() {
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
            <h1>Admin Settings</h1>
            <p>Navigation-focused settings page for the admin area.</p>
          </div>

          <section className="ah-profile-grid">
            <article className="ah-info-card">
              <h2>Navigation</h2>
              <div className="ah-shortcuts">
                <button type="button" className="ah-shortcut" onClick={() => window.location.assign("/admin")}>
                  Open dashboard
                </button>
                <button type="button" className="ah-shortcut" onClick={() => window.location.assign("/admin/resources")}>
                  Open resource page
                </button>
                <button type="button" className="ah-shortcut" onClick={() => window.location.assign("/admin/profile")}>
                  Open profile page
                </button>
              </div>
            </article>

            <article className="ah-info-card">
              <h2>Session</h2>
              <p className="ah-info-copy">
                This page is ready for future admin preferences. For now, it gives quick access to the main admin pages and session controls.
              </p>
              <button type="button" className="ah-shortcut ah-shortcut--danger" onClick={() => setConfirmOpen(true)}>
                Log out
              </button>
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
