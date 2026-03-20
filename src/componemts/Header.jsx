import { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import LOGO from "../assets/LOGO.png";

/**
 * Header for intropage.
 * Desktop: LOGO, HOME, ABOUT nav links, Login to portal button.
 * Mobile: LOGO, Login text, hamburger; menu overlay with HOME, ABOUT, Login to Portal.
 */
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="intro-header">
        <img src={LOGO} className="intro-header__logo" />
        {/* <Link to="/" className="intro-header__logo">LOGO</Link> */}
        <nav className="intro-header__nav">
          <Link to="/" className="intro-header__link">HOME</Link>
          <Link to="/about" className="intro-header__link">ABOUT</Link>
        </nav>
        <div className="intro-header__right">
          <Link to="/login" className="intro-header__login">Login to portal</Link>
          <button
            type="button"
            className="intro-header__icon-btn intro-header__icon-btn--menu"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`intro-header__menu-overlay ${menuOpen ? 'intro-header__menu-overlay--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="intro-header__menu-close"
          aria-label="Close menu"
          onClick={closeMenu}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <nav className="intro-header__menu-nav">
          <Link to="/about" className="intro-header__menu-link" onClick={closeMenu}>
            <span>ABOUT</span>
            <svg className="intro-header__menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
          <Link to="/" className="intro-header__menu-link" onClick={closeMenu}>
            <span>HOME</span>
            <svg className="intro-header__menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </nav>
        <div className="intro-header__menu-cta">
          <p className="intro-header__menu-cta-text">Login to start booking resources</p>
          <Link to="/login" className="intro-header__menu-cta-btn" onClick={closeMenu}>
            Login to Portal
          </Link>
        </div>
      </div>
    </>
  );
}

export default Header;
