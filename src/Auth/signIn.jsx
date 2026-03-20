import styles from "./signIn.module.css";
import SigninSvg from "../assets/Signin.svg";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";

const Index = () => {
  //variables for the data to be sent to backend
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //function to handle signin
  const handleSignIn = async () => {
  setLoading(true);
  setError("");

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      credentials: "include"
    });

    const data = await response.json();

    if (response.ok) {
      // Save token and user info to localStorage
     
      localStorage.setItem("user_name", data.user.name);
      localStorage.setItem("user_role", data.user.role);

      // Redirect based on role
      if (data.user.role === "admin") {
        localStorage.setItem("admin_name", data.user.name);
        navigate("/Admin", {replace: true});
      } else {
        navigate("/home", {replace: true}); // student goes to user homepage
      }
    } else if(response.status ===429) {
      setError("Too many attemps. Please wai a few minutes, and try again ");
    } else if(response.status === 401){
      setError ("Incorrect email or password. Please try again")

    }else {
      setError(data.message || "Invalid email or password")
    }
  } catch {
    setError("Could not connect to server. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div
          className={styles.left}
          style={{
            backgroundImage: `url(${SigninSvg})`,
            backgroundSize: "cover",
          }}
        >
          {/* <img src={SigninSvg} className={styles.img} /> */}

        </div>
        <div className={styles.right}>
          <div className={styles.head}>
            <h2 className="h">Welcome Back</h2>
            <p className={styles.small}>Sign In to your account</p>
          </div>

          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              handleSignIn();
            }}
          >
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrap}>
                <input
                 type="email"
                  id="email"
                  className={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              
                <svg className={styles.iconRight} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16v16H4z" opacity="0" />
                    <path d="M4 8l8 5 8-5" />
                    <path d="M4 8v12h16V8" />
                </svg>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
          <p className={styles.authFooter}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
