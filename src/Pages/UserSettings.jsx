import { useState } from "react";
import { Link } from "react-router-dom";
import LOGO from "../assets/LOGO.png";
import Footer from "../components/Footer";
import ConfirmDialog from "../components/ConfirmDialog";
import { deleteAccountSession, logoutSession } from "../Auth/authApi";
import "./userSettings.css";

export default function UserSettings() {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setBusy(true);
      await deleteAccountSession();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className='us-root'>
      <header className='user-header'>
        <Link to='/home'>
          <img src={LOGO} className='user-header__logo' />
        </Link>
        <div className='user-header__right'>
          <Link
            to='/notifications'
            className='user-header__bell'
            aria-label='Open notifications'
          >
            <svg
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9' />
              <path d='M13.73 21a2 2 0 0 1-3.46 0' />
            </svg>
          </Link>
          <Link to='/profile' className='us-navlink'>
            Profile
          </Link>
        </div>
      </header>

      <main className='us-main'>
        <section className='us-panel'>
          <p className='us-eyebrow'>Settings</p>
          <h1>Account Settings</h1>
          <p className='us-copy'>
            Manage your account actions and access to the booking platform.
          </p>

          <div className='us-section'>
            <h2>Quick Actions</h2>
            <div className='us-actions'>
              <Link to='/home' className='us-btn us-btn--ghost'>
                Back to Resources
              </Link>
              <button
                type='button'
                className='us-btn us-btn--primary'
                onClick={() => setLogoutOpen(true)}
              >
                Log Out
              </button>
            </div>
          </div>

          <div className='us-section us-section--danger'>
            <div>
              <p className='us-danger-label'>Danger Zone</p>
              <h2>Delete Account</h2>
              <p className='us-copy'>
                This will permanently remove your user account access and sign
                you out immediately.
              </p>
            </div>
            <button
              type='button'
              className='us-btn us-btn--danger'
              onClick={() => setDeleteOpen(true)}
            >
              Delete My Account
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <ConfirmDialog
        open={logoutOpen}
        title='Log out now?'
        message='You will be signed out of this account on the current browser.'
        confirmLabel='Log Out'
        cancelLabel='Stay Here'
        tone='warning'
        onConfirm={() => logoutSession()}
        onCancel={() => setLogoutOpen(false)}
      />
      <ConfirmDialog
        open={deleteOpen}
        title='Delete your account?'
        message='This action is permanent. Your account will be deleted and you will be signed out immediately.'
        confirmLabel='Delete Account'
        cancelLabel='Keep Account'
        tone='danger'
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteOpen(false)}
        busy={busy}
      />
    </div>
  );
}
