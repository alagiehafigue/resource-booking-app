import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../componemts/Header';
import ResourceCard from '../componemts/ResourceCard';
import Footer from '../componemts/footer';
import './intropage.css';
import { API_BASE } from '../config/api';


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

function Intropage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAllResources, setShowAllResources] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/resources`);
        if (!res.ok) throw new Error('Failed to load resources');
        const data = await res.json();
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
      <Header />

      <section className="intro-hero">
        <h1 className="intro-hero__title">Manage. Reserve. Simplify.</h1>
        <p className="intro-hero__subtitle">
          Book laboratories, seminar halls, and equipment effortlessly anytime, anywhere.
        </p>
        <Link to="/signup" className="intro-hero__cta">
          Create account
        </Link>
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
                      isAuthenticated={false}
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
        <h2 className="intro-cta__title">Ready to Book Resources?</h2>
        <p className="intro-cta__text">
          <Link to="/signup" className="intro-cta__link">Create account</Link>
          {' '}and get started
        </p>
        <Link to="/" className="intro-cta__btn">
          Explore resources
        </Link>
      </section>

      <Footer />
    </div>
  );
}

export default Intropage;