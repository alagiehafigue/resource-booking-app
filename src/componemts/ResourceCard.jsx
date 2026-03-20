import { Link, useNavigate } from 'react-router-dom';
import './resources.css';

/**
 * Single resource card displaying image, name, location, capacity,
 * availability badge, and action buttons (Follow direction, Book Resource).
 * When not authenticated, Book Resource alerts user to create account and redirects to signup.
 */
function ResourceCard({ resource, isAuthenticated, isAdmin = false, onDelete = () => {} }) {
  const navigate = useNavigate();
  const { id, image, name, location, capacity, description, available = true } = resource;

  const mapsUrl = location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
    : null;

  const handleBookResource = () => {
    if (!isAuthenticated) {
      alert('Please create an account first to book resources.');
      navigate('/signup');
    }
  };

  return (
    <article className="resource-card">
      <div className="resource-card__image-wrap">
        <img
          src={image || '/placeholder-resource.jpg'}
          alt={name}
          className="resource-card__image"
        />
        <span className={`resource-card__badge ${available ? 'resource-card__badge--available' : 'resource-card__badge--unavailable'}`}>
          {available ? 'Available' : 'Not available'}
        </span>
      </div>
      <div className="resource-card__body">
        <h3 className="resource-card__title">{name}</h3>
        {description && <p className="resource-card__description">{description}</p>}
        <div className="resource-card__meta">
          <span className="resource-card__meta-item">
            <svg className="resource-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Capacity: {capacity}
          </span>
        </div>
        <div className="resource-card__actions">
          {mapsUrl ? (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="resource-card__btn resource-card__btn--secondary"
            >
              <svg className="resource-card__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Follow direction
            </a>
          ) : (
            <button type="button" className="resource-card__btn resource-card__btn--secondary" disabled>
              <svg className="resource-card__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Follow direction
            </button>
          )}
          {isAuthenticated ? (
            <Link
              to={isAdmin ? `/admin/resource/${id}` : `/resource/${id}`}
              state={{ resource: { id, name, location, capacity, description } }}
              className="resource-card__btn resource-card__btn--primary"
            >
              Book Resource
            </Link>
          ) : (
            <button
              type="button"
              className="resource-card__btn resource-card__btn--primary"
              onClick={handleBookResource}
            >
              Book Resource
            </button>
          )}
        {/* Delete button — only visible to admin */}
          {isAdmin && onDelete && (
            <button
              type="button"
              className="resource-card__btn resource-card__btn--danger"
              onClick={onDelete}
            >
              <svg className="resource-card__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
              Delete
            </button>
          )}  
        </div>
      </div>
    </article>
  );
}

export default ResourceCard;
