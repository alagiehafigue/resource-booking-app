import styles from "./css/index_css.module.css";
import Create from "../assets/create.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  //variables to hold data for backend
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // confirmPassword: "",
    check: false,
    role: "",
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
      !formData.email ||
      !formData.role
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!formData.check) {
      setError("You must agree to terms and conditions");
    }

    setLoading(true);
    setError("");
    try {
      const response = fetch(
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

      const data = await response.json;

      if (response.ok) {
        useNavigate().navigate("/App");
      } else setError(data.message || "something went wrong");
    } catch (err) {
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
          <form className={styles.form}>
            {/* full name */}
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Spongebob Squarepants"
            />

            {/* Email */}
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="spongebobsquarepants@bikinibottom.com"
            />

            {/* password */}
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
              type="password"
            />

            {/* Role */}
            <label htmlFor="role">Role</label>
            <select
              id="role"
              className={styles.input}
              value={formData.role}
              onChange={handleChange}
              type="select"
            >
              <option value="">Select a Role</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>

            {/* checkbox */}
            <div className={styles.check}>
              <input
                id="check"
                className={styles.input}
                value={formData.check}
                onChange={handleChange}
                type="checkbox"
              />
              <label htmlFor="check">I agree to terms and conditions</label>
            </div>
            <button className={styles.button} onClick={handleSubmit}>
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreateAccount;
