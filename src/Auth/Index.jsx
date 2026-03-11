import styles from "./css/index_css.module.css";
import SigninSvg from "../assets/Signin.svg";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  //variables for the data to be sent to backend
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  //function to handle signin
  const handleSignIn = async () => {
    //validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    //sending data to backend
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://resource-booking-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        },
      );
      const data = await response.json();
      console.log("status:", response.status); // what status code
      console.log("ok:", response.ok); // true or false
      console.log("data:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        console.log(data);
        navigate("/App");
      } else if (response.status === 401) {
        setError("Incorrect Email or Password");
      } else if (response.status === 404) {
        setError("Account does not exist");
      } else setError(data.message || "Something went wrong");
    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
    console.log(error);
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
            <h2 className="h">Welcome back</h2>
            <p className={styles.small}>Sign In to your account</p>
          </div>

          {error && <p className={styles.error}>{error}</p>}
          <form className={styles.form}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className={styles.button}
              onClick={handleSignIn}
              type="button"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p>
            Don't have an account?<Link to={"/create"}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
