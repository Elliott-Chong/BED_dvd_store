import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { AppContextWrapper } from "./context";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_BASE_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <AppContextWrapper>
        <Toaster />
        <App />
      </AppContextWrapper>
    </Router>
  </React.StrictMode>
);
