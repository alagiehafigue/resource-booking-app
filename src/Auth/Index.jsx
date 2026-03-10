import styles from "./css/index_css.module.css";
import SigninSvg from "../assets/Signin.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  //variables for the data to be sent to backend
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //function to handle signin
  const handleSignIn = async () => {
    setLoading(true);
    setError("");

    //sending data to backend
    // try{
    //     response = await fetch()
    // }
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

          <form className={styles.form}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className={styles.input}
              placeholder="Enter your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className={styles.button}>Sign In</button>
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
