import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AdminStack from "../Stacks/AdminStack.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthStack from "../Stacks/AuthStack.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AuthStack />} />
        <Route path="/App" element={<App />} />
        <Route path="/Admin" element={<AdminStack />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
