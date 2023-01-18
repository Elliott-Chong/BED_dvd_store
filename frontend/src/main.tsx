import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
axios.defaults.baseURL = import.meta.env.BACKEND_BASE_URL;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Toaster />
      <App />
    </Router>
  </React.StrictMode>
);
