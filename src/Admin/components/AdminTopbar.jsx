import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";

export default function AdminTopbar({ adminName, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className='ah-topbar'>
      <div className='ah-topbar__left'>Resource management</div>
      <div className='ah-topbar__right'>
        <button
          type='button'
          className={`ah-chip ${isActive("/admin") ? "ah-chip--active" : ""}`}
          onClick={() => navigate("/admin")}
        >
          Dashboard
        </button>
        <button
          type='button'
          className={`ah-chip ${isActive("/admin/resources") ? "ah-chip--active" : ""}`}
          onClick={() => navigate("/admin/resources")}
        >
          Resource available
        </button>
        <div className='ah-admin-wrap'>
          <button
            type='button'
            className='ah-admin'
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              aria-hidden='true'
            >
              <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
            </svg>
            {adminName}
          </button>

          {menuOpen && (
            <div className='ah-admin-menu' role='menu'>
              <button
                type='button'
                className='ah-admin-menu__item'
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/admin/profile");
                }}
              >
                <span className='ah-admin-menu__icon'>
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
              </button>

              <button
                type='button'
                className='ah-admin-menu__item'
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/admin/settings");
                }}
              >
                <IoMdSettings />
                <span>Settings</span>
              </button>

              <button
                type='button'
                className='ah-admin-menu__item ah-admin-menu__item--logout'
                onClick={() => {
                  setMenuOpen(false);
                  onLogout?.();
                }}
              >
                <span className='ah-admin-menu__icon'>
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
      </div>
    </header>
  );
}
