import "./services.css";

function Services() {
  return (
    <div className='services'>
      <div className='services__hero'>
        <h1>Our Services</h1>
        <p>
          A smart campus resource booking platform designed to simplify how
          students, faculty, and administrators reserve and manage university
          facilities.
        </p>
      </div>

      <div className='services__grid'>
        <div className='service__card'>
          <h2>Resource Discovery</h2>
          <p>
            Easily browse available auditoriums, ICT labs, classrooms and other
            campus facilities with full details including capacity, location,
            and availability status.
          </p>
        </div>

        <div className='service__card'>
          <h2>Online Booking System</h2>
          <p>
            Book any campus resource by selecting your preferred date, time and
            duration. The system prevents double bookings and ensures proper
            scheduling.
          </p>
        </div>

        <div className='service__card'>
          <h2>Admin Approval Workflow</h2>
          <p>
            All bookings are sent to administrators for approval, ensuring
            controlled usage of facilities and preventing misuse of resources.
          </p>
        </div>

        <div className='service__card'>
          <h2>Role-Based Access</h2>
          <p>
            Different experiences for students, faculty, and administrators with
            secure authentication and permission control.
          </p>
        </div>

        <div className='service__card'>
          <h2>Real-time Notifications</h2>
          <p>
            Users receive notifications when bookings are approved, rejected, or
            updated by administrators.
          </p>
        </div>

        <div className='service__card'>
          <h2>Secure Authentication</h2>
          <p>
            JWT-based authentication with refresh tokens and secure cookies to
            keep user sessions safe across devices.
          </p>
        </div>
      </div>

      <div className='services__footer-note'>
        <p>
          This system improves transparency, saves time, and ensures efficient
          management of campus facilities through automation and accountability.
        </p>
      </div>
    </div>
  );
}

export default Services;
