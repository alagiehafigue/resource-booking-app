import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import './booking.css';
import { apiRequest } from '../Auth/authApi';
import { getStoredSession } from '../Auth/session';

const DURATION_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 4, 6, 8];

const TIME_SLOTS = Array.from({ length: 32 }, (_, i) => {
  const totalMin = i * 30;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const label = `${h % 12 === 0 ? 12 : h % 12}:${m === 0 ? '00' : '30'} ${h < 12 ? 'AM' : 'PM'}`;
  const value = `${String(h).padStart(2, '0')}:${m === 0 ? '00' : '30'}`;
  return { label, value };
});

function formatDatetimeLocal(dateStr, timeStr) {
  return `${dateStr}T${timeStr}:00`;
}

function addHours(dateStr, timeStr, hours) {
  const dt = new Date(`${dateStr}T${timeStr}:00`);
  dt.setMinutes(dt.getMinutes() + hours * 60);
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = dt.getFullYear();
  const mm = pad(dt.getMonth() + 1);
  const dd = pad(dt.getDate());
  const hh = pad(dt.getHours());
  const min = pad(dt.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:00`;
}

function getTodayStr() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function isUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim());
}

function normalizeResource(data, id) {
  if (!data) return null;

  const rawLocation = data.location || '';
  const rawLocationName = data.location_name || data.locationLabel || '';
  const locationUrl = isUrl(rawLocation) ? rawLocation : '';
  const locationLabel = rawLocationName || (locationUrl ? 'Open location' : rawLocation);

  return {
    name: data.name || data.resource_name || `Resource #${id}`,
    location: locationLabel,
    locationUrl,
    capacity: data.capacity,
  };
}

function Booking({ isAdmin = false }) {
  const session = getStoredSession();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const resourceFromState = normalizeResource(location.state?.resource, id);

  const [resource, setResource] = useState(resourceFromState || null);
  const [loadingResource, setLoadingResource] = useState(!resourceFromState);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (resourceFromState) return;

    setLoadingResource(true);
    apiRequest(`/resources/${id}`)
      .then((data) => setResource(normalizeResource(data, id)))
      .catch(() => setResource(null))
      .finally(() => setLoadingResource(false));
  }, [id, resourceFromState]);

  const endTimePreview =
    date && time && duration ? addHours(date, time, Number(duration)) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time || !duration) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    const start_time = formatDatetimeLocal(date, time);
    const end_time = addHours(date, time, Number(duration));

    setSubmitting(true);
    setMessage(null);

    try {
      const result = await apiRequest('/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resource_id: Number(id),
          start_time,
          end_time,
        }),
      });

      setMessage({
        type: 'success',
        text: result.message || 'Booking created successfully - awaiting approval.',
      });
      navigate('/bookings', {
        replace: true,
        state: {
          successMessage: result.message || 'Booking created successfully.',
        },
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Could not submit booking.' });
    } finally {
      setSubmitting(false);
    }
  };

  const resourceName = resource?.name || `Resource #${id}`;

  return (
    <div className="bp-root">
      <header className="bp-header">
        <Link to="/home" className="bp-header__brand">Resource Booking</Link>
        <div className="bp-header__right">
          {isAdmin && (
            <span className="bp-badge bp-badge--admin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Admin
            </span>
          )}
          <span className="bp-header__user">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {session.name || (isAdmin ? 'Admin' : 'User')}
          </span>
        </div>
      </header>

      <main className="bp-main">
        <div className="bp-panel">
          <div className="bp-breadcrumbs">
            <Link to="/home" className="bp-breadcrumbs__link">All Resources</Link>
            <span className="bp-breadcrumbs__divider">/</span>
            <span className="bp-breadcrumbs__current">{resourceName}</span>
          </div>
          <div className="bp-resource-card">
            {loadingResource ? (
              <div className="bp-resource-card__skeleton" />
            ) : resource ? (
              <>
                <div className="bp-resource-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                </div>
                <div className="bp-resource-card__info">
                  <p className="bp-resource-card__name">
                    <Link to="/home" className="bp-resource-card__home-link">
                      {resource.name}
                    </Link>
                  </p>
                  <div className="bp-resource-card__meta">
                    {resource.location && (
                      <span className="bp-resource-card__meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                          <circle cx="12" cy="9" r="2.5" />
                        </svg>
                        {resource.locationUrl ? (
                          <a
                            className="bp-resource-card__location-link"
                            href={resource.locationUrl}
                            target="_blank"
                            rel="noreferrer"
                            title={resource.location}
                          >
                            {resource.location}
                          </a>
                        ) : (
                          <span className="bp-resource-card__location-text" title={resource.location}>
                            {resource.location}
                          </span>
                        )}
                      </span>
                    )}
                    {resource.capacity && (
                      <span className="bp-resource-card__meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Capacity: {resource.capacity}
                      </span>
                    )}
                  </div>
                </div>
                <span className="bp-resource-card__id">#{id}</span>
              </>
            ) : (
              <p className="bp-resource-card__fallback">Resource #{id}</p>
            )}
          </div>

          <div className="bp-form-card">
            <div className="bp-form-card__head">
              <h2>Book Resource</h2>
              <p>Select your preferred date, time, and duration for <strong>{resourceName}</strong></p>
            </div>

            <form className="bp-form" onSubmit={handleSubmit}>
              <div className="bp-field">
                <label htmlFor="bp-date">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Date
                </label>
                <input
                  id="bp-date"
                  type="date"
                  min={getTodayStr()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="bp-field">
                <label htmlFor="bp-time">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Start Time
                </label>
                <select
                  id="bp-time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                >
                  <option value="" disabled>Choose a time slot</option>
                  {TIME_SLOTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="bp-field">
                <label htmlFor="bp-duration">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 8 14" />
                  </svg>
                  Duration
                </label>
                <select
                  id="bp-duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                >
                  <option value="" disabled>Choose duration</option>
                  {DURATION_OPTIONS.map((h) => (
                    <option key={h} value={h}>
                      {h < 1 ? '30 minutes' : h === 1 ? '1 hour' : `${h} hours`}
                    </option>
                  ))}
                </select>
              </div>

              {endTimePreview && (
                <div className="bp-summary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>
                    Booking window: <strong>{formatDatetimeLocal(date, time).replace('T', ' ').slice(0, 16)}</strong>
                    {' -> '}
                    <strong>{endTimePreview.replace('T', ' ').slice(0, 16)}</strong>
                  </span>
                </div>
              )}

              <div className="bp-notice">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Bookings require admin approval before they are confirmed.
              </div>

              {message && (
                <div className={`bp-message bp-message--${message.type}`}>
                  {message.type === 'success' ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                  {message.text}
                </div>
              )}

              <div className="bp-actions">
                <button type="button" className="bp-btn bp-btn--cancel" onClick={() => navigate(-1)}>
                  Cancel
                </button>
                <button type="submit" className="bp-btn bp-btn--submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="bp-spinner" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Booking'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Booking;
