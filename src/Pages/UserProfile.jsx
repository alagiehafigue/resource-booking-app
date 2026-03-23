import { Link } from "react-router-dom";
import LOGO from "../assets/LOGO.png";
import Footer from "../components/Footer";
import { getStoredSession } from "../Auth/session";
import "./userSettings.css";

export default function UserProfile() {
  const session = getStoredSession();

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
          <Link to='/settings' className='us-navlink'>
            Settings
          </Link>
        </div>
      </header>

      <main className='us-main'>
        <section className='us-panel'>
          <p className='us-eyebrow'>Profile</p>
          <h1>My Profile</h1>
          <p className='us-copy'>
            Basic account details currently stored in your session.
          </p>

          <div className='us-grid'>
            <div className='us-card'>
              <span>Name</span>
              <strong>{session.name || "User"}</strong>
            </div>
            <div className='us-card'>
              <span>Role</span>
              <strong>{session.role || "student"}</strong>
            </div>
            <div className='us-card'>
              <span>User ID</span>
              <strong>{session.userId || "Unavailable"}</strong>
            </div>
            <div className='us-card'>
              <span>Navigation</span>
              <strong>Bookings, resources, notifications</strong>
            </div>
          </div>

          <div className='us-actions'>
            <Link to='/home' className='us-btn us-btn--ghost'>
              Back to Resources
            </Link>
            <Link to='/settings' className='us-btn us-btn--primary'>
              Open Settings
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
