import { useState, useEffect } from 'react';
import ResourceCard from '../componemts/ResourceCard';
import ConfirmDialog from '../componemts/ConfirmDialog';
import Footer from '../componemts/footer';
import '../Pages/intropage.css';
import { apiFetch } from './components/adminApi';

const INITIAL_RESOURCE_COUNT = 6;
const CATEGORIES = [
  { label: 'ICT Labs', slug: 'ict-labs', match: ['lab', 'ict', 'computer'] },
  { label: 'Class rooms', slug: 'class', match: ['class', 'room'] },
  { label: 'Auditoriums', slug: 'auditoriums', match: ['auditorium', 'hall'] },
];

function getCategoryFromResource(resource) {
  const type = (resource.resource_type || '').toLowerCase();
  const name = (resource.resource_name || resource.name || '').toLowerCase();
  const search = `${type} ${name}`;

  for (const cat of CATEGORIES) {
    if (cat.match.some((m) => search.includes(m))) return cat.label;
  }
  return null;
}

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

function ResourceAvailable() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAllResources, setShowAllResources] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [confirmState, setConfirmState] = useState(null);
  const adminName = localStorage.getItem("admin_name") || "Admin";

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch('/resources', { method: 'GET' });
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

  const handleDelete = async (resourceId) => {
    try {
      await apiFetch(`/resources/${resourceId}`, {
        method: "DELETE",
      });
      setResources((prev) => prev.filter((r) => r.resource_id !== resourceId));
    } catch (err) {
      alert(err.message || "Could not delete resource");
    }
  };

  const askToDeleteResource = (resourceId, resourceName) => {
    setConfirmState({
      resourceId,
      title: 'Delete this resource?',
      message: `${resourceName} will be removed if there are no active bookings attached to it.`,
      confirmLabel: 'Delete Resource',
      cancelLabel: 'Keep Resource',
    });
  };

  return (
    <div className="intropage">
      <header className="ah-topbar">
        <div className="ah-topbar__left">Resource management</div>
        <div className="ah-topbar__right">
          <span className="ah-chip">Resource available</span>
          <span className="ah-admin">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            {adminName}
          </span>
        </div>
      </header>

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
            {loading && <p className="intro-resources__loading">Loading resources...</p>}
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
                      isAuthenticated={true}
                      isAdmin={true}
                      onDelete={() => askToDeleteResource(r.resource_id, r.resource_name)}
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
        open={Boolean(confirmState)}
        title={confirmState?.title}
        message={confirmState?.message}
        confirmLabel={confirmState?.confirmLabel}
        cancelLabel={confirmState?.cancelLabel}
        tone="danger"
        onConfirm={async () => {
          await handleDelete(confirmState.resourceId);
          setConfirmState(null);
        }}
        onCancel={() => setConfirmState(null)}
      />
    </div>
  );
}

export default ResourceAvailable;
