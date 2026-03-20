import styles from "./signup.module.css";
import Create from "../assets/create.svg";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const navigate = useNavigate();

  //variables to hold data for backend
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // confirmPassword: "",
    check: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //function that handles change in form data
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  //function that submits data to backend
  const handleSubmit = async (e) => {
    //prevent refreshing
    e.preventDefault();

    //validation
    if (
      !formData.name ||
      !formData.password ||
      !formData.email 

    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!formData.check) {
      setError("You must agree to terms and conditions");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://resource-booking-backend.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else setError(data.message || "something went wrong");
    } catch {
      setError("Could not connect to Server");
    } finally {
      setLoading(false);
    }
  };

  console.log(error);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div
          className={styles.left}
          style={{ backgroundImage: `url(${Create})` }}
        >
          <h2 style={{ padding: 10, color: "white" }}>
            Welcome to CampusReserve
          </h2>
          <ul>
            <li style={{ color: "white", paddingBottom: 15 }}>
              Create your account to start booking campus resources
            </li>
            <li style={{ color: "white" }}>
              Choose your role and enjoy seamless resource reservation
              management
            </li>
          </ul>
        </div>
        <div className={styles.right}>
          <div className={styles.head}>
            <h2>Create Account</h2>
            <small>Join our resource booking system</small>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* full name */}
            <div className={styles.field}>
              <label htmlFor="name">Full Name</label>
              <div className={styles.inputWrap}>
                <input
                  id="name"
                  className={styles.input}
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your full name"
                />
                <svg className={styles.iconRight} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            {/* Email */}
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrap}>
                <input
                  id="email"
                  className={styles.input}
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Enter your email"
                />
                <svg className={styles.iconRight} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16v16H4z" opacity="0" />
                  <path d="M4 8l8 5 8-5" />
                  <path d="M4 8v12h16V8" />
                </svg>
              </div>
            </div>

            {/* password */}
            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrap}>
                <input
                  id="password"
                  className={styles.input}
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="Create a password"
                />
                <svg className={styles.iconRight} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </div>

            {/* Role */}
            

            {/* checkbox */}
            <div className={styles.check}>
              <input
                id="check"
                checked={formData.check}
                onChange={handleChange}
                type="checkbox"
              />
              <label htmlFor="check">I agree to terms and conditions</label>
            </div>
            {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign up"}
            </button>
            <p className={styles.authFooter}>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreateAccount;
