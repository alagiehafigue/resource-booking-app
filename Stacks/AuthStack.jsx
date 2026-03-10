import { Route, Routes } from "react-router-dom";
import Index from "../src/Auth/Index";
import CreateAccount from "../src/Auth/createAccount";

const AuthStack = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/create" element={<CreateAccount />} />
    </Routes>
  );
};

export default AuthStack;
