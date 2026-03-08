import { Link } from 'react-router-dom';
import './resources.css';

/**
 * Single resource card displaying image, name, location, capacity,
 * availability badge, and action buttons (Follow direction, Book Resource).
 */
function ResourceCard({ resource, isAuthenticated, isAdmin = false }) {
  const { id, image, name, location, capacity, description, available = true } = resource;

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
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {location}
          </span>
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
          <button type="button" className="resource-card__btn resource-card__btn--secondary">
            <svg className="resource-card__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Follow direction
          </button>
          {isAuthenticated ? (
            <Link
              to={isAdmin ? `/admin/resource/${id}` : `/resource/${id}`}
              state={{ resource: { id, name, location, capacity, description } }}
              className="resource-card__btn resource-card__btn--primary"
            >
              Book Resource
            </Link>
          ) : (
            <span className="resource-card__hint">Sign in to book</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ResourceCard;
