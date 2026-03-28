import { Link } from "react-router-dom";
import "./about.css";

function About() {
  return (
    <div className='about'>
      <section className='about__hero'>
        <h1>About Campus Resource Booking</h1>
        <p>
          A centralized platform that simplifies how students, faculty, and
          administrators manage and reserve campus facilities efficiently.
        </p>

        <Link to='/' className='about__homeBtn'>
          ← Back to Home
        </Link>
      </section>

      {/* Content */}
      <section className='about__content'>
        <div className='about__block'>
          <h2>What This System Solves</h2>
          <p>
            Universities often struggle with manual booking of auditoriums,
            laboratories, and classrooms. Double bookings, lack of tracking, and
            poor communication between users and administrators lead to
            confusion and wasted time. This system eliminates these problems
            through automation and transparency.
          </p>
        </div>

        <div className='about__block'>
          <h2>Who It Is For</h2>
          <ul>
            <li>Students booking rooms for academic activities</li>
            <li>Faculty reserving labs and seminar halls for lectures</li>
            <li>Administrators managing approvals and monitoring usage</li>
          </ul>
        </div>

        <div className='about__block'>
          <h2>Core Features</h2>
          <ul>
            <li>View all available campus resources in one place</li>
            <li>Book resources by selecting date, time, and duration</li>
            <li>Admin approval workflow to control usage</li>
            <li>Role-based access for students, faculty, and admins</li>
            <li>Notifications for booking updates</li>
            <li>Secure authentication using JWT and cookies</li>
          </ul>
        </div>

        <div className='about__block'>
          <h2>Why It Matters</h2>
          <p>
            By digitizing the booking process, the system improves
            accountability, saves time, and ensures fair and organized usage of
            campus facilities. It provides a reliable solution for modern campus
            management.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
