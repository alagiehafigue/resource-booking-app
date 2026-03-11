import styles from "./signIn.module.css";
import SigninSvg from "../assets/Signin.svg";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  //variables for the data to be sent to backend
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //function to handle signin
  const handleSignIn = async () => {
    setLoading(true);
    setError("");

    //sending data to backend
    // try{
    //     response = await fetch()
    // }

    // For now, go straight to user homepage
     setLoading(false);
    navigate("/home");
   
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
              <label htmlFor="username">Username</label>
              <div className={styles.inputWrap}>
                <input
                  type="text"
                  id="username"
                  className={styles.input}
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <svg className={styles.iconRight} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
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
