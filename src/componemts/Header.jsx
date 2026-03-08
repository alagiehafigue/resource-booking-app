import { Link } from 'react-router-dom';
import './header.css';

/**
 * Header for intropage.
 * Desktop: LOGO, HOME, ABOUT nav links, Login to portal button.
 * Mobile: LOGO, user icon, hamburger menu.
 */
function Header() {
  return (
    <header className="intro-header">
      <Link to="/" className="intro-header__logo">LOGO</Link>
      <nav className="intro-header__nav">
        <Link to="/" className="intro-header__link">HOME</Link>
        <Link to="/Admin" className="intro-header__link">ABOUT</Link>
      </nav>
      <div className="intro-header__right">
        <button type="button" className="intro-header__login">Login to portal</button>
        <button type="button" className="intro-header__icon-btn intro-header__icon-btn--user" aria-label="User">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
        <button type="button" className="intro-header__icon-btn intro-header__icon-btn--menu" aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Header;
