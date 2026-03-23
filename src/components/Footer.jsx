import { Link } from "react-router-dom";
import "./footer.css";

/**
 * Reusable footer component for use across multiple screens.
 * Two columns: Resources (Auditoriums, I.C.T labs, Class) and Read about us (Our services, Blog).
 */
function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__top-border' />
      <div className='footer__content'>
        <div className='footer__column'>
          <h3 className='footer__heading'>Resources</h3>
          <ul className='footer__list'>
            <li>
              <Link to='' className='footer__link'>
                Auditoriums
              </Link>
            </li>
            <li>
              <Link to='' className='footer__link'>
                I.C.T labs
              </Link>
            </li>
            <li>
              <Link to='' className='footer__link'>
                Class
              </Link>
            </li>
          </ul>
        </div>
        <div className='footer__column'>
          <h3 className='footer__heading'>Read about us</h3>
          <ul className='footer__list'>
            <li>
              <Link to='/services' className='footer__link'>
                Our services
              </Link>
            </li>
            <li>
              <Link to='/blog' className='footer__link'>
                Blog
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className='footer__copyright'>© 2026, all right reserved</p>
    </footer>
  );
}

export default Footer;
