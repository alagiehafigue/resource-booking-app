import { useLocation } from "react-router-dom";
import Index from "../src/Auth/signIn";
import CreateAccount from "../src/Auth/createAccount";

/**
 * Manages all authentication pages: login and signup.
 * Renders the appropriate page based on the current route.
 */
const AuthStack = () => {
  const location = useLocation();

  if (location.pathname === "/signup") {
    return <CreateAccount />;
  }

  return <Index />;
};

export default AuthStack;
