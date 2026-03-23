import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LOGO from "../assets/LOGO.png";
import Footer from "../components/Footer";
import ConfirmDialog from "../components/ConfirmDialog";
import { apiRequest, logoutSession } from "../Auth/authApi";
import { getStoredSession } from "../Auth/session";
import "./userNotifications.css";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UserNotifications() {
  const session = getStoredSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);

  const unreadCount = notifications.filter((item) => !item.read_status).length;

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/notifications");
      const list = Array.isArray(data) ? data : data?.notifications || [];
      setNotifications(list);
    } catch (err) {
      setError(err.message || "Could not load notifications.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      setActingId(notificationId);
      await apiRequest(`/notifications/${notificationId}/read`, {
        method: "PATCH",
      });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.notification_id === notificationId
            ? { ...notification, read_status: true }
            : notification,
        ),
      );
    } catch (err) {
      setError(err.message || "Could not update notification.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className='un-root'>
      <header className='user-header'>
        <Link to='/home'>
          <img src={LOGO} className='user-header__logo' />
        </Link>
        <div className='user-header__right'>
          <Link
            to='/notifications'
            className='user-header__bell user-header__bell--active'
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
            {unreadCount > 0 && (
              <span className='user-header__badge'>{unreadCount}</span>
            )}
          </Link>
          <button
            type='button'
            className='user-header__profile-btn'
            aria-label='Open profile menu'
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
              <circle cx='12' cy='7' r='4' />
            </svg>
          </button>
          {menuOpen && (
            <div className='user-header__menu' role='menu'>
              <Link to='/home' className='user-header__menu-item'>
                <span className='user-header__menu-icon'>
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                  >
                    <path d='M3 11l9-8 9 8' />
                    <path d='M5 10v10h14V10' />
                  </svg>
                </span>
                <span>All Resources</span>
              </Link>
              <Link to='/bookings' className='user-header__menu-item'>
                <span className='user-header__menu-icon'>
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                  >
                    <rect x='3' y='4' width='18' height='18' rx='2' />
                    <line x1='16' y1='2' x2='16' y2='6' />
                    <line x1='8' y1='2' x2='8' y2='6' />
                    <line x1='3' y1='10' x2='21' y2='10' />
                  </svg>
                </span>
                <span>My Bookings</span>
              </Link>
              <Link to='/notifications' className='user-header__menu-item'>
                <span className='user-header__menu-icon'>
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                  >
                    <path d='M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9' />
                    <path d='M13.73 21a2 2 0 0 1-3.46 0' />
                  </svg>
                </span>
                <span>Notifications</span>
              </Link>
              <Link to='/profile' className='user-header__menu-item'>
                <span className='user-header__menu-icon'>
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                  >
                    <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
                    <circle cx='12' cy='7' r='4' />
                  </svg>
                </span>
                <span>View Profile</span>
              </Link>
              <Link to='/settings' className='user-header__menu-item'>
                <span className='user-header__menu-icon'>
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                  >
                    <circle cx='12' cy='12' r='3' />
                    <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.82-.33l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 15 8.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 15z' />
                  </svg>
                </span>
                <span>Settings</span>
              </Link>
              <button
                type='button'
                className='user-header__menu-item user-header__menu-item--logout'
                onClick={() => setConfirmOpen(true)}
              >
                <span className='user-header__menu-icon'>
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                  >
                    <path d='M10 17l5-5-5-5' />
                    <path d='M15 12H3' />
                    <path d='M21 19V5a2 2 0 0 0-2-2h-4' />
                  </svg>
                </span>
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className='un-main'>
        <section className='un-hero'>
          <div>
            <p className='un-eyebrow'>Notification Center</p>
            <h1>User Notifications</h1>
            <p>
              Stay updated on approvals, rejections, cancellations, and every
              booking event created by the backend.
            </p>
          </div>
          <div className='un-hero__actions'>
            <Link to='/bookings' className='un-btn un-btn--ghost'>
              My Bookings
            </Link>
            <button
              type='button'
              className='un-btn un-btn--primary'
              onClick={loadNotifications}
            >
              Refresh
            </button>
          </div>
        </section>

        <section className='un-content'>
          <div className='un-toolbar'>
            <div>
              <h2>
                {session.name
                  ? `${session.name}'s notifications`
                  : "Your notifications"}
              </h2>
              <p>
                {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {error && <div className='un-banner un-banner--error'>{error}</div>}

          {loading ? (
            <div className='un-empty'>Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className='un-empty'>
              <h3>No notifications yet</h3>
              <p>
                When bookings are approved, rejected, or cancelled, your updates
                will appear here.
              </p>
            </div>
          ) : (
            <div className='un-list'>
              {notifications.map((notification) => (
                <article
                  key={notification.notification_id}
                  className={`un-card ${notification.read_status ? "un-card--read" : "un-card--unread"}`}
                >
                  <div className='un-card__status' />
                  <div className='un-card__body'>
                    <div className='un-card__top'>
                      <div>
                        <p className='un-card__label'>
                          {notification.read_status ? "Seen" : "New Update"}
                        </p>
                        <h3>{notification.message}</h3>
                      </div>
                      <span className='un-card__time'>
                        {formatDate(notification.created_at)}
                      </span>
                    </div>
                    {!notification.read_status && (
                      <div className='un-card__actions'>
                        <button
                          type='button'
                          className='un-btn un-btn--ghost'
                          disabled={actingId === notification.notification_id}
                          onClick={() =>
                            markAsRead(notification.notification_id)
                          }
                        >
                          {actingId === notification.notification_id
                            ? "Saving..."
                            : "Mark as read"}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <ConfirmDialog
        open={confirmOpen}
        title='Log out now?'
        message='You will be signed out of this account on the current browser.'
        confirmLabel='Log Out'
        cancelLabel='Stay Here'
        tone='warning'
        onConfirm={() => logoutSession()}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
