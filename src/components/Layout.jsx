import { Outlet } from 'react-router-dom';
import Footer from './footer';
import './layout.css';

/**
 * Layout wrapper for all pages. Ensures Footer appears at bottom.
 */
function Layout() {
  return (
    <div className="layout">
      <main className="layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
