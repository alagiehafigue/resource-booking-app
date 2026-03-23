import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LOGO from '../assets/LOGO.png';
import Footer from '../componemts/footer';
import ConfirmDialog from '../componemts/ConfirmDialog';
import { apiRequest, logoutSession } from '../Auth/authApi';
import { getStoredSession } from '../Auth/session';
import './myBookings.css';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusTone(status) {
  switch (String(status).toLowerCase()) {
    case 'confirmed':
      return 'confirmed';
    case 'pending':
      return 'pending';
    case 'rejected':
      return 'rejected';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'default';
  }
}

function isUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim());
}

function formatLocation(location) {
  if (!location) {
    return { label: 'Not provided', href: '' };
  }

  if (isUrl(location)) {
    return { label: 'Open map location', href: location };
  }

  return { label: location, href: '' };
}

export default function MyBookings() {
  const session = getStoredSession();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState(location.state?.successMessage || '');
  const [actingId, setActingId] = useState(null);
  const [confirmState, setConfirmState] = useState(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('/bookings/my-bookings');
      const list = Array.isArray(data) ? data : data?.bookings || [];
      setBookings(list);
    } catch (err) {
      setError(err.message || 'Could not load your bookings.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    try {
      setActingId(bookingId);
      await apiRequest(`/bookings/${bookingId}`, { method: 'DELETE' });
      setBanner('Booking cancelled successfully.');
      await loadBookings();
    } catch (err) {
      setError(err.message || 'Could not cancel booking.');
    } finally {
      setActingId(null);
    }
  };

  const askForLogout = () => {
    setConfirmState({
      title: 'Log out now?',
      message: 'You will be signed out of the resource booking app on this browser.',
      confirmLabel: 'Log Out',
      cancelLabel: 'Stay Here',
      tone: 'warning',
      onConfirm: () => logoutSession(),
    });
  };

  const askToCancelBooking = (bookingId) => {
    setConfirmState({
      title: 'Cancel this booking?',
      message: 'This booking will be cancelled immediately. You can create a new booking again later if needed.',
      confirmLabel: 'Cancel Booking',
      cancelLabel: 'Keep Booking',
      tone: 'danger',
      onConfirm: async () => {
        await cancelBooking(bookingId);
        setConfirmState(null);
      },
    });
  };

  return (
    <div className="mb-root">
      <header className="user-header">
        <Link to="/home">
          <img src={LOGO} className="user-header__logo" />
        </Link>
        <div className="user-header__right">
          <button
            type="button"
            className="user-header__profile-btn"
            aria-label="Open profile menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          {menuOpen && (
            <div className="user-header__menu" role="menu">
              <Link to="/home" className="user-header__menu-item">
                <span className="user-header__menu-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 11l9-8 9 8" />
                    <path d="M5 10v10h14V10" />
                  </svg>
                </span>
                <span>All Resources</span>
              </Link>
              <Link to="/bookings" className="user-header__menu-item">
                <span className="user-header__menu-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
                <span>My Bookings</span>
              </Link>
              <button
                type="button"
                className="user-header__menu-item user-header__menu-item--logout"
                onClick={askForLogout}
              >
                <span className="user-header__menu-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                    <path d="M21 19V5a2 2 0 0 0-2-2h-4" />
                  </svg>
                </span>
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mb-main">
        <section className="mb-hero">
          <div className="mb-hero__copy">
            <p className="mb-eyebrow">Booking Dashboard</p>
            <h1>My Bookings</h1>
            <p>Track every request, check approval status, and manage your reservations in one place.</p>
          </div>
          <div className="mb-hero__actions">
            <Link to="/home" className="mb-btn mb-btn--ghost">Browse Resources</Link>
            <button type="button" className="mb-btn mb-btn--primary" onClick={loadBookings}>Refresh</button>
          </div>
        </section>

        <section className="mb-content">
          <div className="mb-toolbar">
            <div>
              <h2>{session.name ? `${session.name}'s bookings` : 'Your bookings'}</h2>
              <p>{bookings.length} booking{bookings.length === 1 ? '' : 's'} from the backend</p>
            </div>
          </div>

          {banner && <div className="mb-banner mb-banner--success">{banner}</div>}
          {error && <div className="mb-banner mb-banner--error">{error}</div>}

          {loading ? (
            <div className="mb-empty">Loading your bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="mb-empty">
              <h3>No bookings yet</h3>
              <p>Start from the resources page and your reservations will appear here.</p>
              <Link to="/home" className="mb-btn mb-btn--primary">Go to Resources</Link>
            </div>
          ) : (
            <div className="mb-grid">
              {bookings.map((booking) => {
                const tone = statusTone(booking.status);
                const canCancel = ['pending', 'confirmed'].includes(String(booking.status).toLowerCase());

                return (
                  <article key={booking.booking_id} className="mb-card">
                    <div className="mb-card__top">
                      <div>
                        <p className="mb-card__label">Resource</p>
                        <h3>{booking.resource_name}</h3>
                      </div>
                      <span className={`mb-status mb-status--${tone}`}>{booking.status}</span>
                    </div>

                    <div className="mb-card__meta">
                      <div>
                        <span>Start</span>
                        <strong>{formatDate(booking.start_time)}</strong>
                      </div>
                      <div>
                        <span>End</span>
                        <strong>{formatDate(booking.end_time)}</strong>
                      </div>
                      <div>
                        <span>Location</span>
                        {(() => {
                          const locationInfo = formatLocation(booking.location);
                          return locationInfo.href ? (
                            <a
                              href={locationInfo.href}
                              target="_blank"
                              rel="noreferrer"
                              className="mb-location-link"
                            >
                              {locationInfo.label}
                            </a>
                          ) : (
                            <strong>{locationInfo.label}</strong>
                          );
                        })()}
                      </div>
                      <div>
                        <span>Capacity</span>
                        <strong>{booking.capacity || 'N/A'}</strong>
                      </div>
                    </div>

                    <div className="mb-card__actions">
                      <Link to="/home" className="mb-btn mb-btn--ghost">View Resources</Link>
                      {canCancel && (
                        <button
                          type="button"
                          className="mb-btn mb-btn--danger"
                          disabled={actingId === booking.booking_id}
                          onClick={() => askToCancelBooking(booking.booking_id)}
                        >
                          {actingId === booking.booking_id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <ConfirmDialog
        open={Boolean(confirmState)}
        title={confirmState?.title}
        message={confirmState?.message}
        confirmLabel={confirmState?.confirmLabel}
        cancelLabel={confirmState?.cancelLabel}
        tone={confirmState?.tone}
        onConfirm={confirmState?.onConfirm}
        onCancel={() => setConfirmState(null)}
        busy={Boolean(actingId)}
      />
    </div>
  );
}
