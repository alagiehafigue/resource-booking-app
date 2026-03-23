import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ResourceCard from '../componemts/ResourceCard';
import ConfirmDialog from '../componemts/ConfirmDialog';
import Footer from '../componemts/footer';
import './intropage.css';
import LOGO from "../assets/LOGO.png";
import { apiRequest, logoutSession } from '../Auth/authApi';
import { getStoredSession } from '../Auth/session';


const INITIAL_RESOURCE_COUNT = 6;
const CATEGORIES = [
  { label: 'ICT Labs', slug: 'ict-labs', match: ['lab', 'ict', 'computer'] },
  { label: 'Class rooms', slug: 'class', match: ['class', 'room'] },
  { label: 'Auditoriums', slug: 'auditoriums', match: ['auditorium', 'hall'] },
];

/**
 * Maps API resource to category label for filtering.
 * Uses resource_type and resource_name to determine category.
 */
function getCategoryFromResource(resource) {
  const type = (resource.resource_type || '').toLowerCase();
  const name = (resource.resource_name || resource.name || '').toLowerCase();
  const search = `${type} ${name}`;

  for (const cat of CATEGORIES) {
    if (cat.match.some((m) => search.includes(m))) return cat.label;
  }
  return null;
}

/**
 * Normalizes API resource to ResourceCard props.
 */
function normalizeResource(apiResource) {
  return {
    id: apiResource.resource_id,
    name: apiResource.resource_name,
    image: apiResource.image_url,
    location: apiResource.location,
    capacity: apiResource.capacity,
    description: apiResource.description,
    available: apiResource.availability_status !== false,
    resource_type: apiResource.resource_type,
  };
}

function UserHomepage() {
  const session = getStoredSession();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAllResources, setShowAllResources] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiRequest('/resources');
        const list = Array.isArray(data) ? data : data.resources || data.data || [];
        setResources(list);
      } catch (err) {
        setError(err.message || 'Could not load resources');
        setResources([]);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, []);

  const toggleCategory = (label) => {
    setSelectedCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setShowAllResources(true);
    setFilterOpen(false);
  };

  const filteredResources =
    selectedCategories.length === 0
      ? resources
      : resources.filter((r) => {
          const cat = getCategoryFromResource(r);
          return cat && selectedCategories.includes(cat);
        });

  const displayedResources = showAllResources
    ? filteredResources
    : filteredResources.slice(0, INITIAL_RESOURCE_COUNT);
  const hasMoreToShow =
    filteredResources.length > INITIAL_RESOURCE_COUNT && !showAllResources;

  return (
    <div className="intropage">
      {/* User header with profile menu */}
      <header className="user-header">
        <img src={LOGO} className="user-header__logo" />
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
              <button type="button" className="user-header__menu-item">
                <span className="user-header__menu-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <span>View Profile</span>
              </button>
              <button type="button" className="user-header__menu-item">
                <span className="user-header__menu-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.82-.33l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 15 8.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 15z" />
                  </svg>
                </span>
                <span>Settings</span>
              </button>
              <button
                type="button"
                className="user-header__menu-item user-header__menu-item--logout"
                onClick={() => setConfirmOpen(true)}
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

      <section className="intro-hero">
        <h1 className="intro-hero__title">Manage. Reserve. Simplify.</h1>
        <p className="intro-hero__subtitle">
          Book laboratories, seminar halls, and equipment effortlessly anytime, anywhere.
        </p>
        <div className="intro-hero__actions">
          <Link to="/bookings" className="intro-hero__cta">
            View My Bookings
          </Link>
          <button type="button" className="intro-hero__cta intro-hero__cta--secondary" onClick={clearFilters}>
            Show All Resources
          </button>
        </div>
      </section>

      <section className="intro-resources">
        <div className="intro-resources__header">
          <h2 className="intro-resources__title">Resources</h2>
          <button
            type="button"
            className="intro-resources__filter-trigger"
            aria-label="Filter by category"
            onClick={() => setFilterOpen(true)}
          >
            <span>Filter by</span>
            <svg className="intro-resources__filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
              <line x1="6" y1="4" x2="6" y2="20" />
              <line x1="18" y1="4" x2="18" y2="20" />
            </svg>
          </button>
        </div>

        {/* Mobile filter modal */}
        <div
          className={`intro-resources__filter-modal ${filterOpen ? 'intro-resources__filter-modal--open' : ''}`}
          aria-hidden={!filterOpen}
          onClick={() => setFilterOpen(false)}
        >
          <div className="intro-resources__filter-modal-inner" onClick={(e) => e.stopPropagation()}>
            <div className="intro-resources__filter-modal-header">
              <button
                type="button"
                className="intro-resources__filter-modal-close"
                aria-label="Close filter"
                onClick={() => setFilterOpen(false)}
              >
                <span>Close</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="intro-resources__filter-modal-body">
              <div className="intro-resources__filter-modal-title-row">
                <h3 className="intro-resources__filter-modal-heading">Filter by</h3>
                <button type="button" className="intro-resources__filter-modal-show-all" onClick={clearFilters}>
                  Show all
                </button>
              </div>
              <p className="intro-resources__filter-modal-label">Category</p>
              <ul className="intro-resources__filter-modal-list">
                {CATEGORIES.map((cat) => (
                  <li key={cat.slug} className="intro-resources__filter-modal-item">
                    <label className="intro-resources__checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.label)}
                        onChange={() => toggleCategory(cat.label)}
                      />
                      <span>{cat.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="intro-resources__layout">
          <aside className="intro-resources__sidebar">
            <button
              type="button"
              className="intro-resources__show-all"
              onClick={clearFilters}
            >
              Show all
            </button>
            <h3 className="intro-resources__sidebar-heading">Filter by</h3>
            <p className="intro-resources__sidebar-label">Category</p>
            <ul className="intro-resources__sidebar-list">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug} className="intro-resources__sidebar-item">
                  <label className="intro-resources__checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.label)}
                      onChange={() => toggleCategory(cat.label)}
                    />
                    <span>{cat.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </aside>

          <div className="intro-resources__main">
            {loading && <p className="intro-resources__loading">Loading resources…</p>}
            {error && <p className="intro-resources__error">{error}</p>}
            {!loading && !error && displayedResources.length === 0 && (
              <p className="intro-resources__empty">No resources match your filters.</p>
            )}
            {!loading && !error && displayedResources.length > 0 && (
              <>
                <div className="intro-resources__grid">
                  {displayedResources.map((r) => (
                    <ResourceCard
                      key={r.resource_id}
                      resource={normalizeResource(r)}
                      isAuthenticated={session.isAuthenticated}
                    />
                  ))}
                </div>
                {hasMoreToShow && (
                  <div className="intro-resources__show-more-wrap">
                    <button
                      type="button"
                      className="intro-resources__show-more"
                      onClick={() => setShowAllResources(true)}
                    >
                      Show all
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="intro-cta">
        <h2 className="intro-cta__title">Good to have you signed in!</h2>
        <p className="intro-cta__text">
          Book easily, reserve easily
        </p>
        <button type="button" className="intro-cta__btn">
          Explore resources
        </button>
      </section>

      <Footer />
      <ConfirmDialog
        open={confirmOpen}
        title="Log out now?"
        message="You will be signed out of this account on the current browser."
        confirmLabel="Log Out"
        cancelLabel="Stay Here"
        tone="warning"
        onConfirm={() => logoutSession()}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

export default UserHomepage;
